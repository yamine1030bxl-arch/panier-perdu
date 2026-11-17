import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import EspaceClient from "@/components/EspaceClient";
import { db, type AbonnementDB, type BoutiqueDB } from "@/lib/serveur";

export const metadata: Metadata = {
  title: "Mon espace",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function Espace({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) notFound();

  const { data: boutique } = await db()
    .from("boutiques")
    .select("id, email, nom, url, ton, signature, produit_phare, code_promo_actif, code_promo_pourcentage, token_acces")
    .eq("token_acces", token)
    .maybeSingle();
  if (!boutique) notFound();

  const [{ data: abo }, { data: paniers }] = await Promise.all([
    db()
      .from("abonnements")
      .select("formule, statut, fin_periode")
      .eq("boutique_id", boutique.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    db().from("paniers").select("montant_recupere").eq("boutique_id", boutique.id).eq("statut", "recupere"),
  ]);

  const recupere = (paniers ?? []).reduce((s, p) => s + Number(p.montant_recupere ?? 0), 0);

  return (
    <main className="mx-auto max-w-xl px-5 pt-5 pb-10">
      <Logo />
      <EspaceClient boutique={boutique as BoutiqueDB} abonnement={(abo as AbonnementDB) ?? null} recupere={recupere} />
    </main>
  );
}
