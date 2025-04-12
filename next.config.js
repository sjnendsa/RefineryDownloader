/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true, // disable image optimization
  },
};

module.exports = nextConfig;
