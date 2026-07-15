export default function manifest() {
  return {
    name: "NavPrana Organics — Buy Pure Desi Bilona Ghee Online | Best Organic Ghee in India",
    short_name: "NavPrana Organics",
    description:
      "Buy 100% pure organic bilona ghee online from NavPrana Organics — India's best desi ghee brand. Traditional Bilona method A2 buffalo ghee, grass-fed, FSSAI certified. Order pure desi buffalo ghee, premium desi ghee, and organic ghee from Chambal valley.",
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
