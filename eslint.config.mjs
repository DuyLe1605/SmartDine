import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query"; // 👈 thêm dòng này

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const eslintConfig = [
    ...compat.extends("next/core-web-vitals", "next/typescript"),

    // 👇 cấu hình ESLint plugin cho TanStack Query
    ...pluginQuery.configs["flat/recommended"],

    // 👇 nếu muốn tùy chỉnh rule, bạn có thể thêm thêm block này:
    {
        rules: {
            "@tanstack/query/exhaustive-deps": "error",
            "@tanstack/query/no-deprecated-options": "error",
            "@tanstack/query/prefer-query-object-syntax": "warn",
            "@tanstack/query/stable-query-client": "error",
        },
    },
];

export default eslintConfig;
