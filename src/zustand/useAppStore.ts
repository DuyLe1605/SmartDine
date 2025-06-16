import { clearTokensFormLS } from "@/lib/utils";
import { RoleType } from "@/types/jwt.types";
import { Socket } from "socket.io-client";
import { create } from "zustand";

interface AppStoreType {
    isAuth: boolean;
    role: RoleType | undefined;
    setRole: (role?: RoleType | undefined) => void;
    socket: Socket | undefined;
    setSocket: (socket?: Socket | undefined) => void;
    disconnectSocket: () => void;
}

const useAppStore = create<AppStoreType>((set, get) => ({
    role: undefined,
    isAuth: false,
    setRole: (role?: RoleType | undefined) => {
        set({ role, isAuth: Boolean(role) });
        if (!role) {
            clearTokensFormLS();
        }
    },
    socket: undefined,
    setSocket: (socket?: Socket | undefined) => set({ socket }),
    disconnectSocket: () =>
        set((state) => {
            state.socket?.disconnect();
            return { socket: undefined };
        }),
}));

export default useAppStore;
