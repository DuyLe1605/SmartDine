import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { ChangePasswordV2BodyType } from "@/schemaValidations/account.schema";
import accountApiRequest from "@/apiRequests/account";

export async function PUT(request: Request) {
    const body = (await request.json()) as ChangePasswordV2BodyType;
    const cookieStore = await cookies();
    const accessTokenFromCookie = cookieStore.get("accessToken")?.value;
    if (!accessTokenFromCookie) {
        return Response.json({ message: "Không tìm thấy accessToken" }, { status: 401 });
    }
    try {
        const { payload } = await accountApiRequest.serverChangePasswordV2(accessTokenFromCookie, body);
        const { accessToken, refreshToken } = payload.data;
        // Tiến hành decode accessToken và refreshToken ra và lấy phần exp, giá trị exp tính bằng giây
        const decodeAccessToken = jwt.decode(accessToken) as { exp: number };
        const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };
        // Tiến hành setCookie, expires là millisecond nên phải nhân thêm 1000
        cookieStore.set("accessToken", accessToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            expires: decodeAccessToken.exp * 1000,
        });
        cookieStore.set("refreshToken", refreshToken, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            expires: decodeRefreshToken.exp * 1000,
        });
        return Response.json(payload);
    } catch (error) {
        if (error instanceof HttpError) {
            return Response.json(error.payload, {
                status: error.status,
            });
        } else {
            return Response.json(
                { message: "Có lỗi xảy ra" },
                {
                    status: 500,
                }
            );
        }
    }
}
