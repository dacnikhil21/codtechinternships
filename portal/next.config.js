/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb-memory-server'],
    webpackBuildWorker: false,
  },
  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
};

export default nextConfig;
