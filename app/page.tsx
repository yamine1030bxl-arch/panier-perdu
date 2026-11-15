import Logo from "@/components/Logo";
import BoutonCommencer from "@/components/BoutonCommencer";
import { site } from "@/lib/site";

const benefices = [
  {
    titre: "Deux relances qui parlent de ta boutique",
    texte:
      "Le nom de ta boutique, le produit oublié, le prénom du client. La première part une heure après l'abandon, la seconde le lendemain.",
  },
  {
    titre: "Un code promo seulement si tu le décides",
    texte:
      "Il n'apparaît que sur la seconde relance, et uniquement si tu l'actives. Ta marge reste protégée.",
  },
  {
    titre: "Chaque euro récupéré, compté",
    texte:
      "Un compteur te montre en euros ce que les relances t'ont rapporté. Tu sais exactement ce que tu paies.",
  },
];

export default function Accueil() {
  return (
    <main>
      <header className="mx-auto max-w-3xl px-5 pt-5">
        <Logo />
      </header>

      {/* 1. La promesse — identique à celle des vidéos */}
      <section className="mx-auto max-w-3xl px-5 pb-10 pt-8 sm:pt-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-billet">
          Pour les boutiques WooCommerce
        </p>
        <h1 className="titre text-[2.15rem] sm:text-5xl">{site.promesse}</h1>
        <p className="mt-4 max-w-xl text-lg text-gris">
          Deux relances écrites pour toi, envoyées au bon moment.{" "}
          <span className="text-encre">29 € par mois, relances illimitées.</span>
        </p>
        <div className="mt-7">
          <BoutonCommencer emplacement="haut" />
        </div>
      </section>

      {/* 2. La douleur, chiffrée */}
      <section className="mx-auto max-w-3xl px-5 pb-12" aria-labelledby="douleur">
        <div className="ticket-ombre max-w-md">
          <div className="ticket">
            <h2 id="douleur" className="text-sm font-semibold uppercase tracking-wider text-gris">
              Dans une boutique en ligne moyenne
            </h2>
            <dl className="chiffre mt-4 space-y-2 text-[0.95rem]">
              <div className="flex justify-between gap-4">
                <dt>Paniers remplis</dt>
                <dd>10</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Commandes passées</dt>
                <dd>3</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-dashed border-trait pt-2 font-semibold text-tomate">
                <dt>Paniers abandonnés</dt>
                <dd>7</dd>
              </div>
            </dl>
            <p className="mt-4 text-[0.95rem]">
              Les outils de relance sont pensés pour les grosses boutiques, et facturés en conséquence.
              Résultat : beaucoup de petites boutiques ne relancent personne.
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gris">
          Source : Baymard Institute, taux moyen d&apos;abandon de panier d&apos;environ 70 %.
        </p>
      </section>

      {/* 3. Trois bénéfices */}
      <section className="mx-auto max-w-3xl px-5 pb-12" aria-label="Ce que fait Panier Perdu">
        <ol className="space-y-7">
          {benefices.map((b, i) => (
            <li key={b.titre} className="flex gap-4">
              <span className="chiffre pt-0.5 text-lg font-semibold text-billet" aria-hidden="true">
                0{i + 1}
              </span>
              <div>
                <h3 className="titre text-xl">{b.titre}</h3>
                <p className="mt-1 text-gris">{b.texte}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Rappel de l'action */}
      <section className="mx-auto max-w-3xl px-5 pb-14">
        <div className="border-t border-trait pt-8">
          <p className="titre mb-5 text-2xl">Combien te coûtent tes paniers abandonnés ? Réponds à 3 questions.</p>
          <BoutonCommencer emplacement="bas" />
        </div>
      </section>
    </main>
  );
}
