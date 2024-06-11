/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: "/:path*",
          destination: "0.0.0.0:2000/:path*",
        },
      ];
    },
  };