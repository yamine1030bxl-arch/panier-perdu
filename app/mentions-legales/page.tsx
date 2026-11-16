import type { Metadata } from "next";
import PageLegale, { Champ } from "@/components/PageLegale";
import { legal } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Éditeur et hébergeur du site Panier Perdu.",
};

export default function MentionsLegales() {
  return (
    <PageLegale titre="Mentions légales" maj="15 novembre 2026">
      <h2>Éditeur du site</h2>
      <p>
        <Champ v={legal.raisonSociale} label="raison sociale ou nom" />
        <br />
        <Champ v={legal.formeJuridique} label="forme juridique" />
        <br />
        <Champ v={legal.adresse} label="adresse postale" />
        <br />
        Numéro d&apos;entreprise (BCE) : <Champ v={legal.numeroEntreprise} label="numéro BCE" />
        <br />
        RPM : tribunal de l&apos;entreprise de <Champ v={legal.villeTribunal} label="ville du siège" />
        <br />
        TVA : <Champ v={legal.tva} label="numéro de TVA (BE…)" />
        <br />
        E-mail : <Champ v={legal.emailContact} label="e-mail de contact" />
      </p>
      <p>
        Directeur de la publication : <Champ v={legal.directeurPublication} label="nom" />
      </p>

      <h2>Hébergement</h2>
      <p>
        Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis —{" "}
        <a href="https://vercel.com" rel="noopener noreferrer">vercel.com</a>
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, éléments graphiques et le code de ce site sont la propriété de l&apos;éditeur. Toute
        reproduction sans autorisation écrite préalable est interdite.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement de tes données est décrit dans la <a href="/confidentialite">politique de confidentialité</a>.
      </p>
    </PageLegale>
  );
}
