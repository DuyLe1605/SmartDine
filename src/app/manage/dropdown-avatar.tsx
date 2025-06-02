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
import Link from "next/link";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleErrorApi } from "@/lib/utils";
import { useAccountMe } from "@/queries/useAccount";
import useAppStore from "@/zustand/useAppStore";

export default function DropdownAvatar() {
    const logoutMutation = useLogoutMutation();
    const router = useRouter();
    const { data } = useAccountMe({ uniqueKey: "dropdown-avatar" });
    const account = data?.payload.data;
    const setIsAuth = useAppStore((state) => state.setIsAuth);
    const handleLogout = async () => {
        if (logoutMutation.isPending) return;
        try {
            const result = await logoutMutation.mutateAsync();
            setIsAuth(false);
            router.push("/");

            toast.success(result.payload.message);
        } catch (error: any) {
            console.error(error);
            handleErrorApi({ error });
        }
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                    <Avatar>
                        <AvatarImage src={account?.avatar ?? undefined} alt={account?.name} />
                        <AvatarFallback>
                            {account?.name
                                .split(" ")
                                .slice(-2)
                                .map((word) => word.slice(0, 1))
                                .join("")
                                .toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={"/manage/setting"} className="cursor-pointer">
                        Cài đặt
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
