const env = {
  appwrite: {
    endpoint: String(process.env.NEXT_PUBLIC_APPWRITE_HOST_URL),
    projectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
    projectName: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_NAME),
    apikey: String(process.env.APPWRITE_API_KEY),
  },
  domain: String(process.env.NEXT_PUBLIC_PROJECT_DOMAIN),
  firebase: {
    apikey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    senderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    vapidkey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  },
};

export default env