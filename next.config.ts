import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Allow external images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  
  // Optimize for faster HMR in development
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Faster builds
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Reduce HMR overhead in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
