import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";

export async function POST() {
    const cookieStore = await cookies();
    const refreshTokenFromCookie = cookieStore.get("refreshToken")?.value;

    // Không nhận được refresh Token thì throw vè 401 để tự động logout
    if (!refreshTokenFromCookie) {
        return Response.json(
            {
                message: "Không nhận được refreshToken",
            },
            { status: 401 }
        );
    }
    try {
        const { payload } = await authApiRequest.serverRefreshToken({ refreshToken: refreshTokenFromCookie });
        const { accessToken, refreshToken } = payload.data;
        // Tiến hành decode accessToken và refreshToken ra và lấy phần exp, giá trị exp tính bằng giây
        const decodedAccessToken = jwt.decode(accessToken) as { exp: number };
        const decodedRefreshToken = jwt.decode(refreshToken) as { exp: number };
        // Tiến hành setCookie, expires là millisecond nên phải nhân thêm 1000
        cookieStore.set("accessToken", accessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            expires: decodedAccessToken.exp * 1000,
        });
        cookieStore.set("refreshToken", refreshToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            expires: decodedRefreshToken.exp * 1000,
        });

        return Response.json(payload);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            });
        } else {
            return Response.json(
                { message: error.message ?? "Có lỗi xảy ra" },
                {
                    status: 401,
                }
            );
        }
    }
}
