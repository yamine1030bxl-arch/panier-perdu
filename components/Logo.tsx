import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="titre inline-flex items-center gap-2 text-lg" aria-label="Panier Perdu — accueil">
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 5h3l2.2 10.2a1 1 0 0 0 1 .8h8.6a1 1 0 0 0 1-.8L20.5 8H7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="20" r="1.6" fill="currentColor" />
        <circle cx="17" cy="20" r="1.6" fill="#c23d22" />
      </svg>
      Panier Perdu
    </Link>
  );
}
