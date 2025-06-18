import Layout from "@/app/(public)/layout";

export default function GuestLayout({ childern }: { childern: React.ReactNode }) {
    return <Layout modal={null}>{childern}</Layout>;
}
