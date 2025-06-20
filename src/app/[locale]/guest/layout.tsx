import Layout from "@/app/[locale]/(public)/layout";
import { defaultLocale } from "@/i18n/config";

export default async function GuestLayout({ children }: { children: React.ReactNode }) {
    const params = Promise.resolve({ locale: defaultLocale });
    return (
        <Layout modal={null} params={params}>
            {children}
        </Layout>
    );
}
