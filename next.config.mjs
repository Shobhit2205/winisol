/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["data.winisol.com"],
    },
    webpack(config, { isServer }) {
        // Exclude fs from client-side bundles
        if (!isServer) {
          config.resolve.fallback = {
            fs: false,
          };
        }
        return config;
    },
    output: "standalone",
}

export default nextConfig
