"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuestLoginBody, GuestLoginBodyType } from "@/schemaValidations/guest.schema";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useGuestLoginMutation } from "@/queries/useGuest";
import { handleErrorApi } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import { generateSocketInstance } from "@/lib/socket";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function GuestLoginForm() {
    const t = useTranslations("GuestLogin");
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = useParams();
    const token = searchParams.get("token");
    const tableNumber = Number(params.number)!;
    const setRole = useAppStore((state) => state.setRole);
    const setSocket = useAppStore((state) => state.setSocket);
    const form = useForm<GuestLoginBodyType>({
        resolver: zodResolver(GuestLoginBody),
        defaultValues: {
            name: "",
            token: token ?? "",
            tableNumber,
        },
    });
    const guestLoginMutation = useGuestLoginMutation();

    useEffect(() => {
        if (!token) {
            router.push("/");
        }
    }, [token, router]);

    const onSubmit = async (values: GuestLoginBodyType) => {
        if (guestLoginMutation.isPending) return;
        try {
            const loginRes = await guestLoginMutation.mutateAsync(values);
            setRole(loginRes.payload.data.guest.role);
            setSocket(generateSocketInstance(loginRes.payload.data.accessToken));
            router.push("/guest/menu");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            handleErrorApi({ error, setError: form.setError });
        }
    };

    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">{t("title")}</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                        noValidate
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <Label htmlFor="name">{t("label")}</Label>
                                            <Input id="name" type="text" required {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full">
                                {t("button")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
