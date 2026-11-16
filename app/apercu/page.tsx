import type { Metadata } from "next";
import Logo from "@/components/Logo";
import Apercu from "@/components/Apercu";

export const metadata: Metadata = {
  title: "Tes relances",
  description: "Les deux relances de panier abandonné, écrites pour ta boutique.",
};

export default function PageApercu() {
  return (
    <main className="mx-auto max-w-xl px-5 pt-5 pb-10">
      <Logo />
      <Apercu />
    </main>
  );
}
