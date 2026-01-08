"use client"
import { useRouter } from "next/router";
import { useAuthStore } from "../../store/Auth";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);
    
  if (session) {
    return null;
    }
    
    return (
        <div>
            <div>{children}</div>
        </div>
    )
};

export default Layout;
