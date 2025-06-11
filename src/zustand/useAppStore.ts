import { clearTokensFormLS } from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import { create } from "zustand";

interface AppStoreType {
    isAuth: boolean;

    role: RoleType | undefined;
    setRole: (role?: RoleType | undefined) => void;
}

const useAppStore = create<AppStoreType>((set) => ({
    role: undefined,
    isAuth: false,
    setRole: (role?: RoleType | undefined) => {
        set({ role, isAuth: Boolean(role) });
        if (!role) {
            clearTokensFormLS();
        }
    },
}));

export default useAppStore;
