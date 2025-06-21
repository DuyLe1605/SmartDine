"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/queries/useAuth";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import { useEffect } from "react";
import { generateSocketInstance } from "@/lib/socket";
import envConfig from "@/config";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import SearchParamsLoader, { useSearchParamsLoader } from "@/components/search-params-loader";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import { FcGoogle } from "react-icons/fc";

export default function LoginForm() {
    const t = useTranslations("Login");
    const { theme } = useTheme();
    const loginMutation = useLoginMutation();
    const router = useRouter();
    const { searchParams, setSearchParams } = useSearchParamsLoader();
    const clearToken = searchParams?.get("clearToken");
    const setRole = useAppStore((state) => state.setRole);
    const setSocket = useAppStore((state) => state.setSocket);

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (clearToken) {
            setRole();
        }
    }, [clearToken, setRole]);

    // Google
    const getOauthGoogleUrl = () => {
        const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const options = {
            redirect_uri: envConfig.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
            client_id: envConfig.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            access_type: "offline",
            response_type: "code",
            prompt: "consent",
            scope: [
                "https://www.googleapis.com/auth/userinfo.profile",
                "https://www.googleapis.com/auth/userinfo.email",
            ].join(" "),
        };
        const qs = new URLSearchParams(options);
        return `${rootUrl}?${qs.toString()}`;
    };
    const googleOauthUrl = getOauthGoogleUrl();

    const onSubmit = async (data: LoginBodyType) => {
        if (loginMutation.isPending) return;
        try {
            const result = await loginMutation.mutateAsync(data);

            setRole(result.payload.data.account.role);
            router.push("/manage/dashboard");
            setSocket(generateSocketInstance(result.payload.data.accessToken));

            // setIsAuth(true);
            toast.success(result.payload.message);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            handleErrorApi({ error, setError: form.setError });
        }
    };
    return (
        <Card className="mx-auto p-0 w-100 max-w-sm">
            <SearchParamsLoader onParamsReceived={setSearchParams} />
            <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="  py-10 ">
                <CardHeader>
                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                    <CardDescription>{t("cardDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            className="space-y-2 max-w-[600px] flex-shrink-0 w-full mt-5"
                            noValidate
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <div className="grid gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid gap-2">
                                                <Label htmlFor="email">{t("email")}</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    required
                                                    {...field}
                                                />
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid gap-2">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">{t("password")}</Label>
                                                </div>
                                                <Input id="password" type="password" required {...field} />
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full mt-2">
                                    {t("loginButton")}
                                </Button>

                                <Link href={googleOauthUrl}>
                                    <Button variant="outline" className="w-full" type="button">
                                        <FcGoogle size={25} />
                                        {t("googleLoginButton")}
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </Form>
                    <p className="text-xs mt-4 text-foreground/40">{t("warning")}</p>
                </CardContent>
            </MagicCard>
        </Card>
    );
}
