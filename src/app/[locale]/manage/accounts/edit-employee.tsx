"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UpdateEmployeeAccountBody, UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Role, RoleValues } from "@/constants/type";
import { useGetAccount, useUpdateEmployee } from "@/queries/useAccount";
import { useUploadMediaMutation } from "@/queries/useMedia";
import { toast } from "sonner";
import {
    decodeToken,
    generateAvatarName,
    getAccessTokenFromLs,
    getRefreshTokenFromLs,
    getVietnameseRoleName,
    handleErrorApi,
} from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function EditEmployee({
    id,
    setId,
    onSubmitSuccess,
}: {
    id?: number | undefined;
    setId: (value: number | undefined) => void;
    onSubmitSuccess?: () => void;
}) {
    const [file, setFile] = useState<File | null>(null);
    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const form = useForm<UpdateEmployeeAccountBodyType>({
        resolver: zodResolver(UpdateEmployeeAccountBody),
        defaultValues: {
            name: "",
            email: "",
            avatar: undefined,
            password: undefined,
            confirmPassword: undefined,
            changePassword: false,
            role: Role.Employee,
        },
    });
    // queries
    const { data } = useGetAccount({ id: id as number, enabled: Boolean(id) });
    const updateEmployeeMutation = useUpdateEmployee();
    const uploadMediaMutation = useUploadMediaMutation();

    const avatar = form.watch("avatar");
    const name = form.watch("name");
    const changePassword = form.watch("changePassword");
    const previewAvatarFromFile = file ? URL.createObjectURL(file) : avatar;
    useEffect(() => {
        if (data) {
            const { name, email, avatar, role } = data.payload.data;
            form.reset({
                name,
                email,
                avatar: avatar ?? undefined,
                password: form.getValues("password"),
                confirmPassword: form.getValues("confirmPassword"),
                changePassword: form.getValues("changePassword"),
                role,
            });
        }
    }, [data, form]);

    // Func
    const reset = () => {
        setFile(null);
        setId(undefined);
    };
    const onSubmit = async (values: UpdateEmployeeAccountBodyType) => {
        // Tránh trường hợp chưa gọi api xong mà bị gọi tiếp
        if (updateEmployeeMutation.isPending) return;

        try {
            let body: UpdateEmployeeAccountBodyType & { id: number } = { id: id as number, ...values };
            // Trường hợp có tải lên avatar người dùng
            if (file) {
                const formData = new FormData();
                formData.append("file", file);
                const uploadImageResult = await uploadMediaMutation.mutateAsync(formData);
                const imageUrl = uploadImageResult.payload.data;
                body = { ...body, avatar: imageUrl };
            }

            const res = await updateEmployeeMutation.mutateAsync(body);

            toast.success(res.payload.message);
            reset();
            if (onSubmitSuccess) onSubmitSuccess();
        } catch (error) {
            handleErrorApi({ error, setError: form.setError });
        }
    };

    return (
        <Dialog
            open={Boolean(id)}
            onOpenChange={(value) => {
                if (!value) {
                    reset();
                }
            }}
        >
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>Cập nhật tài khoản</DialogTitle>
                    <DialogDescription>Các trường tên, email, mật khẩu là bắt buộc</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        noValidate
                        className="grid auto-rows-max items-start gap-4 md:gap-8"
                        id="edit-employee-form"
                        onSubmit={form.handleSubmit(onSubmit, (error) => console.error(error))}
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex gap-2 items-start justify-start">
                                            <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                                                <AvatarImage src={previewAvatarFromFile} />
                                                <AvatarFallback className="rounded-none">
                                                    {(generateAvatarName(name), "Avatar")}
                                                </AvatarFallback>
                                            </Avatar>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={avatarInputRef}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setFile(file);
                                                        field.onChange("http://localhost:3000/" + file.name);
                                                    }
                                                }}
                                                className="hidden"
                                            />
                                            <button
                                                className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                                                type="button"
                                                onClick={() => avatarInputRef.current?.click()}
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
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="name">Tên</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input id="name" className="w-full" {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="email">Email</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Input id="email" className="w-full" {...field} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="description">Vai trò</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Select
                                                    onValueChange={(value) => {
                                                        const accountId = decodeToken(getRefreshTokenFromLs()!).userId;
                                                        const changeId = data?.payload.data.id;

                                                        if (changeId === 1 && accountId !== changeId) {
                                                            toast.error(
                                                                "Bạn không có quyền thay đổi vai trò của admin tối cao!"
                                                            );
                                                            return;
                                                        }
                                                        field.onChange(value);
                                                    }}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {RoleValues.map((status) => {
                                                            if (status === Role.Guest) return null;
                                                            return (
                                                                <SelectItem key={status} value={status}>
                                                                    {getVietnameseRoleName(status)}
                                                                </SelectItem>
                                                            );
                                                        })}
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="changePassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                            <Label htmlFor="email">Đổi mật khẩu</Label>
                                            <div className="col-span-3 w-full space-y-2">
                                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                <FormMessage />
                                            </div>
                                        </div>
                                    </FormItem>
                                )}
                            />
                            {changePassword && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="password">Mật khẩu mới</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <Input
                                                        id="password"
                                                        className="w-full"
                                                        type="password"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            )}
                            {changePassword && (
                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <Input
                                                        id="confirmPassword"
                                                        className="w-full"
                                                        type="password"
                                                        {...field}
                                                    />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button type="submit" form="edit-employee-form">
                        Lưu
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
