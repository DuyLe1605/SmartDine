import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "localhost",
                pathname: "/**",
            },
            {
                hostname: "api-bigboy.duthanhduoc.com",
                pathname: "/**",
            },
            {
                hostname: "via.placeholder.com",
                pathname: "/**",
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
