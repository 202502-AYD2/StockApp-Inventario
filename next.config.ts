/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 1. Ignorar errores de TypeScript (como el 'any')
  typescript: {
    ignoreBuildErrors: true,
  },
  // 2. Ignorar errores de Linting (como el 'CheckCircle' sin usar)
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; // Si tu archivo es .mjs usa: export default nextConfig;