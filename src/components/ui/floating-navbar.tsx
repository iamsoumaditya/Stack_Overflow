"use client";
import React, { useState, JSX } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/src/lib/utils";
import Link from "next/link";
import { useAuthStore } from "@/src/store/Auth";
import slugify from "@/src/utils/slugify";
import { LogIn, LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";
import { useTheme } from "next-themes";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
  }) => {
  const {resolvedTheme}=useTheme()
  const { session, logout,user } = useAuthStore();
  const router = useRouter();
  const { scrollYProgress } = useScroll();

  const [visible, setVisible] = useState(true);

 useMotionValueEvent(scrollYProgress, "change", (current) => {
   if (typeof current === "number") {
     let direction = current - scrollYProgress.getPrevious()!;

     if (scrollYProgress.get() < 0.05) {
       setVisible(true); 
     } else {
       if (direction < 0) {
         setVisible(true); 
       } else {
         setVisible(false);
       }
     }
   }
 });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit  fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/20 rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-5000 pr-2 pl-8 py-2  items-center justify-center space-x-4",
          className,
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <a
            key={`link=${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500",
            )}
          >
            <span className="block sm:hidden">
              {React.cloneElement(navItem.icon, {
                className: "h-6 w-6 text-neutral-500 dark:text-white",
              })}
            </span>

            <span className="hidden sm:block text-sm">{navItem.name}</span>
          </a>
        ))}
        {!session && (
          <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/20 text-black dark:text-white px-4 py-2 rounded-full">
            <Link href="/login">
              <span className="block sm:hidden">{<LogIn />}</span>
              <span className="hidden sm:block text-sm">Login</span>
            </Link>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-blue-500 to-transparent  h-px" />
          </button>
        )}
        {session && user && (
          <button className="border text-sm font-medium relative border-neutral-200 dark:border-white/20 text-black dark:text-white px-4 py-2 rounded-full">
            <Link href={`/users/${user.$id}/${slugify(user.name)}`}>
              <span className="block sm:hidden">{<User />}</span>
              <span className="hidden sm:block text-sm">Profile</span>
            </Link>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-blue-500 to-transparent  h-px" />
          </button>
        )}
        {user && (
          <button
            onClick={() => {
              try {
                logout();
                router.push("/");
              } catch (error: any) {
                toast.error(error.message || "Logging out failed", {
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
              }
            }}
            className="border text-sm font-medium relative border-neutral-200 dark:border-white/20 text-black dark:text-white px-4 py-2 rounded-full"
          >
            <span className="block sm:hidden">{<LogOut />}</span>
            <span className="hidden sm:block text-sm">Logout</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-linear-to-r from-transparent via-blue-500 to-transparent  h-px" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
