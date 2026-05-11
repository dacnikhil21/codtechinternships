/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  generateBuildId: async () => {
    // This ensures that during a single deployment cycle, 
    // all chunks share the same ID, preventing 404s.
    return 'codtech-production-v2'
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb-memory-server'],
    webpackBuildWorker: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
