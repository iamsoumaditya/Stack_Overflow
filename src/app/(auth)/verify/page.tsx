"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import { account } from "@/src/models/client/config";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/src/store/Auth";

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ secret: string; userId: string }>;
}) {
  const { resolvedTheme } = useTheme();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const params = use(searchParams);

  useEffect(() => {
    setIsLoading(true);
    if (!params.userId || !params.secret) {
      setError("Unable to find the credentials!");
      return;
    }
    setError("");
    const res = account.updateVerification({
      userId: params.userId,
      secret: params.secret,
    });
    useAuthStore.setState((prev) => ({
      user: { ...prev.user, emailVerification: true },
    }));
    res.then(
      (res: any) => {
        toast.success("Verified successfully!!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: resolvedTheme === "dark" ? "dark" : "light",
          transition: Bounce,
        });
        setIsLoading(false);
        setIsVerified(true);
      },
      (err: any) => {
        toast.error(err.message || "Verification failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: resolvedTheme === "dark" ? "dark" : "light",
          transition: Bounce,
        });
        setIsLoading(false);
        setError(err);
      },
    );
    if (isVerified) {
      router.push("/");
    }
  }, [router]);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={resolvedTheme}
        transition={Bounce}
      />
      <p className="mt-8 text-center text-2xl text-cyan-300 dark:text-cyan-400">
        Email Verification Page
      </p>
      {error && (
        <p className="mt-8 text-center text-lg text-red-500 dark:text-red-400">
          {error}
        </p>
      )}
      {isVerified && (
        <p className="mt-8 text-center text-sm text-green-500 dark:text-green-400">
          Your Email is Succesfully Verified
        </p>
      )}
    </div>
  );
}
