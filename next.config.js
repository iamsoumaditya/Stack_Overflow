import withPWA from "next-pwa" ;

// Base Next.js config
const nextConfig = {
  reactStrictMode: true,
  turbopack:{}
};

// Wrap with PWA
const withPWAFunc = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

export default withPWAFunc(nextConfig);