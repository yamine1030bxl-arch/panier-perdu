// ─────────────────────────────────────────────────────────────
// TES INFORMATIONS — c'est le seul fichier à modifier pour les
// pages légales. Remplace chaque `null` par ta vraie valeur,
// entre guillemets. Tant qu'une valeur vaut `null`, le site
// affiche un repère jaune « À COMPLÉTER » à sa place.
// ─────────────────────────────────────────────────────────────

export const legal = {
  raisonSociale: null as string | null, // ex. "Yamine Dupont" ou "Panier Perdu SAS"
  formeJuridique: "Société à responsabilité limitée (SRL)" as string | null,
  adresse: null as string | null, // adresse postale complète
  numeroEntreprise: null as string | null, // numéro BCE, ex. "0123.456.789"
  tva: null as string | null, // ex. "BE0123.456.789"
  emailContact: null as string | null, // ex. "bonjour@panierperdu.fr"
  directeurPublication: null as string | null, // ton nom
  villeTribunal: null as string | null, // ville du siège, ex. "Bruxelles"
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
