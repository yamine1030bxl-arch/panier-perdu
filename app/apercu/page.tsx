import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "Tes relances",
  description: "Les deux relances de panier abandonné, écrites pour ta boutique.",
};

// Page provisoire : remplacée par l'avant-goût et le paywall à l'étape 3.
export default function Apercu() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-5">
      <Logo />
      <div className="py-16">
        <h1 className="titre text-3xl">Tes relances sont en cours d&apos;écriture.</h1>
        <p className="mt-3 text-gris">
          Cette partie ouvre très bientôt : tu pourras lire ta première relance, écrite pour ta boutique.
        </p>
        <Link href="/diagnostic" className="mt-8 inline-flex min-h-12 items-center font-semibold text-billet underline">
          ← Revoir mon diagnostic
        </Link>
      </div>
    </main>
  );
}
