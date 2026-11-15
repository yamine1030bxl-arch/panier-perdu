import Link from "next/link";
import { legal, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="border-t border-trait px-5 py-8 text-sm text-gris">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav aria-label="Informations légales">
          <ul className="flex flex-wrap gap-x-5 gap-y-3">
            <li>
              <Link href="/mentions-legales" className="py-2 hover:text-encre">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/cgv" className="py-2 hover:text-encre">
                CGV
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="py-2 hover:text-encre">
                Confidentialité
              </Link>
            </li>
            <li>
              {legal.emailContact ? (
                <a href={`mailto:${legal.emailContact}`} className="py-2 hover:text-encre">
                  Contact
                </a>
              ) : (
                <span className="a-completer">[À COMPLÉTER : e-mail de contact]</span>
              )}
            </li>
          </ul>
        </nav>
        <p>© {new Date().getFullYear()} {site.nom}</p>
      </div>
    </footer>
  );
}
