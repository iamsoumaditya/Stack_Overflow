"use client";
import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/Auth";
import { setupNotifications } from "@/src/utils/notification";
import axios from "axios";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { googleLogin } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Authenticating with Google...");

  useEffect(() => {
    // Simulate checking authentication and getting user
    const handleOAuthCallback = async () => {
      try {
        // Step 1: Show initial loading
        setMessage("Verifying your account...");

        // Simulate API call to get user data
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Step 2: Attempt to get user
        setMessage("Fetching your profile...");

        await new Promise((resolve) => setTimeout(resolve, 1000));
        const res = await googleLogin();

        // Step 3: Success - redirect to home
        if (res.user) {
          setStatus("success");
          await setupNotifications(res.user);
          await axios.post("/api/notify", {
            title: "Welcome Back ‼️ Tiger 🐯 ",
            body: "Contribute more... earn more reputation & upgrade your badge",
            userId: res.user.$id,
          });
          setMessage("Login successful! Redirecting...");

          // Wait a moment to show success message
          setTimeout(() => {
            // Replace with your actual navigation
            router.push("/");
            console.log("Redirecting to home page...");
          }, 1500);
        }
      } catch (error) {
        // Step 4: Error - redirect to login
        console.error("OAuth callback error:", error);
        setStatus("error");
        setMessage("Authentication failed. Redirecting to login...");

        // Wait a moment to show error message
        setTimeout(() => {
          // Replace with your actual navigation
          router.push("/login");
          console.log("Redirecting to login page...");
        }, 2000);
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo or Brand */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-linear-to-br from-rose-500 to-rose-600 flex items-center justify-center text-white font-bold text-3xl">
            QU
          </div>
        </div>

        {/* Status Icon */}
        <div className="mb-6">
          {status === "loading" && (
            <Loader2 className="w-16 h-16 mx-auto text-rose-500 dark:text-rose-400 animate-spin" />
          )}
          {status === "success" && (
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 dark:text-green-400" />
          )}
          {status === "error" && (
            <XCircle className="w-16 h-16 mx-auto text-red-500 dark:text-red-400" />
          )}
        </div>

        {/* Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {status === "loading" && "Please wait..."}
          {status === "success" && "Success!"}
          {status === "error" && "Oops!"}
        </h2>

        <p className="text-gray-600 dark:text-gray-400 mb-8">{message}</p>

        {/* Loading Progress Dots */}
        {status === "loading" && (
          <div className="flex justify-center gap-2">
            <div
              className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400 animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400 animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 rounded-full bg-rose-500 dark:bg-rose-400 animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}

        {/* Error Recovery Button */}
        {status === "error" && (
          <button
            onClick={() => router.push("/login")}
            className="mt-6 px-6 py-3 rounded-lg bg-rose-600 dark:bg-rose-500 text-white font-semibold hover:bg-rose-700 dark:hover:bg-rose-600 transition-all"
          >
            Return to Login
          </button>
        )}
      </div>
    </div>
  );
}
