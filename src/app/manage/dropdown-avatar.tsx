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
import { useAccountProfile } from "@/queries/useAccount";

export default function DropdownAvatar() {
    const logoutMutation = useLogoutMutation();
    const router = useRouter();
    const { data } = useAccountProfile("dropdown-avatar");
    const account = data?.payload.data;

    const handleLogout = async () => {
        if (logoutMutation.isPending) return;
        try {
            const result = await logoutMutation.mutateAsync();

            router.push("/");

            toast(result.payload.message);
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
