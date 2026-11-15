import { ImageResponse } from "next/og";

export const alt = "Panier Perdu — Récupère les ventes que tes paniers abandonnés te font perdre.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#faf7f1",
          color: "#1a1917",
          padding: "64px 72px",
        }}
      >
        <div style={{ display: "flex", fontSize: 34, fontWeight: 800 }}>Panier Perdu</div>
        <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.08, maxWidth: 1000 }}>
          Récupère les ventes que tes paniers abandonnés te font perdre.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 30 }}>
          <div style={{ display: "flex", background: "#c23d22", color: "#fff", padding: "10px 20px", borderRadius: 8, fontWeight: 700 }}>
            7 paniers sur 10 abandonnés
          </div>
          <div style={{ display: "flex", color: "#1e5a43", fontWeight: 700 }}>29 €/mois · WooCommerce</div>
        </div>
      </div>
    ),
    size,
  );
}
