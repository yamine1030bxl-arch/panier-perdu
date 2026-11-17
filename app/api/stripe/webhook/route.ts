import type Stripe from "stripe";
import { db, secretWebhook, stripe } from "@/lib/serveur";

// Webhook Stripe : la SEULE source de vérité pour ouvrir ou fermer un accès.
// Chaque appel est authentifié par la signature Stripe.

export async function POST(req: Request) {
  const corps = await req.text();
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new Response("Signature manquante", { status: 400 });

  let evenement: Stripe.Event;
  try {
    evenement = stripe().webhooks.constructEvent(corps, signature, secretWebhook());
  } catch {
    return new Response("Signature invalide", { status: 400 });
  }

  try {
    switch (evenement.type) {
      case "checkout.session.completed":
        await paiementConfirme(evenement.data.object);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await abonnementModifie(evenement.data.object);
        break;
    }
  } catch (e) {
    console.error("Webhook Stripe en échec", evenement.type, e);
    return new Response("Erreur de traitement", { status: 500 }); // Stripe réessaiera
  }

  return Response.json({ recu: true });
}

function finPeriode(sub: Stripe.Subscription): string | null {
  const item = sub.items?.data?.[0] as unknown as { current_period_end?: number } | undefined;
  const ancien = (sub as unknown as { current_period_end?: number }).current_period_end;
  const ts = item?.current_period_end ?? ancien;
  return ts ? new Date(ts * 1000).toISOString() : null;
}

function statutDepuis(sub: Stripe.Subscription): "actif" | "impaye" | "annule" {
  if (sub.status === "active" || sub.status === "trialing") return "actif";
  if (sub.status === "past_due" || sub.status === "unpaid" || sub.status === "incomplete") return "impaye";
  return "annule";
}

async function paiementConfirme(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription" || session.status !== "complete") return;

  // Déjà traité ? (Stripe peut envoyer le même événement plusieurs fois)
  const { data: existant } = await db()
    .from("abonnements")
    .select("id")
    .eq("stripe_checkout_session_id", session.id)
    .maybeSingle();
  if (existant) return;

  const m = session.metadata ?? {};
  const email = session.customer_details?.email;
  if (!email) throw new Error("E-mail client absent de la session");

  const { data: boutique, error: e1 } = await db()
    .from("boutiques")
    .insert({
      email,
      nom: m.boutique_nom || "Ma boutique",
      produit_phare: m.boutique_produit || null,
      signature: m.boutique_signature || null,
      ton: m.boutique_ton === "tu" ? "tu" : "vous",
      commandes_mois: m.commandes_mois ? Number(m.commandes_mois) : null,
      panier_moyen: m.panier_moyen ? Number(m.panier_moyen) : null,
    })
    .select("id")
    .single();
  if (e1 || !boutique) throw e1 ?? new Error("Boutique non créée");

  const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
  const sub = subId ? await stripe().subscriptions.retrieve(subId) : null;

  const { error: e2 } = await db()
    .from("abonnements")
    .insert({
      boutique_id: boutique.id,
      stripe_customer_id: typeof session.customer === "string" ? session.customer : session.customer?.id,
      stripe_subscription_id: subId ?? null,
      stripe_checkout_session_id: session.id,
      formule: m.formule === "annuel" ? "annuel" : "mensuel",
      statut: sub ? statutDepuis(sub) : "actif",
      fin_periode: sub ? finPeriode(sub) : null,
    });
  if (e2) {
    await db().from("boutiques").delete().eq("id", boutique.id); // pas de boutique orpheline
    throw e2;
  }
}

async function abonnementModifie(sub: Stripe.Subscription) {
  const { error } = await db()
    .from("abonnements")
    .update({ statut: statutDepuis(sub), fin_periode: finPeriode(sub) })
    .eq("stripe_subscription_id", sub.id);
  if (error) throw error;
}
