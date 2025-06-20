// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query";
import prettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    // Kế thừa cấu hình ESLint của Next.js + TypeScript
    ...compat.extends("next/core-web-vitals", "next", "next/typescript", "prettier"),

    // TanStack Query rules
    ...pluginQuery.configs["flat/recommended"],

    // Tắt các rule xung đột với Prettier
    prettier,

    // Tùy chỉnh rules
    {
        rules: {
            // TanStack Query
            "@tanstack/query/exhaustive-deps": "error",

            "@tanstack/query/stable-query-client": "error",

            // Cơ bản
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

            "react/react-in-jsx-scope": "off", // không cần import React trong Next.js
        },
    },
];
export default eslintConfig;
