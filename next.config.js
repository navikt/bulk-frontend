/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  //  serverRuntimeConfig: {

  //  }
  // async redirects() {
  //   return [
  //     {
  //       source: "/api/v1/:path*",
  //       destination: "https://bulk-backend.dev.intern.nav.no/:path*",
  //       permanent: true,
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
