import LoginForm from "@/app/(public)/(auth)/login/login-form";
import { Half1Icon } from "@radix-ui/react-icons";
import { Suspense } from "react";

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Suspense fallback={<h2 className="mt-20 text-xl">Login Form</h2>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
