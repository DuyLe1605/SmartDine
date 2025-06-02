import { clearTokensFormLS } from "@/lib/utils";
import { create } from "zustand";

interface AppStoreType {
    isAuth: boolean;
    setIsAuth: (auth: boolean) => void;
}

const useAppStore = create<AppStoreType>((set) => ({
    isAuth: false,
    setIsAuth: (auth: boolean) => {
        set({ isAuth: auth });
        if (!auth) {
            clearTokensFormLS();
        }
    },
}));

export default useAppStore;
