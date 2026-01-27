"use client";

import { useEffect, useRef } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/src/models/client/config";
import { useTheme } from "next-themes";
import { Bounce, toast } from "react-toastify";

export default function FCMListener() {
  const isAttached = useRef(false);
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    if (isAttached.current) return;
    isAttached.current = true;

    let unsubscribe: (() => void) | undefined;

    async function listen() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;

      console.log("FCM foreground listener attached");

      unsubscribe = onMessage(messaging, (payload) => {
        console.log("[FCM FG PAYLOAD]", payload);

        // ✅ Permission check
        if (Notification.permission !== "granted") {
          console.warn("Notification permission not granted");
          return;
        }

        const title =
          payload.data?.title ||
          payload.notification?.title ||
          "New Notification";
        const body = payload.data?.body || payload.notification?.body || "";
        const icon =
          payload.data?.icon || payload.notification?.icon || "/favicon.ico";

        toast.info(`${title}: ${body}`, {
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
      });
    }

    listen();

    return () => {
      unsubscribe?.();
      isAttached.current = false;
    };
  }, []);

  return null;
}
