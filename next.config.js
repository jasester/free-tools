/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/free-tools',
  trailingSlash: true,
};

module.exports = nextConfig;