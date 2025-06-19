import { routing } from "@/i18n/routing";
import messages from "./messages/en.json";

declare module "next-intl" {
    interface AppConfig {
        Locale: (typeof routing.locales)[number];
        Messages: typeof messages;
    }
}
// TÌm hiểu thêm tại :https://next-intl.dev/docs/workflows/typescript
