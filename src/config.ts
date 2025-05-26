import { z } from "zod";

// Nhiệm vụ của file config này là validate xem các biến môi trường có được khai báo hợp lệ không

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_URL: z.string(),
});

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
});

// Nếu không hợp lệ thì sẽ throw Error cho người dùng/dev biết
if (!configProject.success) {
    console.error(configProject.error.errors);
    throw new Error("Các khai báo biến môi trường không hợp lệ");
}

const envConfig = configProject.data;
export default envConfig;
