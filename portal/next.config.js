/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  trailingSlash: false,
  output: 'standalone',
  generateBuildId: async () => {
    return 'codtech-production-stable-v1';
  },
  
  // Hostinger Resource Optimization
  // Cloud Startup plan has 2GB RAM. Next.js build can spike to 1.5GB+.
  // Limiting parallelism prevents the build from hitting 100% CPU/RAM.
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      config.parallelism = 1; // Strict 1-thread build to save RAM
    }
    return config;
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
    webpackBuildWorker: false, // Prevents separate processes for build tasks
    cpus: 1, // Limit worker pool to 1 CPU core
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
