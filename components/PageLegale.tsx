import Logo from "@/components/Logo";

export function Champ({ v, label }: { v: string | null; label: string }) {
  return v ? <>{v}</> : <mark className="a-completer">[À COMPLÉTER : {label}]</mark>;
}

export default function PageLegale({
  titre,
  maj,
  children,
}: {
  titre: string;
  maj: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-5 pt-5 pb-14">
      <Logo />
      <h1 className="titre mt-10 text-3xl">{titre}</h1>
      <p className="mt-2 text-sm text-gris">Dernière mise à jour : {maj}</p>
      <div className="legal mt-6">{children}</div>
    </main>
  );
}
