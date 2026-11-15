import type { Metadata } from "next";
import Logo from "@/components/Logo";
import Diagnostic from "@/components/Diagnostic";

export const metadata: Metadata = {
  title: "Diagnostic",
  description: "Trois questions pour chiffrer, en euros, ce que tes paniers abandonnés te coûtent chaque mois.",
};

export default function PageDiagnostic() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-5 pb-10">
      <Logo />
      <Diagnostic />
    </main>
  );
}
