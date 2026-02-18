import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const alt = "NavPrana Organics — Pure Desi Ghee";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // Read SVG logo and convert to base64 data URI
  const logoPath = join(process.cwd(), "public", "logo-ghee.svg");
  const logoBuffer = await readFile(logoPath);
  const logoBase64 = logoBuffer.toString("base64");
  const logoDataUri = `data:image/svg+xml;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a3d1a 0%, #265926 50%, #2d6b2d 100%)",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(240, 196, 66, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            left: "-60px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(240, 196, 66, 0.1)",
            display: "flex",
          }}
        />

        {/* Logo */}
        <img
          src={logoDataUri}
          width={480}
          height={115}
          alt="NavPrana Organics"
          style={{ marginBottom: "24px" }}
        />

        {/* Divider */}
        <div
          style={{
            width: "120px",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #f0c442, transparent)",
            margin: "16px 0",
            display: "flex",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#eef1ea",
            letterSpacing: "4px",
            textTransform: "uppercase",
            display: "flex",
          }}
        >
          Pure Desi Ghee
        </div>

        {/* Sub-tagline */}
        <div
          style={{
            fontSize: "18px",
            color: "#cfdbbd",
            marginTop: "12px",
            display: "flex",
          }}
        >
          Traditional Bilona Method • 100% Organic • Farm Fresh
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(240, 196, 66, 0.15)",
            padding: "8px 24px",
            borderRadius: "20px",
            border: "1px solid rgba(240, 196, 66, 0.3)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#f0c442", display: "flex" }}>
            www.navprana.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
