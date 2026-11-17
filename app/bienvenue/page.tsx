import type { Metadata } from "next";
import type Stripe from "stripe";
import Link from "next/link";
import Logo from "@/components/Logo";
import EspaceClient from "@/components/EspaceClient";
import Rafraichir from "@/components/Rafraichir";
import { db, stripe, type AbonnementDB, type BoutiqueDB } from "@/lib/serveur";

export const metadata: Metadata = {
  title: "Bienvenue",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const COLONNES =
  "id, email, nom, url, ton, signature, produit_phare, code_promo_actif, code_promo_pourcentage, token_acces";

export default async function Bienvenue({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;

  if (!session_id || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(session_id)) {
    return <Echec titre="Ce lien de confirmation n'est pas valide." />;
  }

  // 1. On demande à Stripe, côté serveur, l'état réel du paiement.
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe().checkout.sessions.retrieve(session_id);
  } catch {
    return <Echec titre="Ce lien de confirmation n'est pas valide." />;
  }
  if (session.status !== "complete") {
    return (
      <Echec
        titre="Le paiement n'a pas abouti."
        texte="Aucun montant n'a été débité. Tu peux réessayer avec la même carte ou une autre."
      />
    );
  }

  // 2. L'accès s'ouvre seulement quand le webhook a enregistré l'abonnement.
  const { data: abo } = await db()
    .from("abonnements")
    .select("formule, statut, fin_periode, boutique_id")
    .eq("stripe_checkout_session_id", session_id)
    .maybeSingle();

  if (!abo) {
    return (
      <Cadre>
        <div className="py-12">
          <h1 className="titre text-3xl">Paiement reçu. On ouvre ton accès…</h1>
          <p className="mt-3 text-gris">Ça prend quelques secondes.</p>
          <Rafraichir />
        </div>
      </Cadre>
    );
  }

  const { data: boutique } = await db().from("boutiques").select(COLONNES).eq("id", abo.boutique_id).single();
  if (!boutique) return <Echec titre="Ton accès est introuvable." />;

  return (
    <Cadre>
      <EspaceClient
        boutique={boutique as BoutiqueDB}
        abonnement={abo as AbonnementDB}
        recupere={0}
        bienvenue
      />
    </Cadre>
  );
}

function Cadre({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-xl px-5 pt-5 pb-10">
      <Logo />
      {children}
    </main>
  );
}

function Echec({ titre, texte }: { titre: string; texte?: string }) {
  return (
    <Cadre>
      <div className="py-12">
        <h1 className="titre text-3xl">{titre}</h1>
        {texte && <p className="mt-3 text-gris">{texte}</p>}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/apercu"
            className="inline-flex min-h-14 items-center justify-center rounded-md bg-tomate px-7 text-lg font-bold text-white hover:bg-tomate-fonce"
          >
            Revenir au paiement
          </Link>
          <Link href="/" className="inline-flex min-h-14 items-center justify-center px-4 font-semibold text-billet underline">
            Revenir à l&apos;accueil
          </Link>
        </div>
      </div>
    </Cadre>
  );
}
