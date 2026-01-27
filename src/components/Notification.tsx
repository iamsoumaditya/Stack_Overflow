"use client";

import { useEffect } from "react";
import { onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/src/models/client/config";

export default function FCMListener() {
  useEffect(() => {
    async function listen() {
      const messaging = await getFirebaseMessaging();
      if (!messaging) return;
console.log("FCM listener attached");
      /* 🔵 FOREGROUND ONLY */
      onMessage(messaging, (payload) => {
        console.log("[FG]", payload);

        new Notification(payload.notification?.title || "New Notification", {
          body: payload.notification?.body || "",
          icon: "/favicon.ico",
        });
      });
    }

    listen();
  }, []);

  return null;
}
