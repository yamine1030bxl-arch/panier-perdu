// ─────────────────────────────────────────────────────────────
// TES INFORMATIONS — c'est le seul fichier à modifier pour les
// pages légales. Remplace chaque `null` par ta vraie valeur,
// entre guillemets. Tant qu'une valeur vaut `null`, le site
// affiche un repère jaune « À COMPLÉTER » à sa place.
// ─────────────────────────────────────────────────────────────

export const legal = {
  raisonSociale: null as string | null, // ex. "Yamine Dupont" ou "Panier Perdu SAS"
  formeJuridique: null as string | null, // ex. "Entrepreneur individuel (micro-entreprise)"
  adresse: null as string | null, // adresse postale complète
  siret: null as string | null, // 14 chiffres (ou numéro BCE si ton entreprise est belge)
  tva: null as string | null, // ex. "TVA non applicable, art. 293 B du CGI" ou ton n° de TVA
  emailContact: null as string | null, // ex. "bonjour@panierperdu.fr"
  directeurPublication: null as string | null, // ton nom
  villeTribunal: null as string | null, // ex. "Paris"
};

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export const site = {
  nom: "Panier Perdu",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000"),
  // La promesse : à reprendre MOT POUR MOT dans tes vidéos.
  promesse: "Récupère les ventes que tes paniers abandonnés te font perdre.",
  description:
    "Deux relances écrites pour toi, envoyées au bon moment, pour les boutiques WooCommerce. 29 € par mois, relances illimitées.",
};
