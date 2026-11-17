import { stripe } from "@/lib/serveur";

// Crée une session de paiement Stripe intégrée à la page (abonnement).
// Toutes les entrées sont revalidées ici, côté serveur.

const TARIFS = {
  mensuel: { montant: 2900, intervalle: "month" as const, nom: "Panier Perdu — formule mensuelle" },
  annuel: { montant: 29000, intervalle: "year" as const, nom: "Panier Perdu — formule annuelle" },
};

function texte(v: unknown, max: number): string {
  return typeof v === "string" ? v.replace(/[\u0000-\u001f]/g, "").trim().slice(0, max) : "";
}

function entier(v: unknown, min: number, max: number): string {
  const n = typeof v === "number" ? Math.round(v) : NaN;
  return Number.isFinite(n) && n >= min && n <= max ? String(n) : "";
}

export async function POST(req: Request) {
  let corps: Record<string, unknown>;
  try {
    corps = await req.json();
  } catch {
    return Response.json({ erreur: "Requête invalide." }, { status: 400 });
  }

  const formule = corps.formule === "mensuel" ? "mensuel" : corps.formule === "annuel" ? "annuel" : null;
  const b = (corps.boutique ?? {}) as Record<string, unknown>;
  const d = (corps.diagnostic ?? {}) as Record<string, unknown>;
  const nom = texte(b.nom, 60);

  if (!formule || nom.length < 2) {
    return Response.json({ erreur: "Informations manquantes." }, { status: 400 });
  }

  const metadata = {
    formule,
    boutique_nom: nom,
    boutique_produit: texte(b.produit, 80),
    boutique_signature: texte(b.signature, 40),
    boutique_ton: b.ton === "tu" ? "tu" : "vous",
    commandes_mois: entier(d.commandes, 0, 100000),
    panier_moyen: entier(d.panier, 0, 100000),
  };

  const t = TARIFS[formule];
  const origine = new URL(req.url).origin;

  try {
    const session = await stripe().checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      locale: "fr",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: t.montant,
            recurring: { interval: t.intervalle },
            product_data: { name: t.nom },
          },
        },
      ],
      billing_address_collection: "required",
      tax_id_collection: { enabled: true },
      metadata,
      subscription_data: { metadata },
      return_url: `${origine}/bienvenue?session_id={CHECKOUT_SESSION_ID}`,
    });
    return Response.json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error("Création de la session Stripe impossible", e);
    return Response.json({ erreur: "Le paiement est momentanément indisponible." }, { status: 500 });
  }
}
