/**
 * Next.js configuration
 * - Ignores ESLint errors during `next build` to allow deployments
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
