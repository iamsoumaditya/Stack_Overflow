"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function ThemeColorUpdater() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const meta = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement | null;

    if (!meta) return;

    meta.content = resolvedTheme === "dark" ? "#020617" : "#ffffff";
  }, [resolvedTheme]);

  return null;
}
