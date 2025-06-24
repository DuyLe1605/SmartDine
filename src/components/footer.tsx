import { Link } from "@/i18n/navigation";
import { Beef } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full p-4 md:p-8 text-muted-foreground border-t">
            <div className=" flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
                <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4">
                    <Link href="/" className="flex items-center gap-2 " prefetch={false}>
                        <Beef className="h-6 w-6 hover:text-foreground" />
                        <span className="text-sm font-medium">Smart Dine Restaurant</span>
                    </Link>
                    <div className="h-5 bg-foreground w-[1px]"></div>
                    <div className=" flex flex-col sm:flex-row items-center gap-4 text-sm">
                        <Link href="/term-of-service" className="hover:underline" prefetch={false}>
                            Điều khoản dịch vụ
                        </Link>
                        <Link href="/privacy-policy" className="hover:underline" prefetch={false}>
                            Chính sách bảo mật
                        </Link>
                        <Link href="/about" className="hover:underline" prefetch={false}>
                            Về chúng tôi
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <p>Mạng xã hội</p>
                    <Link
                        href="https://www.facebook.com/leduyy05"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        prefetch={false}
                    >
                        <svg
                            role="img"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>Facebook</title>
                            <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
                        </svg>
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link
                        href="https://www.youtube.com/@DuygamingBlogspot"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        prefetch={false}
                    >
                        <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 fill-current"
                        >
                            <title>YouTube</title>
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                        <span className="sr-only">YouTube</span>
                    </Link>
                    <Link
                        href="https://github.com/DuyLe1605"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                        prefetch={false}
                    >
                        <svg
                            role="img"
                            viewBox="0 0 24 24"
                            className="w-5 h-5 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <title>GitHub</title>
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                        <span className="sr-only">GitHub</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
