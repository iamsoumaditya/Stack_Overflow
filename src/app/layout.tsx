import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatedThemeToggler } from "@/src/components/magicui/animated-theme-toggler";
import { BackgroundBeams } from "@/src/components/ui/background-beams";
import Footer from "@/src/components/Footer";
import { ThemeProvider } from "next-themes";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Queue Underflow",
  description: "Built by Soumaditya Roy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <div className="fixed inset-0 -z-10">
              <BackgroundBeams />
            </div>
            <div className="fixed right-4 top-4 z-50">
              <AnimatedThemeToggler />
            </div>
            <div className="flex min-h-screen flex-col items-center justify-center py-12">
              {children}
            </div>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
