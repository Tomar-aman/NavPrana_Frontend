/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.navprana.cloud",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "api.navprana.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;
