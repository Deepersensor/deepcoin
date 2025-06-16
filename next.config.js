/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tomo-inc/tomo-web-sdk', '@tomo-wallet/uikit', '@tomo-inc/shared-type'],
}

module.exports = nextConfig
