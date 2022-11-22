type ServiceWorkerGlobalScope = any

declare let self: ServiceWorkerGlobalScope

import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

const app = initializeApp({
  apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
  // authDomain: "rb-web-push-20427.firebaseapp.com",
  projectId: "rb-web-push-20427",
  // storageBucket: "rb-web-push-20427.appspot.com",
  messagingSenderId: "696340818215",
  appId: "1:696340818215:web:223cc352b22ce50df8a102"
})

const messaging = getMessaging(app)

onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
