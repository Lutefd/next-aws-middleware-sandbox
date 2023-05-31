/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ['localhost', 'randomuser.me'],
  },
};

module.exports = nextConfig;
