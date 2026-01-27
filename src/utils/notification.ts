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

  await account.updatePrefs({
    fcmToken: token,
    isRegisteredForNotification: true,
  });
}

export async function setupNotifications(user:Models.User<userPrefs>) {
  try {
    const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const messagingFirebase = await getFirebaseMessaging();
        if (!messagingFirebase) return;
      const token = await getToken(messagingFirebase, {
        vapidKey: env.firebase.vapidkey!,
      });
      if (token && !user?.prefs.isRegisteredForNotification) {
        await registerDevice(token);
        console.log("Device registered with Appwrite for Notification!");
      } else if(token && user?.prefs.fcmToken !== token) {
          account.updatePushTarget({
            targetId: ID.unique(),
            identifier: token,
          });

          await account.updatePrefs({
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
