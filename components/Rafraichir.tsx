"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Recharge la page toutes les 3 secondes, 10 fois au maximum,
// le temps que le webhook Stripe confirme le paiement.
export default function Rafraichir() {
  const router = useRouter();
  const [essais, setEssais] = useState(0);

  useEffect(() => {
    if (essais >= 10) return;
    const t = setTimeout(() => {
      router.refresh();
      setEssais((n) => n + 1);
    }, 3000);
    return () => clearTimeout(t);
  }, [essais, router]);

  if (essais >= 10) {
    return (
      <p className="mt-4 text-[0.95rem]">
        Ça prend plus de temps que prévu. Ton paiement est bien enregistré : recharge la page dans une minute, ou
        réponds à l&apos;e-mail de confirmation de Stripe et on s&apos;en occupe.
      </p>
    );
  }
  return <p className="mt-4 text-sm text-gris">Vérification en cours…</p>;
}
