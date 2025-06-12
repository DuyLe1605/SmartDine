"use client";

import envConfig from "@/config";
import { getAccessTokenFromLs } from "@/lib/utils";
import { io } from "socket.io-client";

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: { Authorization: `Bearer ${getAccessTokenFromLs()}` },
});

export default socket;
