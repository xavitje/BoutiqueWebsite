import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    webpack: (config) => {
        config.module.rules.push({
            test: /\.geojson$/,
            type: 'json',
        });
        return config;
    },
};

export default nextConfig;
