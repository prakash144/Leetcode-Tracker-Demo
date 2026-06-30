import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    output: 'export',

    // GitHub Pages deploys to a subpath; local dev stays at root
    basePath: isProd ? '/Interview-Tracly' : '',
    assetPrefix: isProd ? '/Interview-Tracly' : '',

    images: {
        unoptimized: true, // disable image optimization for static hosting
    },
};

export default nextConfig;
