"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, use } from "react";
import { account } from "@/src/models/client/config";

export default function VerifyPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const searchParams = useSearchParams();

  const secret = searchParams.get("secret");
  const userId = searchParams.get("userId");

  useEffect(() => {
    setIsLoading(true);
    if (!userId || !secret) {
        setError("Unable to find the credentials!");
        return;
    }
    setError("");
    const res = account.updateVerification({
      userId,
      secret,
    });
    res.then(
      (res: any) => {
        console.log(res);
        setIsLoading(false);
        setIsVerified(true);
      },
      (err: any) => {
        setIsLoading(false)
        setError(err);
      }
    );
    if (isVerified) {
      router.push("/");
    }
  }, [router]);

  return (
    <div>
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
