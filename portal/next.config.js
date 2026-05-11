/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb-memory-server'],
    webpackBuildWorker: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
