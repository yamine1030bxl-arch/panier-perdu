"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CLE_BOUTIQUE,
  LIMITES,
  nettoyer,
  relance1,
  relance2,
  versTexte,
  type Boutique,
  type Relance,
} from "@/lib/relances";
import { CLE_STOCKAGE } from "@/lib/diagnostic";
import Paywall, { type DiagnosticStocke } from "@/components/Paywall";

const VIDE: Boutique = { nom: "", produit: "", signature: "", ton: "vous" };

function lire<T>(cle: string): T | null {
  try {
    const v = localStorage.getItem(cle);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

export default function Apercu() {
  const [form, setForm] = useState<Boutique>(VIDE);
  const [boutique, setBoutique] = useState<Boutique | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticStocke | null>(null);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    const b = lire<Boutique>(CLE_BOUTIQUE);
    if (b) setForm({ ...VIDE, ...b });
    setDiagnostic(lire<DiagnosticStocke>(CLE_STOCKAGE));
  }, []);

  function valider(e: React.FormEvent) {
    e.preventDefault();
    const b = nettoyer(form);
    if (b.nom.length < 2) {
      setErreur("Indique le nom de ta boutique (2 caractères minimum).");
      return;
    }
    setErreur("");
    setBoutique(b);
    try {
      localStorage.setItem(CLE_BOUTIQUE, JSON.stringify(b));
    } catch {
      /* stockage indisponible : on continue */
    }
    try {
      window.umami?.track("relances-generees");
    } catch {
      /* rien */
    }
    window.scrollTo({ top: 0 });
  }

  if (!boutique) {
    return (
      <section className="py-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-billet">Tes relances</p>
        <h1 className="titre mt-2 text-[1.75rem] sm:text-4xl">On écrit tes deux relances. Il nous manque deux infos.</h1>
        <form onSubmit={valider} className="mt-7 space-y-5" noValidate>
          <Champ
            id="nom"
            label="Nom de ta boutique"
            placeholder="Ex. Atelier Lune"
            valeur={form.nom}
            max={LIMITES.nom}
            onChange={(v) => setForm({ ...form, nom: v })}
            requis
          />
          <Champ
            id="produit"
            label="Ton produit le plus vendu"
            aide="Facultatif. Il sert d'exemple dans la relance."
            placeholder="Ex. la bougie Figuier"
            valeur={form.produit}
            max={LIMITES.produit}
            onChange={(v) => setForm({ ...form, produit: v })}
          />
          <Champ
            id="signature"
            label="Ton prénom, pour signer"
            aide="Facultatif. Une relance signée par une personne inspire confiance."
            placeholder="Ex. Yamine"
            valeur={form.signature}
            max={LIMITES.signature}
            onChange={(v) => setForm({ ...form, signature: v })}
          />
          <fieldset>
            <legend className="font-semibold">Tu parles à tes clients en…</legend>
            <div className="mt-2 grid grid-cols-2 gap-3">
              {(["vous", "tu"] as const).map((ton) => (
                <label
                  key={ton}
                  className={`flex min-h-12 cursor-pointer items-center justify-center rounded-md border-2 bg-white font-semibold ${
                    form.ton === ton ? "border-billet" : "border-trait"
                  }`}
                >
                  <input
                    type="radio"
                    name="ton"
                    value={ton}
                    checked={form.ton === ton}
                    onChange={() => setForm({ ...form, ton })}
                    className="sr-only"
                  />
                  {ton === "vous" ? "Vouvoiement" : "Tutoiement"}
                </label>
              ))}
            </div>
          </fieldset>
          {erreur && (
            <p role="alert" className="font-semibold text-tomate">
              {erreur}
            </p>
          )}
          <button
            type="submit"
            className="flex min-h-14 w-full items-center justify-center rounded-md bg-tomate px-7 text-lg font-bold text-white transition-colors hover:bg-tomate-fonce"
          >
            Écrire mes relances
          </button>
        </form>
      </section>
    );
  }

  return (
    <>
      <section className="py-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-billet">Tes relances · {boutique.nom}</p>
        <h1 className="titre mt-2 text-[1.75rem] sm:text-4xl">Ta première relance est prête. Elle est à toi.</h1>
        <p className="mt-3 text-gris">
          Elle part une heure après l&apos;abandon, au moment où ton client se souvient encore de son panier. Tu peux
          déjà la copier et l&apos;envoyer à la main.
        </p>

        <Email relance={relance1(boutique)} etiquette="Relance 1 · 1 heure après l'abandon" />

        <div className="relative mt-6">
          <div aria-hidden="true" className="pointer-events-none select-none blur-[5px]">
            <Email relance={relance2(boutique)} etiquette="Relance 2 · le lendemain" copiable={false} />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="rounded-md bg-encre px-4 py-3 text-sm font-semibold text-papier">
              Relance 2, avec code -10 % facultatif
              <br />
              <span className="font-normal opacity-80">Débloquée avec l&apos;abonnement</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setBoutique(null)}
          className="mt-4 min-h-11 text-sm font-semibold text-billet underline"
        >
          Modifier les infos de ma boutique
        </button>
      </section>

      <Paywall boutique={boutique} diagnostic={diagnostic} />

      {!diagnostic && (
        <p className="pb-6 text-sm text-gris">
          Tu n&apos;as pas encore fait le diagnostic ?{" "}
          <Link href="/diagnostic" className="font-semibold text-billet underline">
            Chiffre ce que tes paniers te coûtent
          </Link>
        </p>
      )}
    </>
  );
}

function Champ(props: {
  id: string;
  label: string;
  aide?: string;
  placeholder: string;
  valeur: string;
  max: number;
  requis?: boolean;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={props.id} className="font-semibold">
        {props.label}
      </label>
      {props.aide && <p className="text-sm text-gris">{props.aide}</p>}
      <input
        id={props.id}
        type="text"
        value={props.valeur}
        maxLength={props.max}
        required={props.requis}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="mt-1.5 min-h-12 w-full rounded-md border-2 border-trait bg-white px-3 text-[1.0625rem] placeholder:text-gris/60 focus:border-billet focus:outline-none"
      />
    </div>
  );
}

function Email({
  relance,
  etiquette,
  copiable = true,
}: {
  relance: Relance;
  etiquette: string;
  copiable?: boolean;
}) {
  const [copie, setCopie] = useState(false);

  async function copier() {
    try {
      await navigator.clipboard.writeText(versTexte(relance));
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  return (
    <article className="mt-6 rounded-md border border-trait bg-white">
      <header className="border-b border-trait px-4 py-3">
        <p className="chiffre text-xs font-semibold uppercase tracking-wider text-gris">{etiquette}</p>
        <p className="mt-1 font-semibold">{relance.objet}</p>
      </header>
      <div className="space-y-3 px-4 py-4 text-[0.98rem]">
        {relance.paragraphes.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <p>
          <span className="inline-block rounded-md bg-encre px-4 py-2 text-sm font-semibold text-papier">
            {relance.bouton}
          </span>
        </p>
        <p className="whitespace-pre-line">{relance.fin.join("\n")}</p>
      </div>
      {copiable && (
        <footer className="border-t border-trait px-4 py-2">
          <button type="button" onClick={copier} className="min-h-11 font-semibold text-billet">
            {copie ? "Copié ✓" : "Copier le texte"}
          </button>
        </footer>
      )}
    </article>
  );
}
