/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL || "http://localhost:8000",
    APP_URL: process.env.APP_URL || "http://localhost:3001",
  },
};

module.exports = nextConfig;
