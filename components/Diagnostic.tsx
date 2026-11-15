"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CLE_STOCKAGE,
  HYPOTHESES,
  QUESTIONS,
  SITUATION_TEXTE,
  calculer,
  euros,
  type Reponses,
  type Situation,
} from "@/lib/diagnostic";

declare global {
  interface Window {
    umami?: { track: (evenement: string, donnees?: Record<string, string | number>) => void };
  }
}

function suivre(evenement: string, donnees?: Record<string, string | number>) {
  try {
    window.umami?.track(evenement, donnees);
  } catch {
    /* la mesure d'audience ne doit jamais bloquer le parcours */
  }
}

export default function Diagnostic() {
  const [etape, setEtape] = useState(0);
  const [reponses, setReponses] = useState<Reponses>({});
  const total = QUESTIONS.length;
  const termine = etape >= total;

  function repondre(valeur: number | Situation) {
    const q = QUESTIONS[etape];
    setReponses((r) => ({ ...r, [q.cle]: valeur }) as Reponses);
    suivre(`question-${etape + 1}`);
    setEtape((e) => e + 1);
    window.scrollTo({ top: 0 });
  }

  if (termine && reponses.commandes && reponses.panier && reponses.situation) {
    return (
      <Resultat
        commandes={reponses.commandes}
        panier={reponses.panier}
        situation={reponses.situation}
        recommencer={() => {
          setReponses({});
          setEtape(0);
        }}
      />
    );
  }

  const q = QUESTIONS[Math.min(etape, total - 1)];
  const valeurActuelle = reponses[q.cle];

  return (
    <section className="py-6" aria-live="polite">
      {/* Barre de progression */}
      <div className="flex items-center justify-between text-sm text-gris">
        <span className="chiffre">
          Question {etape + 1} sur {total}
        </span>
        {etape > 0 && (
          <button
            type="button"
            onClick={() => setEtape((e) => e - 1)}
            className="min-h-11 px-2 font-semibold text-billet"
          >
            ← Retour
          </button>
        )}
      </div>
      <div
        className="mt-2 h-2 w-full overflow-hidden rounded-full bg-trait"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={etape + 1}
        aria-label="Progression du diagnostic"
      >
        <div
          className="h-full rounded-full bg-billet transition-[width] duration-300"
          style={{ width: `${((etape + 1) / total) * 100}%` }}
        />
      </div>

      <h1 className="titre mt-8 text-[1.75rem] sm:text-4xl">{q.titre}</h1>
      <p className="mt-2 text-gris">{q.aide}</p>

      <ul className="mt-6 space-y-3">
        {q.options.map((o) => {
          const choisi = valeurActuelle === o.valeur;
          return (
            <li key={o.label}>
              <button
                type="button"
                onClick={() => repondre(o.valeur)}
                className={`flex min-h-14 w-full items-center rounded-md border-2 bg-white px-4 py-3 text-left text-[1.05rem] font-semibold transition-colors hover:border-encre ${
                  choisi ? "border-billet" : "border-trait"
                }`}
              >
                {o.label}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Ligne({
  libelle,
  valeur,
  className = "",
}: {
  libelle: string;
  valeur: string;
  className?: string;
}) {
  return (
    <div className={`flex justify-between gap-4 ${className}`}>
      <dt>{libelle}</dt>
      <dd className="whitespace-nowrap text-right">{valeur}</dd>
    </div>
  );
}

function Resultat({
  commandes,
  panier,
  situation,
  recommencer,
}: {
  commandes: number;
  panier: number;
  situation: Situation;
  recommencer: () => void;
}) {
  const r = calculer(commandes, panier);
  const texte = SITUATION_TEXTE[situation];

  useEffect(() => {
    try {
      localStorage.setItem(CLE_STOCKAGE, JSON.stringify({ commandes, panier, situation, ...r }));
    } catch {
      /* stockage indisponible : le parcours continue */
    }
    suivre("diagnostic-termine", { verdict: r.verdict, recupere: r.recupere });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-billet">Ton diagnostic</p>
      <h1 className="titre mt-2 text-[1.75rem] sm:text-4xl">
        Chaque mois, environ {r.abandonnes} paniers quittent ta boutique.
      </h1>
      <p className="mt-3 text-lg text-gris">
        Tu reçois environ {commandes} commandes par mois, à {euros(panier)} en moyenne, et{" "}
        {texte.constat}. <span className="text-encre">{texte.consequence}</span>
      </p>

      {/* Ce que ça coûte aujourd'hui */}
      <div className="ticket-ombre mt-7">
        <div className="ticket">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gris">
            Ta boutique, chaque mois
          </h2>
          <dl className="chiffre mt-4 space-y-2 text-[0.95rem]">
            <Ligne libelle="Commandes passées" valeur={`≈ ${commandes}`} />
            <Ligne libelle="Paniers abandonnés" valeur={`≈ ${r.abandonnes}`} />
            <Ligne
              libelle="Valeur abandonnée"
              valeur={euros(r.valeurAbandonnee)}
              className="border-t border-dashed border-trait pt-2 text-lg font-semibold text-tomate"
            />
            <Ligne
              libelle="Dont relançable (e-mail saisi)"
              valeur={`${r.relancables} · ${euros(r.valeurRelancable)}`}
              className="text-gris"
            />
          </dl>
        </div>
      </div>

      {/* Ce que le produit changerait */}
      <div className="ticket-ombre mt-6">
        <div className="ticket">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-billet">
            Avec deux relances Panier Perdu
          </h2>
          <dl className="chiffre mt-4 space-y-2 text-[0.95rem]">
            <Ligne libelle="Ventes récupérées" valeur={`+ ${euros(r.recupere)}`} className="text-billet" />
            <Ligne libelle="Abonnement" valeur={`− ${euros(HYPOTHESES.prixMensuel)}`} />
            <Ligne
              libelle="Gain net par mois"
              valeur={r.net > 0 ? `+ ${euros(r.net)}` : euros(r.net)}
              className={`border-t border-dashed border-trait pt-2 text-lg font-semibold ${
                r.net > 0 ? "text-billet" : "text-tomate"
              }`}
            />
          </dl>
          {r.net > 0 && (
            <p className="mt-3 text-[0.95rem]">
              Soit <strong className="chiffre">{euros(r.netAnnuel)}</strong> de plus sur un an.
            </p>
          )}
        </div>
      </div>

      {r.verdict === "juste" && (
        <p className="mt-5 rounded-md border border-trait bg-white p-4 text-[0.95rem]">
          À ton volume, Panier Perdu se rembourse, mais de peu. La garantie satisfait ou remboursé de 30 jours
          te permet de vérifier sur tes vrais chiffres, sans risque.
        </p>
      )}
      {r.verdict === "non-rentable" && (
        <p className="mt-5 rounded-md border border-trait bg-white p-4 text-[0.95rem]">
          Franchement : à ton volume actuel, l&apos;abonnement risque de coûter plus qu&apos;il ne rapporte. On
          préfère te le dire. Panier Perdu devient intéressant à partir d&apos;une vingtaine de commandes par mois.
        </p>
      )}

      <div className="mt-8">
        <Link
          href="/apercu"
          data-umami-event="clic-voir-relances"
          className="flex min-h-14 w-full items-center justify-center rounded-md bg-tomate px-7 text-lg font-bold text-white transition-colors hover:bg-tomate-fonce sm:inline-flex sm:w-auto"
        >
          Voir mes deux relances
        </Link>
        <p className="mt-2 text-sm text-gris">Écrites pour ta boutique, gratuitement.</p>
      </div>

      <p className="mt-8 text-xs text-gris">
        Hypothèses prudentes : 70 % des paniers abandonnés (Baymard Institute), 35 % des abandons avec
        e-mail saisi, 1 client relancé sur 10 qui commande. Chiffres arrondis.{" "}
        <button type="button" onClick={recommencer} className="underline">
          Refaire le diagnostic
        </button>
      </p>
    </section>
  );
}
