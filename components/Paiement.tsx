"use client";

import { useCallback, useMemo, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import type { Boutique } from "@/lib/relances";

const CLE_PUBLIQUE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export default function Paiement({
  formule,
  boutique,
  diagnostic,
}: {
  formule: "mensuel" | "annuel";
  boutique: Boutique;
  diagnostic: { commandes: number; panier: number } | null;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [erreur, setErreur] = useState("");
  const [essai, setEssai] = useState(0);

  // Stripe.js n'est chargé qu'au moment où la personne veut payer.
  const stripePromise = useMemo(() => (ouvert && CLE_PUBLIQUE ? loadStripe(CLE_PUBLIQUE) : null), [ouvert]);

  const fetchClientSecret = useCallback(async () => {
    const r = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        formule,
        boutique,
        diagnostic: diagnostic ? { commandes: diagnostic.commandes, panier: diagnostic.panier } : null,
      }),
    });
    const j = (await r.json().catch(() => ({}))) as { clientSecret?: string; erreur?: string };
    if (!r.ok || !j.clientSecret) {
      setErreur(j.erreur ?? "Le paiement est momentanément indisponible.");
      throw new Error("Session de paiement non créée");
    }
    return j.clientSecret;
  }, [formule, boutique, diagnostic]);

  const mention = (
    <p className="mt-2 text-center text-sm font-semibold">Sans engagement, résiliable à tout moment.</p>
  );

  if (!ouvert) {
    return (
      <div>
        <button
          type="button"
          onClick={() => {
            setOuvert(true);
            try {
              window.umami?.track("ouverture-paiement", { formule });
            } catch {
              /* rien */
            }
          }}
          className="flex min-h-14 w-full items-center justify-center rounded-md bg-tomate px-7 text-lg font-bold text-white transition-colors hover:bg-tomate-fonce"
        >
          Activer mes relances
        </button>
        {mention}
      </div>
    );
  }

  if (!stripePromise) {
    return (
      <p role="alert" className="font-semibold text-tomate">
        Le paiement est momentanément indisponible. Réessaie dans quelques minutes.
      </p>
    );
  }

  if (erreur) {
    return (
      <div role="alert">
        <p className="font-semibold text-tomate">{erreur} Aucun montant n&apos;a été débité.</p>
        <button
          type="button"
          onClick={() => {
            setErreur("");
            setEssai((n) => n + 1);
          }}
          className="mt-3 min-h-11 font-semibold text-billet underline"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {mention}
      <div className="mt-3 -mx-1">
        <EmbeddedCheckoutProvider key={`${formule}-${essai}`} stripe={stripePromise} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    </div>
  );
}
