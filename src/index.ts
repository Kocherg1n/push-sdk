import {initializeApp, FirebaseOptions} from 'firebase/app'
// import {onBackgroundMessage} from 'firebase/messaging/sw'
import {isSupported, getMessaging, getToken, onMessage} from 'firebase/messaging'
import './main.css'

type ServiceWorkerGlobalScope = any

declare let self: ServiceWorkerGlobalScope

const cfg: FirebaseOptions = {
  apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
  authDomain: "rb-web-push-20427.firebaseapp.com",
  projectId: "rb-web-push-20427",
  storageBucket: "rb-web-push-20427.appspot.com",
  messagingSenderId: "696340818215",
  appId: "1:696340818215:web:223cc352b22ce50df8a102"
} as any

(async () => {
  const app = initializeApp(cfg)
  const sw = await window.navigator.serviceWorker.register('./sw.js')
  const messaging = getMessaging(app)
  const token = await getToken(messaging, {serviceWorkerRegistration: sw})
  console.log('token', token)

  onMessage(messaging, (payload) => {
    console.log('front message:', payload);
  });

  // onBackgroundMessage(messaging, (payload) => {
  //   console.log('background message:', payload);
  //   // Customize notification here
  //   const notificationTitle = 'Background Message Title';
  //   const notificationOptions = {
  //     body: 'Background Message body.',
  //     icon: '/firebase-logo.png'
  //   };
  //
  //   self.registration.showNotification(notificationTitle,
  //     notificationOptions);
  // });

})()
