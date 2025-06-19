import messages from "./messages/en.json";

declare module "next-intl" {
    interface AppConfig {
        Messages: typeof messages;
    }
}

// TÌm hiểu thêm tại :https://next-intl.dev/docs/workflows/typescript
