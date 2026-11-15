// Logique du diagnostic : questions, hypothèses et calcul.
// Les hypothèses sont volontairement prudentes et affichées à l'utilisateur.

export type Situation = "rien" | "main" | "auto" | "nsp";

export type Reponses = {
  commandes?: number;
  panier?: number;
  situation?: Situation;
};

type Option = { label: string; valeur: number | Situation };

export type Question = {
  cle: keyof Reponses;
  titre: string;
  aide: string;
  options: Option[];
};

export const QUESTIONS: Question[] = [
  {
    cle: "commandes",
    titre: "Combien de commandes reçois-tu par mois ?",
    aide: "Une estimation suffit.",
    options: [
      { label: "Moins de 20", valeur: 12 },
      { label: "Entre 20 et 50", valeur: 35 },
      { label: "Entre 50 et 100", valeur: 75 },
      { label: "Plus de 100", valeur: 130 },
    ],
  },
  {
    cle: "panier",
    titre: "Quel est le montant moyen d'une commande ?",
    aide: "Ton panier moyen, frais de port compris.",
    options: [
      { label: "Moins de 30 €", valeur: 22 },
      { label: "Entre 30 et 60 €", valeur: 45 },
      { label: "Entre 60 et 100 €", valeur: 80 },
      { label: "Plus de 100 €", valeur: 130 },
    ],
  },
  {
    cle: "situation",
    titre: "Quand un client abandonne son panier, que se passe-t-il aujourd'hui ?",
    aide: "Sois honnête, personne ne regarde.",
    options: [
      { label: "Rien, je ne le relance pas", valeur: "rien" },
      { label: "Je le relance à la main, quand j'y pense", valeur: "main" },
      { label: "Une relance part toute seule, mais je ne sais pas ce qu'elle rapporte", valeur: "auto" },
      { label: "Je ne sais pas", valeur: "nsp" },
    ],
  },
];

// Ses mots à elle, réutilisés sur l'écran de résultat.
export const SITUATION_TEXTE: Record<Situation, { constat: string; consequence: string }> = {
  rien: {
    constat: "aujourd'hui, tu ne les relances pas",
    consequence: "Ces paniers partent sans un mot de ta part, alors que le client avait déjà choisi.",
  },
  main: {
    constat: "aujourd'hui, tu les relances à la main, quand tu y penses",
    consequence:
      "C'est du temps que tu n'as pas, et un panier relancé trois jours plus tard est déjà froid.",
  },
  auto: {
    constat: "une relance part toute seule, mais tu ne sais pas ce qu'elle rapporte",
    consequence: "Sans chiffre en euros, impossible de savoir si elle fait son travail.",
  },
  nsp: {
    constat: "tu ne sais pas ce que deviennent ces paniers",
    consequence: "Le plus probable : ils partent sans aucune relance.",
  },
};

export const HYPOTHESES = {
  tauxAbandon: 0.7, // Baymard Institute : ~70 % des paniers sont abandonnés
  partAvecEmail: 0.35, // part des abandons où le client a saisi son e-mail (prudent)
  tauxRecuperation: 0.1, // 1 client relancé sur 10 finit par commander (prudent)
  prixMensuel: 29,
};

const arrondi5 = (x: number) => Math.round(x / 5) * 5;

export function calculer(commandes: number, panier: number) {
  const h = HYPOTHESES;
  const abandonnes = Math.round((commandes * h.tauxAbandon) / (1 - h.tauxAbandon));
  const valeurAbandonnee = arrondi5(abandonnes * panier);
  const relancables = Math.round(abandonnes * h.partAvecEmail);
  const valeurRelancable = arrondi5(relancables * panier);
  const commandesRecuperees = relancables * h.tauxRecuperation;
  const recupere = arrondi5(commandesRecuperees * panier);
  const net = recupere - h.prixMensuel;

  let verdict: "rentable" | "juste" | "non-rentable";
  if (recupere >= h.prixMensuel * 2) verdict = "rentable";
  else if (recupere >= h.prixMensuel) verdict = "juste";
  else verdict = "non-rentable";

  return {
    abandonnes,
    valeurAbandonnee,
    relancables,
    valeurRelancable,
    commandesRecuperees,
    recupere,
    net,
    netAnnuel: net * 12,
    verdict,
  };
}

const formatEuros = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
export const euros = (n: number) => formatEuros.format(n);

export const CLE_STOCKAGE = "pp-diagnostic";
