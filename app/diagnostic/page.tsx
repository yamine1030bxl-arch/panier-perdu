import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Diagnostic",
  description: "Trois questions pour chiffrer ce que tes paniers abandonnés te coûtent.",
};

// Page provisoire : remplacée par les 3 questions à l'étape 2.
export default function Diagnostic() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-5">
      <Logo />
      <div className="py-16">
        <h1 className="titre text-3xl">Le diagnostic ouvre très bientôt.</h1>
        <p className="mt-3 max-w-md text-gris">
          Trois questions pour chiffrer, en euros, ce que tes paniers abandonnés te coûtent chaque mois.
        </p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center font-semibold text-billet underline">
          ← Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
