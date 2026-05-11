/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb-memory-server'],
    webpackBuildWorker: false,
  },
  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
};

export default nextConfig;
