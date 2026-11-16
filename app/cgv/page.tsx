import type { Metadata } from "next";
import PageLegale, { Champ } from "@/components/PageLegale";
import { legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description: "Conditions de l'abonnement Panier Perdu : prix, résiliation, garantie satisfait ou remboursé.",
};

export default function CGV() {
  const email = <Champ v={legal.emailContact} label="e-mail de contact" />;
  return (
    <PageLegale titre="Conditions générales de vente" maj="15 novembre 2026">
      <h2>1. Objet</h2>
      <p>
        Les présentes conditions régissent l&apos;abonnement au service Panier Perdu, édité par{" "}
        <Champ v={legal.raisonSociale} label="raison sociale" /> (ci-après « l&apos;Éditeur »), souscrit par
        un professionnel exploitant une boutique en ligne (ci-après « le Client »). Toute souscription vaut
        acceptation des présentes conditions.
      </p>

      <h2>2. Le service</h2>
      <p>
        Panier Perdu se connecte à la boutique du Client, détecte les paniers abandonnés pour lesquels
        l&apos;acheteur a saisi son adresse e-mail, et envoie à cet acheteur une séquence de deux relances
        écrites, dont la seconde peut contenir un code de réduction si le Client l&apos;a activé. Un compteur
        indique le chiffre d&apos;affaires des commandes passées après une relance.
      </p>
      <p>
        <strong>Accès fondateur.</strong> Pendant la période de lancement, l&apos;abonnement peut être souscrit
        avant que la connexion automatique à la boutique soit disponible. L&apos;Éditeur s&apos;engage alors à
        activer la séquence de relance dans un délai de 7 jours à compter du paiement. À défaut, le Client est
        remboursé intégralement sur simple demande.
      </p>

      <h2>3. Prix</h2>
      <ul>
        <li>Formule mensuelle : 29 € par mois et par boutique.</li>
        <li>Formule annuelle : 290 € par an et par boutique.</li>
      </ul>
      <p>
        Relances illimitées. Les prix sont indiqués hors TVA. Pour un Client établi dans un autre État membre de l&apos;Union européenne et disposant d&apos;un numéro de TVA valide, la facture est émise hors TVA et la taxe est autoliquidée par le Client. <mark className="a-completer">[À FAIRE VALIDER PAR TON COMPTABLE : traitement des Clients sans numéro de TVA]</mark>
        L&apos;Éditeur peut modifier ses prix ; tout changement est notifié au Client au moins 30 jours à
        l&apos;avance et ne s&apos;applique qu&apos;à la période suivante.
      </p>

      <h2>4. Paiement</h2>
      <p>
        Le paiement s&apos;effectue par carte bancaire via Stripe. L&apos;Éditeur n&apos;a jamais accès aux
        numéros de carte. L&apos;abonnement se renouvelle automatiquement à chaque échéance, mensuelle ou
        annuelle, jusqu&apos;à sa résiliation.
      </p>

      <h2>5. Sans engagement : résiliation</h2>
      <p>
        L&apos;abonnement est sans engagement et résiliable à tout moment, depuis l&apos;espace client ou par
        e-mail à {email}. La résiliation prend effet à la fin de la période déjà payée ; aucune nouvelle
        échéance n&apos;est prélevée. Les relances cessent à cette date.
      </p>

      <h2>6. Garantie satisfait ou remboursé — 30 jours</h2>
      <p>
        Pendant les 30 jours qui suivent le premier paiement, le Client peut demander le remboursement
        intégral de ce paiement, sans avoir à se justifier, par un simple e-mail à {email}. Le remboursement
        est lancé sous 48 heures ouvrées sur la carte utilisée ; il apparaît sur le compte du Client sous 5 à
        10 jours ouvrés selon sa banque. L&apos;abonnement est alors résilié. La garantie s&apos;applique une
        fois par boutique.
      </p>

      <h2>7. Obligations du Client</h2>
      <ul>
        <li>
          Le Client informe ses acheteurs, dans la politique de confidentialité de sa boutique, que leur adresse
          e-mail peut être utilisée pour leur rappeler un panier abandonné, et dispose d&apos;une base légale
          pour le faire.
        </li>
        <li>Le Client n&apos;utilise pas le service pour envoyer d&apos;autres messages que des relances de panier.</li>
        <li>Le Client garantit l&apos;exactitude des informations fournies (nom de la boutique, adresse de réponse).</li>
      </ul>

      <h2>8. Données personnelles des acheteurs</h2>
      <p>
        Pour les données des acheteurs de sa boutique, le Client est responsable de traitement et
        l&apos;Éditeur agit en qualité de sous-traitant au sens de l&apos;article 28 du RGPD. L&apos;Éditeur
        traite ces données uniquement pour envoyer les relances et calculer le chiffre d&apos;affaires
        récupéré, les protège, ne les revend jamais, et les supprime au plus tard 90 jours après
        l&apos;abandon du panier ou à la fin de l&apos;abonnement. Chaque relance contient un lien de
        désinscription. Le détail figure dans la <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>9. Responsabilité</h2>
      <p>
        L&apos;Éditeur est tenu d&apos;une obligation de moyens. Le montant récupéré dépend de la boutique et de
        ses acheteurs : aucun résultat chiffré n&apos;est garanti. La responsabilité de l&apos;Éditeur est
        limitée aux sommes payées par le Client au cours des 12 derniers mois.
      </p>

      <h2>10. Modification des conditions</h2>
      <p>
        L&apos;Éditeur peut modifier les présentes conditions. Le Client est prévenu par e-mail au moins 30
        jours avant l&apos;entrée en vigueur des changements et peut résilier avant cette date.
      </p>

      <h2>11. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit belge. En cas de litige, et après une tentative de
        résolution amiable, les tribunaux de l&apos;arrondissement judiciaire de{" "}
        <Champ v={legal.villeTribunal} label="ville du siège" /> sont seuls compétents.
      </p>
    </PageLegale>
  );
}
