import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',

    // Required for GitHub Pages deployment
    basePath: '/Leetcode-Tracker',
    assetPrefix: '/Leetcode-Tracker',

    images: {
        unoptimized: true, // disable image optimization for static hosting
    },
};

export default nextConfig;
