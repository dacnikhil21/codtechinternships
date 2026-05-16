/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: true,
  generateBuildId: async () => {
    // Generate a unique ID per build to force cache invalidation
    return `build-${Date.now()}`
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose', 'mongodb-memory-server'],
    webpackBuildWorker: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
