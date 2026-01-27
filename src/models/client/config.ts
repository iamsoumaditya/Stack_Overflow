import env from "@/src/app/env"
import { Client, Account, Avatars, Databases, Storage } from "appwrite";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: env.firebase.apikey!,
  authDomain: env.firebase.authDomain!,
  projectId: env.firebase.projectId!,
  messagingSenderId: env.firebase.senderId!,
  appId: env.firebase.appId!,
};

const firebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export async function getFirebaseMessaging() {
  if (typeof window === "undefined") return null;

  const supported = await isSupported();
  if (!supported) return null;

  return getMessaging(firebaseApp);
}
const client = new Client();

client
  .setEndpoint(env.appwrite.endpoint)
  .setProject(env.appwrite.projectId);

const databases = new Databases(client)
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);

export { client, databases, account, avatars,storage,getToken }