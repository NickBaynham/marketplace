import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const runtime = "edge";
export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0b1220 0%, #1a2540 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7, letterSpacing: 4, textTransform: "uppercase" }}>
          {site.company}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 24, lineHeight: 1.1 }}>
          {site.name}
        </div>
        <div style={{ fontSize: 36, marginTop: 24, opacity: 0.85 }}>{site.tagline}</div>
        <div
          style={{
            marginTop: "auto",
            width: 120,
            height: 6,
            background: "{{accent_color}}",
            borderRadius: 3,
          }}
        />
      </div>
    ),
    size,
  );
}
