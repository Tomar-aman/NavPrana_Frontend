export default function manifest() {
  return {
    name: "NavPrana Organics — A2 Desi Cow & Buffalo Bilona Ghee",
    short_name: "NavPrana Organics",
    description:
      "Buy pure A2 desi cow ghee and A2 buffalo bilona ghee online. Hand-churned the traditional bilona way in the Chambal valley, Madhya Pradesh. Grass-fed, FSSAI certified, nothing added.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2d6b2d",
    orientation: "portrait-primary",
    categories: ["food", "shopping", "health"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
