"use client";

import { useState } from "react";
import { versTexte, type Relance } from "@/lib/relances";

export default function Email({
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
