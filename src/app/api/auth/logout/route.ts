import authApiRequest from "@/apiRequests/auth";
import { HttpError } from "@/lib/http";
import { LogoutBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;
    // Kiểu gì chúng ta cũng sẽ xóa đi accessToken và refreshToken trong cookie
    // Nên đều sẽ trả về status là 200
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    if (!accessToken || !refreshToken) {
        return Response.json(
            {
                message: "Không nhận được accessToken hoặc refreshToken",
            },
            { status: 200 }
        );
    }
    try {
        const { payload } = await authApiRequest.serverLogout({
            refreshToken,
            accessToken,
        });
        return Response.json(payload);
    } catch (error) {
        return Response.json(
            { message: "Có lỗi đến từ Backend Server" },
            {
                status: 200,
            }
        );
    }
}
