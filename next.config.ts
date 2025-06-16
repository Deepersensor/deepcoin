import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@tomo-inc/tomo-web-sdk', '@tomo-wallet/uikit', '@tomo-inc/shared-type'],

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Removed i18n configuration
};

export default nextConfig;

