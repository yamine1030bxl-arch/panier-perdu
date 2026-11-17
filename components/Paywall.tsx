"use client";

import { useState } from "react";
import { euros } from "@/lib/diagnostic";
import type { Boutique } from "@/lib/relances";
import Paiement from "@/components/Paiement";

export type DiagnosticStocke = {
  commandes: number;
  panier: number;
  recupere: number;
  net: number;
  netAnnuel: number;
  verdict: "rentable" | "juste" | "non-rentable";
};

export const FORMULES = {
  mensuel: { nom: "Mensuel", prix: "29 €", periode: "par mois", parJour: "0,97 €", detail: "Facturé chaque mois" },
  annuel: { nom: "Annuel", prix: "24,17 €", periode: "par mois", parJour: "0,79 €", detail: "290 € facturés une fois par an · 2 mois offerts" },
} as const;

export type Formule = keyof typeof FORMULES;

const FAQ = [
  {
    q: "Est-ce que ça marche pour ma boutique ?",
    r: "Oui si tu es sur WooCommerce et que tu reçois au moins une vingtaine de commandes par mois. Panier Perdu relance les clients qui ont saisi leur e-mail avant de partir : c'est le cas d'une bonne partie des abandons au moment du paiement. En dessous de 20 commandes par mois, le diagnostic te dit franchement si ça vaut le coup.",
  },
  {
    q: "Combien de temps ça me prend ?",
    r: "Une dizaine de minutes, une seule fois : installer l'extension sur ta boutique et relire tes deux relances. Ensuite, tout part tout seul. Pendant le lancement, on fait l'activation avec toi, sous 7 jours.",
  },
  {
    q: "Qu'est-ce qui se passe si je veux arrêter ?",
    r: "Tu résilies en un e-mail, quand tu veux, sans justification. Les relances s'arrêtent à la fin de la période payée et plus rien n'est prélevé. Et dans les 30 premiers jours, tu es intégralement remboursé.",
  },
  {
    q: "À quoi sert exactement ce que je paie ?",
    r: "À détecter chaque panier abandonné, envoyer les deux relances au bon moment, créer le code de réduction si tu l'actives, et compter en euros les ventes récupérées. Relances illimitées, aucune commission sur tes ventes : 29 € par mois, c'est tout.",
  },
];

export default function Paywall({
  boutique,
  diagnostic,
}: {
  boutique: Boutique;
  diagnostic: DiagnosticStocke | null;
}) {
  const [formule, setFormule] = useState<Formule>("annuel");
  const f = FORMULES[formule];
  const prixMensuel = formule === "annuel" ? 24.17 : 29;

  return (
    <section className="border-t border-trait py-8" aria-labelledby="paywall-titre">
      {/* 1. Ce qui a été fait pour elle */}
      <h2 id="paywall-titre" className="titre text-[1.6rem] sm:text-3xl">
        Voilà tes relances pour {boutique.nom}, prêtes.
      </h2>
      <ul className="chiffre mt-4 space-y-1.5 text-[0.95rem]">
        <li>✓ Relance 1, écrite</li>
        <li>✓ Relance 2, écrite</li>
        <li>✓ Code -10 % prêt, à activer si tu veux</li>
        <li className="text-gris">○ Branchement à ta boutique</li>
      </ul>
      <p className="mt-3 text-gris">Il ne reste qu&apos;à les brancher pour qu&apos;elles partent toutes seules.</p>

      {/* 2. Ce que ça rapporte, comparé au prix */}
      {diagnostic && diagnostic.verdict !== "non-rentable" && (
        <div className="mt-6 rounded-md border border-trait bg-white p-4">
          <p className="font-semibold">D&apos;après ton diagnostic :</p>
          <div className="chiffre mt-3 space-y-2 text-sm">
            <Barre libelle="Récupéré chaque mois" valeur={`≈ ${euros(diagnostic.recupere)}`} ratio={1} couleur="bg-billet" />
            <Barre
              libelle="Abonnement"
              valeur={euros(Math.round(prixMensuel))}
              ratio={Math.max(prixMensuel / diagnostic.recupere, 0.06)}
              couleur="bg-tomate"
            />
          </div>
          {diagnostic.net > 0 && (
            <p className="mt-3 text-[0.95rem]">
              Soit environ <strong className="chiffre">{euros(diagnostic.netAnnuel)}</strong> de plus par an, abonnement
              déduit.
            </p>
          )}
        </div>
      )}

      {/* 3. Les formules */}
      <fieldset className="mt-6">
        <legend className="sr-only">Choisis ta formule</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["mensuel", "annuel"] as const).map((cle) => {
            const o = FORMULES[cle];
            const choisi = formule === cle;
            return (
              <label
                key={cle}
                className={`relative block cursor-pointer rounded-md border-2 bg-white p-4 ${
                  choisi ? "border-billet" : "border-trait"
                } ${cle === "annuel" ? "sm:order-last" : ""}`}
              >
                <input
                  type="radio"
                  name="formule"
                  value={cle}
                  checked={choisi}
                  onChange={() => setFormule(cle)}
                  className="sr-only"
                />
                {cle === "annuel" && (
                  <span className="absolute -top-3 right-3 rounded bg-billet px-2 py-0.5 text-xs font-bold text-white">
                    Recommandé
                  </span>
                )}
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{o.nom}</span>
                  <span>
                    <span className="chiffre text-2xl font-semibold">{o.prix}</span>
                    <span className="text-sm text-gris"> {o.periode}</span>
                  </span>
                </span>
                <span className="mt-1 flex justify-between gap-2 text-sm text-gris">
                  <span>{o.detail}</span>
                  <span className="chiffre whitespace-nowrap">soit {o.parJour}/jour</span>
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-gris">Prix hors TVA.</p>
      </fieldset>

      {/* 4. La garantie, en clair */}
      <div className="mt-5 flex gap-3 rounded-md bg-billet p-4 text-white">
        <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0">
          <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="m8.5 12 2.5 2.5 4.5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div>
          <p className="font-bold">Satisfait ou remboursé pendant 30 jours</p>
          <p className="mt-1 text-[0.95rem] opacity-90">
            Un simple e-mail suffit, sans justification. Remboursement intégral lancé sous 48 h ouvrées, visible
            sur ton compte sous 5 à 10 jours selon ta banque.
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-gris">
        <strong className="text-encre">Accès fondateur :</strong> on active tes relances avec toi sous 7 jours. Sinon,
        tu es remboursé.
      </p>

      {/* 5 + 6. Paiement sur le même écran */}
      <div id="paiement" className="mt-6 rounded-md border border-trait bg-white p-4">
        <p className="font-semibold">
          {f.nom} · {formule === "annuel" ? "290 € par an" : "29 € par mois"}
        </p>
        <p className="mt-1 mb-4 text-sm text-gris">Paiement sécurisé par Stripe. Nous ne voyons jamais ta carte.</p>
        <Paiement formule={formule} boutique={boutique} diagnostic={diagnostic} />
      </div>

      {/* 7. Quatre questions fréquentes */}
      <div className="mt-10">
        <h3 className="titre text-xl">Questions fréquentes</h3>
        <div className="mt-3 divide-y divide-trait border-y border-trait">
          {FAQ.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 py-3 font-semibold">
                {item.q}
                <span aria-hidden="true" className="chiffre text-gris transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="pb-4 text-gris">{item.r}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Barre({ libelle, valeur, ratio, couleur }: { libelle: string; valeur: string; ratio: number; couleur: string }) {
  return (
    <div>
      <div className="flex justify-between">
        <span>{libelle}</span>
        <span className="font-semibold">{valeur}</span>
      </div>
      <div className="mt-1 h-3 w-full rounded-sm bg-papier">
        <div className={`h-full rounded-sm ${couleur}`} style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
      </div>
    </div>
  );
}
