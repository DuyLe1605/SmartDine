"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link, useRouter } from "@/i18n/navigation";
import { useLogoutMutation } from "@/queries/useAuth";

import { toast } from "sonner";
import { generateAvatarName, getVietnameseRoleName, handleErrorApi } from "@/lib/utils";
import { useAccountMe } from "@/queries/useAccount";
import useAppStore from "@/zustand/useAppStore";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export default function DropdownAvatar() {
    const logoutMutation = useLogoutMutation();
    const role = useAppStore((state) => state.role);
    const router = useRouter();
    const { data } = useAccountMe({ uniqueKey: "dropdown-avatar" });
    const account = data?.payload.data;
    const setRole = useAppStore((state) => state.setRole);
    const disconnectSocket = useAppStore((state) => state.disconnectSocket);
    const handleLogout = async () => {
        if (logoutMutation.isPending) return;
        try {
            const result = await logoutMutation.mutateAsync();
            setRole();
            disconnectSocket();
            router.push("/");

            toast.success(result.payload.message);
        } catch (error: any) {
            console.error(error);
            handleErrorApi({ error });
        }
    };
    return (
        // Nên bọc dropdown menu bằng alert dialog
        <AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                        <Avatar>
                            <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
                            <AvatarFallback>{generateAvatarName(account?.name, "Avatar")}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        <div className="flex items-center">
                            <span className="mr-3"> {account?.name}</span>{" "}
                            <Badge variant="secondary">{getVietnameseRoleName(role!)}</Badge>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link href={"/manage/setting"} className="cursor-pointer">
                            Cài đặt
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem>Đăng xuất</DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có muốn đăng xuất hay không ?</AlertDialogTitle>
                    <AlertDialogDescription>Nếu không muốn bạn có thể bấm quay lại</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Quay Lại</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Đăng xuất</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
