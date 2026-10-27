import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt = "Valore Property Group — Your Property. Our Priority.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#0B0B0D",
        width: "100%",
        height: "100%",
        padding: 70,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        color: "white",
      }}
    >
      <div
        style={{
          fontSize: 25,
          letterSpacing: 7,
          display: "flex",
          borderLeft: "6px solid #B5121B",
          paddingLeft: 24,
        }}
      >
        VALORE PROPERTY GROUP
      </div>
      <div
        style={{
          fontSize: 94,
          lineHeight: 1.05,
          letterSpacing: -3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <span>Your Property.</span>
        <span>Our Priority.</span>
      </div>
      <div style={{ fontSize: 22, color: "#C0BFC1", display: "flex" }}>
        Property management · Greater Toronto Area & Ontario
      </div>
    </div>,
    { ...size },
  );
}
