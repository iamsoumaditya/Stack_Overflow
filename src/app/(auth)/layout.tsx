"use client"
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/src/store/Auth";
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
      <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
        <BackgroundBeams />
        <div className="relative">{children}</div>
      </div>
    );
};

export default Layout;
