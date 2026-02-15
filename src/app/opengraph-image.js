import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NavPrana Organics — Pure Desi Ghee";
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
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
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
            background: "rgba(212, 168, 67, 0.15)",
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
            background: "rgba(212, 168, 67, 0.1)",
            display: "flex",
          }}
        />

        {/* Leaf icon */}
        <div
          style={{
            fontSize: "64px",
            marginBottom: "16px",
            display: "flex",
          }}
        >
          🌿
        </div>

        {/* Brand name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#D4A843",
            letterSpacing: "-2px",
            display: "flex",
          }}
        >
          NavPrana Organics
        </div>

        {/* Divider */}
        <div
          style={{
            width: "120px",
            height: "3px",
            background: "linear-gradient(90deg, transparent, #D4A843, transparent)",
            margin: "20px 0",
            display: "flex",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#e8e8e8",
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
            color: "#a0a0a0",
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
            background: "rgba(212, 168, 67, 0.15)",
            padding: "8px 24px",
            borderRadius: "20px",
            border: "1px solid rgba(212, 168, 67, 0.3)",
          }}
        >
          <div style={{ fontSize: "14px", color: "#D4A843", display: "flex" }}>
            www.navprana.com
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
