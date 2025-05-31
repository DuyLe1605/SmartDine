"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { UpdateMeBody, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";
import { useAccountMe, useUpdateMeMutation } from "@/queries/useAccount";
import { useUploadMediaMutation } from "@/queries/useMedia";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdateProfileForm() {
    const queryClient = useQueryClient();

    const [file, setFile] = useState<File | null>(null);
    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const { data } = useAccountMe({
        uniqueKey: "update-profile",
        onSuccess: (data) => {
            const { name, avatar } = data.data;

            form.reset({
                avatar: avatar ?? undefined,
                name: name,
            });
        },
    });
    const updateMeMutation = useUpdateMeMutation();
    const uploadMediaMutation = useUploadMediaMutation();

    const form = useForm<UpdateMeBodyType>({
        resolver: zodResolver(UpdateMeBody),
        defaultValues: {
            name: "",
            // Giá trị khởi tạo avatar sẽ là undefined thay vì '' . Vì nếu để '' thì nếu avatar là null,
            // chúng ta không upload avatar thì sẽ không cập nhật được do không vượt qua được zod schema
            avatar: undefined,
        },
    });
    const formAvatar = form.watch("avatar");
    const name = form.watch("name");
    const previewAvatar = file ? URL.createObjectURL(file) : formAvatar;

    const onSubmit = async (values: UpdateMeBodyType) => {
        if (updateMeMutation.isPending) return;

        try {
            let body = values;
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadImageResult = await uploadMediaMutation.mutateAsync(formData);
                const imageUrl = uploadImageResult.payload.data;
                body = { ...body, avatar: imageUrl };
            }

            const updateMeResult = await updateMeMutation.mutateAsync(body);
            // Cập nhật cả query của drop-down avatar
            queryClient.invalidateQueries({ queryKey: ["account-me", "dropdown-avatar"] });
            toast(updateMeResult.payload.message);
        } catch (error) {
            handleErrorApi({ error, setError: form.setError });
        }
    };

    return (
        <Form {...form}>
            <form
                noValidate
                className="grid auto-rows-max items-start gap-4 md:gap-8"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <Card x-chunk="dashboard-07-chunk-0">
                    <CardHeader>
                        <CardTitle>Thông tin cá nhân</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage src={previewAvatar} />
                                                <AvatarFallback className="rounded-none ">
                                                    <span className="font-bold text-shadow-zinc-50 text-shadow-xs">
                                                        Avatar
                                                    </span>
                                                </AvatarFallback>
                                            </Avatar>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                ref={avatarInputRef}
                                                onChange={(event) => {
                                                    const file = event.target.files?.[0];
                                                    if (file) {
                                                        setFile(file);

                                                        // Fake url để vượt qua zod validation, chúng ta không gửi url này lên
                                                        field.onChange(`http://localhost:3000/${field.name}`);
                                                    }
                                                }}
                                            />
                                            <button
                                                className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed cursor-pointer"
                                                type="button"
                                                onClick={() => {
                                                    avatarInputRef.current?.click();
                                                }}
                                            >
                                                <Upload className="h-4 w-4 text-muted-foreground" />
                                                <span className="sr-only">Upload</span>
                                            </button>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-3">
                                            <Label htmlFor="name">Tên</Label>
                                            <Input id="name" type="text" className="w-full" {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <div className=" items-center gap-2 md:ml-auto flex">
                                <Button variant="outline" size="sm" type="reset">
                                    Hủy
                                </Button>
                                <Button size="sm" type="submit">
                                    Lưu thông tin
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
