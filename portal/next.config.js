/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  output: 'standalone',
  generateBuildId: async () => {
    return 'codtech-production-stable-v1';
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
    serverComponentsExternalPackages: ['mysql2'],
    webpackBuildWorker: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
