"use client";

import RefreshToken from "@/components/refresh-token";
import { decodeToken, getAccessTokenFromLs } from "@/lib/utils";
import useAppStore from "@/zustand/useAppStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";

// Create a client
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    },
});

export default function AppProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const setRole = useAppStore((state) => state.setRole);
    useEffect(() => {
        const accessToken = getAccessTokenFromLs();

        if (accessToken) {
            const role = decodeToken(accessToken).role;
            setRole(role);
        }
    }, []);
    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
            {children}
            <RefreshToken />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
