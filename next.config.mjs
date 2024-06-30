/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      "/": ["./src/app/data/**/*"],
    },
  },
};

export default nextConfig;
