importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAAgXH1CCM8SdRQoFzCKFKp7upWqWFbeJI",
  authDomain: "queue-underflow-fee0c.firebaseapp.com",
  projectId: "queue-underflow-fee0c",
  messagingSenderId: "285344161568",
  appId: "1:285344161568:web:83af13c077ad866c4d4145",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("Background message ", payload);

  self.addEventListener("push", (event) => {
    const payload = event.data.json();

    event.waitUntil(
      self.registration.showNotification(payload.notification.title, {
        body: payload.notification.body,
        icon: "/favicon.ico",
      }),
    );
  });

  self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
  });
});
