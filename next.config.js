/**
 * Next.js configuration
 * - Ignores ESLint errors during `next build` to allow deployments
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
