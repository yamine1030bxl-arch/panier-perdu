// Modèles des deux relances, personnalisés avec les infos de la boutique.

export type Ton = "vous" | "tu";

export type Boutique = {
  nom: string;
  produit: string;
  signature: string;
  ton: Ton;
};

export type Relance = {
  objet: string;
  paragraphes: string[];
  bouton: string;
  fin: string[];
};

export const CLE_BOUTIQUE = "pp-boutique";
export const CLIENT_EXEMPLE = "Camille";

export const LIMITES = { nom: 60, produit: 80, signature: 40 };

export function nettoyer(b: Boutique): Boutique {
  return {
    nom: b.nom.trim().slice(0, LIMITES.nom),
    produit: b.produit.trim().slice(0, LIMITES.produit),
    signature: b.signature.trim().slice(0, LIMITES.signature),
    ton: b.ton === "tu" ? "tu" : "vous",
  };
}

function outils(b: Boutique) {
  const t = (tu: string, vous: string) => (b.ton === "tu" ? tu : vous);
  const article = b.produit ? `« ${b.produit} »` : "quelques articles";
  const fin = b.signature ? ["À bientôt,", b.signature, b.nom] : ["À bientôt,", `L'équipe ${b.nom}`];
  return { t, article, fin };
}

export function relance1(b: Boutique): Relance {
  const { t, article, fin } = outils(b);
  const quiRepond = b.signature
    ? t(`${b.signature} te répondra personnellement`, `${b.signature} vous répondra personnellement`)
    : t("nous te répondrons personnellement", "nous vous répondrons personnellement");
  return {
    objet: t(`Ton panier t'attend chez ${b.nom}`, `Votre panier vous attend chez ${b.nom}`),
    paragraphes: [
      `Bonjour ${CLIENT_EXEMPLE},`,
      t(
        `Tu as laissé ${article} dans ton panier sur ${b.nom}. On l'a mis de côté pour toi.`,
        `Vous avez laissé ${article} dans votre panier sur ${b.nom}. Nous l'avons mis de côté pour vous.`,
      ),
      t(
        `Si quelque chose t'a fait hésiter (la livraison, une taille, une question sur le produit), réponds simplement à cet e-mail : ${quiRepond}.`,
        `Si quelque chose vous a fait hésiter (la livraison, une taille, une question sur le produit), répondez simplement à cet e-mail : ${quiRepond}.`,
      ),
    ],
    bouton: "Reprendre mon panier",
    fin,
  };
}

export function relance2(b: Boutique): Relance {
  const { t, article, fin } = outils(b);
  return {
    objet: t(`Ton panier chez ${b.nom} : 10 % offerts pour le finaliser`, `Votre panier chez ${b.nom} : 10 % offerts pour le finaliser`),
    paragraphes: [
      `Bonjour ${CLIENT_EXEMPLE},`,
      t(
        `${article} t'attend toujours dans ton panier. Pour t'aider à te décider, voici un code de réduction de 10 %, valable 48 heures : RETOUR10.`,
        `${article} vous attend toujours dans votre panier. Pour vous aider à vous décider, voici un code de réduction de 10 %, valable 48 heures : RETOUR10.`,
      ),
      t(
        "Il s'applique en un clic depuis le lien ci-dessous. Après, on ne te relancera plus, promis.",
        "Il s'applique en un clic depuis le lien ci-dessous. Après, nous ne vous relancerons plus, promis.",
      ),
    ],
    bouton: "Finaliser avec -10 %",
    fin,
  };
}

export function versTexte(r: Relance): string {
  return [`Objet : ${r.objet}`, "", ...r.paragraphes.flatMap((p) => [p, ""]), `[${r.bouton}]`, "", ...r.fin].join("\n");
}
