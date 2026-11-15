import Link from "next/link";

export default function BoutonCommencer({ emplacement }: { emplacement: string }) {
  return (
    <div>
      <Link
        href="/diagnostic"
        data-umami-event="clic-commencer"
        data-umami-event-emplacement={emplacement}
        className="flex min-h-14 w-full items-center justify-center rounded-md bg-tomate px-7 text-lg font-bold text-white transition-colors hover:bg-tomate-fonce active:bg-tomate-fonce sm:inline-flex sm:w-auto"
      >
        Commencer — c&apos;est gratuit
      </Link>
      <p className="mt-2 text-sm text-gris">2 minutes · sans carte bancaire</p>
    </div>
  );
}
