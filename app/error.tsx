"use client";

import Link from "next/link";

export default function Erreur({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="chiffre text-sm font-semibold text-tomate">Erreur</p>
      <h1 className="titre mt-2 text-3xl">Quelque chose s&apos;est mal passé de notre côté.</h1>
      <p className="mt-3 max-w-md text-gris">
        Ce n&apos;est pas toi. Réessaie dans un instant ; si ça continue, reviens à l&apos;accueil.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-14 items-center justify-center rounded-md bg-tomate px-7 text-lg font-bold text-white hover:bg-tomate-fonce"
        >
          Réessayer
        </button>
        <Link href="/" className="inline-flex min-h-14 items-center justify-center px-4 font-semibold text-billet underline">
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
