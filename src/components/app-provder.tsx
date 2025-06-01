"use client";

import RefreshToken from "@/components/refresh-token";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

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
    return (
        // Provide the client to your App
        <QueryClientProvider client={queryClient}>
            <RefreshToken />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
