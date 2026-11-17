import Email from "@/components/Email";
import { relance1, relance2, type Boutique } from "@/lib/relances";
import { euros } from "@/lib/diagnostic";
import { site } from "@/lib/site";
import type { AbonnementDB, BoutiqueDB } from "@/lib/serveur";

const STATUTS: Record<AbonnementDB["statut"], { texte: string; couleur: string }> = {
  actif: { texte: "Abonnement actif", couleur: "text-billet" },
  impaye: { texte: "Paiement en attente", couleur: "text-tomate" },
  annule: { texte: "Abonnement résilié", couleur: "text-gris" },
};

export default function EspaceClient({
  boutique,
  abonnement,
  recupere,
  bienvenue = false,
}: {
  boutique: BoutiqueDB;
  abonnement: AbonnementDB | null;
  recupere: number;
  bienvenue?: boolean;
}) {
  const b: Boutique = {
    nom: boutique.nom,
    produit: boutique.produit_phare ?? "",
    signature: boutique.signature ?? "",
    ton: boutique.ton,
  };
  const lienPrive = `${site.url}/espace/${boutique.token_acces}`;
  const statut = abonnement ? STATUTS[abonnement.statut] : null;

  return (
    <section className="py-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-billet">{boutique.nom}</p>
      <h1 className="titre mt-2 text-[1.75rem] sm:text-4xl">
        {bienvenue ? "C'est fait. Tes deux relances sont à toi." : "Ton espace Panier Perdu"}
      </h1>
      {statut && (
        <p className={`chiffre mt-2 text-sm font-semibold ${statut.couleur}`}>
          {statut.texte}
          {abonnement?.formule ? ` · formule ${abonnement.formule}` : ""}
        </p>
      )}

      {/* Compteur */}
      <div className="ticket-ombre mt-6">
        <div className="ticket">
          <p className="text-sm font-semibold uppercase tracking-wider text-gris">Chiffre d&apos;affaires récupéré</p>
          <p className="chiffre mt-2 text-4xl font-semibold text-billet">{euros(recupere)}</p>
          {recupere === 0 && (
            <p className="mt-2 text-[0.95rem] text-gris">
              Le compteur démarre dès que tes relances sont branchées à ta boutique.
            </p>
          )}
        </div>
      </div>

      {/* Prochaine étape */}
      <div className="mt-6 rounded-md border border-trait bg-white p-4">
        <p className="font-semibold">Prochaine étape : brancher ta boutique</p>
        <p className="mt-1 text-[0.95rem] text-gris">
          On t&apos;écrit à <strong className="text-encre">{boutique.email}</strong> sous 24 heures pour activer tes
          relances avec toi (10 minutes). Engagement fondateur : c&apos;est fait sous 7 jours, sinon tu es remboursé.
        </p>
      </div>

      {bienvenue && (
        <div className="mt-4 rounded-md border border-trait bg-white p-4">
          <p className="font-semibold">Garde ce lien : c&apos;est l&apos;accès à ton espace</p>
          <p className="chiffre mt-2 break-all text-sm">{lienPrive}</p>
          <p className="mt-2 text-sm text-gris">Ajoute-le à tes favoris. Il est personnel : ne le partage pas.</p>
        </div>
      )}

      <Email relance={relance1(b)} etiquette="Relance 1 · 1 heure après l'abandon" />
      <Email relance={relance2(b)} etiquette="Relance 2 · le lendemain · code -10 % facultatif" />
    </section>
  );
}
