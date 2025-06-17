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
import { useRouter, useSearchParams } from "next/navigation";
import useAppStore from "@/zustand/useAppStore";
import { useEffect } from "react";
import { generateSocketInstance } from "@/lib/socket";
import envConfig from "@/config";
import Link from "next/link";

export default function LoginForm() {
    const loginMutation = useLoginMutation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const clearToken = searchParams.get("clearToken");
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
        } catch (error: any) {
            handleErrorApi({ error, setError: form.setError });
        }
    };
    return (
        <Card className="mx-auto  w-100 max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
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
                                                <Label htmlFor="password">Password</Label>
                                            </div>
                                            <Input id="password" type="password" required {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full">
                                Đăng nhập
                            </Button>

                            <Link href={googleOauthUrl}>
                                <Button variant="outline" className="w-full" type="button">
                                    Đăng nhập bằng Google
                                </Button>
                            </Link>
                        </div>
                    </form>
                </Form>
                <p className="text-xs mt-4 text-foreground/40">
                    * Nếu bạn là khách, hãy quét mã QR trên bàn ăn để đăng nhập
                </p>
            </CardContent>
        </Card>
    );
}
