import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',

    // Required for GitHub Pages deployment
    basePath: '/Leetcode-Tracker-Demo',
    assetPrefix: '/Leetcode-Tracker-Demo',

    images: {
        unoptimized: true, // disable image optimization for static hosting
    },
};

export default nextConfig;
