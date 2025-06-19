"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface Props {
    children: React.ReactNode;
}
export default function DishModal({ children }: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(true);
    return (
        <Dialog
            open={open}
            onOpenChange={(open) => {
                setOpen(open);
                if (!open) {
                    setTimeout(() => {
                        router.back();
                    }, 300);
                }
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Nhà hàng SmartDine</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}
