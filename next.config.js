/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(cfg) {
    cfg.optimization.minimize = false;
    return cfg;
  },
};

module.exports = nextConfig;
