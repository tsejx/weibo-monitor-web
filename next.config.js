/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // GitHub Pages 配置
  basePath: process.env.GITHUB_PAGES_BASE_PATH || '',
  assetPrefix: process.env.GITHUB_PAGES_BASE_PATH || '',
}

module.exports = nextConfig
