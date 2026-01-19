"use client";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/Auth";
import { useEffect } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import { useTheme } from "next-themes";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { session } = useAuthStore();
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    <>
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
      <div className="relative">{children}</div>
    </>
  );
};

export default Layout;
