import type { Metadata } from "next";
import PageLegale, { Champ } from "@/components/PageLegale";
import { legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Quelles données Panier Perdu collecte, pourquoi, combien de temps, et tes droits.",
};

export default function Confidentialite() {
  const email = <Champ v={legal.emailContact} label="e-mail de contact" />;
  return (
    <PageLegale titre="Politique de confidentialité" maj="15 novembre 2026">
      <h2>Qui est responsable</h2>
      <p>
        <Champ v={legal.raisonSociale} label="raison sociale" />, <Champ v={legal.adresse} label="adresse" />.
        Pour toute question sur tes données : {email}.
      </p>

      <h2>Visiteurs du site</h2>
      <p>
        Nous mesurons l&apos;audience avec Umami, un outil sans cookie qui ne conserve pas ton adresse IP et
        ne produit que des statistiques globales (pages vues, provenance, étapes du parcours). Aucun cookie
        publicitaire ni traceur tiers n&apos;est déposé. Les réponses au diagnostic restent dans ton navigateur
        tant que tu ne crées pas de compte.
      </p>

      <h2>Clients abonnés</h2>
      <ul>
        <li>
          <strong>Données :</strong> adresse e-mail, nom et adresse de la boutique, réglages de la séquence,
          historique d&apos;abonnement. Les données de carte sont traitées par Stripe ; nous ne les voyons jamais.
        </li>
        <li><strong>Pourquoi :</strong> fournir le service et le facturer (exécution du contrat).</li>
        <li>
          <strong>Combien de temps :</strong> pendant l&apos;abonnement, puis 3 ans pour pouvoir te recontacter ;
          les factures sont conservées 10 ans (obligation comptable).
        </li>
      </ul>

      <h2>Acheteurs des boutiques clientes</h2>
      <p>
        Si tu as reçu une relance de panier, c&apos;est la boutique où tu as fait ton panier qui est responsable
        de ce traitement ; nous agissons pour son compte, comme sous-traitant. Nous utilisons ton adresse
        e-mail, ton prénom et le contenu de ton panier uniquement pour t&apos;envoyer au maximum deux relances
        et savoir si une commande a suivi. Ces données sont supprimées au plus tard 90 jours après
        l&apos;abandon du panier. Chaque relance contient un lien pour ne plus en recevoir.
      </p>

      <h2>Prestataires</h2>
      <ul>
        <li>Vercel (hébergement du site) — États-Unis</li>
        <li>Supabase (base de données) — serveurs situés dans l&apos;Union européenne</li>
        <li>Stripe (paiement) — Irlande / États-Unis</li>
        <li>Resend (envoi des e-mails) — États-Unis</li>
        <li>Umami (mesure d&apos;audience, sans cookie)</li>
      </ul>
      <p>
        Les transferts hors de l&apos;Union européenne sont encadrés par le Data Privacy Framework UE–États-Unis
        ou par les clauses contractuelles types de la Commission européenne.
      </p>

      <h2>Tes droits</h2>
      <p>
        Tu peux accéder à tes données, les rectifier, les effacer, t&apos;opposer à leur traitement, en
        limiter l&apos;usage ou les récupérer, en écrivant à {email}. Réponse sous un mois au plus. Tu peux
        aussi adresser une réclamation à la CNIL (<a href="https://www.cnil.fr" rel="noopener noreferrer">cnil.fr</a>).
      </p>

      <h2>Cookies</h2>
      <p>
        Le site n&apos;utilise que les cookies strictement nécessaires à la connexion à ton espace client. Ils
        ne nécessitent pas de consentement.
      </p>
    </PageLegale>
  );
}
