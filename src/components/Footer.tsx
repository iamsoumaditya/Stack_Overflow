"use client";

import Link from "next/link";
import { FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useAuthStore } from "@/src/store/Auth";
import slugify from "@/src/utils/slugify";
import { Separator } from "@/src/components/ui/separator";

const Footer = () => {
  const { user } = useAuthStore();
  return (
    <footer>
      <div className="mx-auto flex max-w-full items-center justify-between gap-3 px-4 py-4 max-md:flex-col sm:px-6 sm:py-6 md:gap-6 md:py-8">
        <div className="flex items-center gap-5 whitespace-nowrap">
          <Link
            href="/"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            About
          </Link>
          <Link
            href="/questions"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            Questions
          </Link>
          {user && (
            <Link
              href={`/users/${user.$id}/${slugify(user.name)}`}
              className="opacity-80 transition-opacity duration-300 hover:opacity-100"
            >
              Profile
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/iamsoumaditya/Stack_Overflow"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            <FaGithub className="size-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/soumaditya-roy/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            <FaLinkedin className="size-5" />
          </a>
          <a
            href="https://x.com/iamsoumaditya"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            <FaXTwitter className="size-5" />
          </a>
          <a
            href="https://www.instagram.com/iamsoumaditya/"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-80 transition-opacity duration-300 hover:opacity-100"
          >
            <FaInstagram className="size-5" />
          </a>
        </div>
      </div>

      <Separator />

      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8 sm:px-6">
        <p className="text-center font-medium text-balance">
          ©{new Date().getFullYear()}{" "}
          <Link href="/" className="hover:underline">
            Queue Undeflow
          </Link>
          , Made with ❤️ by{" "}
          <Link
            href="/users/69614cb0000633004e48/soumaditya-roy"
            className="hover:underline"
          >
            Soumaditya Roy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
