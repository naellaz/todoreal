/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚀 Jangan hentikan build meskipun ada error lint
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
