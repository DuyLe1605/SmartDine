import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    experimental: {
        reactCompiler: true,
    },
    eslint: {
        dirs: ["pages", "utils"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
        ignoreDuringBuilds: true, // ✅ bỏ qua lỗi ESLint khi build, nên xóa khi deploy thật
    },
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "4000",
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
