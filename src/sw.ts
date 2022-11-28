import {initializeApp} from 'firebase/app'
import {onBackgroundMessage, getMessaging, MessagePayload} from 'firebase/messaging/sw'

type ServiceWorkerGlobalScope = any
declare let self: ServiceWorkerGlobalScope

const app = initializeApp({
  apiKey: "AIzaSyDz56mB2jaGsNq9mPM3tL6Y0yIhwQu7LkQ",
  authDomain: "test-push-service-d2113.firebaseapp.com",
  projectId: "test-push-service-d2113",
  storageBucket: "test-push-service-d2113.appspot.com",
  messagingSenderId: "212207302903",
  appId: "1:212207302903:web:b7e41e4ab679a9be6b3bf2",
})

const messaging = getMessaging(app)

onBackgroundMessage(messaging, (payload: MessagePayload) => {
  console.log('Background message received', payload);

  const notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    data: { url:payload.data.click_action },
    actions: [{action: "open_url", title: "Read Now"}]
  };

  return self.registration.showNotification(payload.data.title, notificationOptions);
});
