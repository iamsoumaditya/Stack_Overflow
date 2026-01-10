"use client";
import React from "react";
import { FloatingNav } from "@/src/components/ui/floating-navbar";
import { IconHome,IconInfoCircle, IconWorldQuestion } from "@tabler/icons-react";

export default function Header() {

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconInfoCircle className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Questions",
      link: "/questions",
      icon: (
        <IconWorldQuestion className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];


  return (
    <div className="relative w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}
