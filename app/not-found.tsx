import Link from "next/link";
import Logo from "@/components/Logo";

export default function PageIntrouvable() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-5">
      <Logo />
      <div className="py-16">
        <p className="chiffre text-sm font-semibold text-tomate">Erreur 404</p>
        <h1 className="titre mt-2 text-3xl">Cette page s&apos;est perdue en route.</h1>
        <p className="mt-3 max-w-md text-gris">
          Le lien est peut-être incomplet, ou la page n&apos;existe plus.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-md bg-tomate px-7 text-lg font-bold text-white hover:bg-tomate-fonce"
        >
          Revenir à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
