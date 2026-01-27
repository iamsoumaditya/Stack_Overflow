import {
  account,
  getToken,
  getFirebaseMessaging,
} from "@/src/models/client/config";
import { ID, Models } from "appwrite";
import { userPrefs } from "../store/Auth";
import env from "../app/env";

async function registerDevice(token: string) {
  await account.createPushTarget({
    targetId: ID.unique(),
    identifier: token,
  });
  const user = await account.get<userPrefs>();
  await account.updatePrefs({
    ...user.prefs,
    fcmToken: token,
    isRegisteredForNotification: true,
  });
}

export async function setupNotifications(user: Models.User<userPrefs>) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      if (!("serviceWorker" in navigator)) return;
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
      );
      console.log("Service Worker registered", registration);

      const readyRegistration = await navigator.serviceWorker.ready;
      console.log("SW active:", readyRegistration);

      const messagingFirebase = await getFirebaseMessaging();
      if (!messagingFirebase) return;

      const token = await getToken(messagingFirebase, {
        vapidKey: env.firebase.vapidkey!,
        serviceWorkerRegistration: readyRegistration,
      });

      console.log("FCM token: ", token);
      if (token && !user.prefs?.isRegisteredForNotification) {
        await registerDevice(token);
        console.log("Device registered with Appwrite for Notification!");
      } else if (token && user.prefs?.fcmToken !== token) {
        await account.updatePushTarget({
          targetId: ID.unique(), /// this is mistake you should store targetId and update using that not ID.unique()
          identifier: token,
        });
        const user = await account.get<userPrefs>();
        await account.updatePrefs({
          ...user.prefs,
          fcmToken: token,
          isRegisteredForNotification: true,
        });
        console.log("Device updated with Appwrite for Notification!");
      }
    }
  } catch (err) {
    console.error("Notification setup failed:", err);
  }
}
