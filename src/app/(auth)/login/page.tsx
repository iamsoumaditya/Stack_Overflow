"use client";

import React from "react";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useAuthStore } from "@/src/store/Auth";
import Link from "next/link";
import { LoaderOne } from "@/src/components/ui/loader";
import { account } from "@/src/models/client/config";
import env from "@/src/app/env";
import { OAuthProvider } from "appwrite";
import { Eye, EyeOff } from "lucide-react";

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-linear-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

export default function Login() {
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showpassword, setShowPassword] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      setError(() => "Please fill out all fields");
      return;
    }

    setIsLoading(() => true);
    setError(() => "");

    const loginResponse = await login(email.toString(), password.toString());
    if (loginResponse.error) {
      if (loginResponse.error?.message.includes("blocked")) {
        setIsLoading(() => false);
        setError("Your account has been disabled. Please contact support.");
        return;
      }
      setIsLoading(() => false);
      setError(() => loginResponse.error!.message);
    }

    setIsLoading(() => false);
  };

  const handleGoogleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    e.preventDefault();
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${env.domain}/`,
      `${env.domain}/login`
    );
  };

  return (
    <div className="mx-auto w-full max-w-md  border border-solid border-neutral-200 dark:border-neutral-600 bg-white p-4 shadow-input dark:bg-black rounded-2xl md:p-8">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Login to Queue Underflow
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Login to Queue Underflow
        <br /> If you don&apos;t have an account,{" "}
        <Link href="/register" className="text-rose-400 hover:underline">
          register
        </Link>{" "}
      </p>

      {error && (
        <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            className="text-black dark:text-white"
            id="email"
            name="email"
            placeholder="soumaditya@roy.dev"
            type="email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative w-full">
            <Input
              type={showpassword ? "text" : "password"}
              className="text-black dark:text-white"
              id="password"
              name="password"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showpassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              {showpassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </LabelInputContainer>

        {!isLoading && (
          <button
            className="group/btn relative block h-10 w-full rounded-md bg-linear-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            disabled={isLoading}
          >
            Log in &rarr;
            <BottomGradient />
          </button>
        )}
        {isLoading && (
          <div className="flex justify-center items-center mt-6">
            <LoaderOne />
          </div>
        )}

        <div className="my-8 h-px w-full bg-linear-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
            disabled={isLoading}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              Google
            </span>
            {!isLoading && <BottomGradient />}
          </button>
        </div>
      </form>
    </div>
  );
}
