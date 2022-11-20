import {initializeApp} from 'firebase/app'
import {onBackgroundMessage} from 'firebase/messaging/sw'
import {isSupported, getMessaging, getToken, onMessage} from 'firebase/messaging'

type ServiceWorkerGlobalScope = any

declare let self: ServiceWorkerGlobalScope

import './main.css'

(async () => {
  try {
    const sw = await window.navigator.serviceWorker.register('./sw.js')
    console.log('Registration successful, scope is:', sw.scope);
  } catch (e) {
    console.error('Service worker registration failed:', e)
  }

  const supported = await isSupported().catch(() => false)

  if (!supported) return

  const app = initializeApp({
    apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
    authDomain: "rb-web-push-20427.firebaseapp.com",
    projectId: "rb-web-push-20427",
    storageBucket: "rb-web-push-20427.appspot.com",
    messagingSenderId: "696340818215",
    appId: "1:696340818215:web:223cc352b22ce50df8a102"
  })

  const messaging = getMessaging(app)

  try {
    const token = await getToken(messaging, {
      vapidKey: 'BMdVLXCtTG3jiuuwlPOiTgmItdpGOzAngJphN-M7oCPJzaqK2pxbzl7-0Ry3vRjFuRc2iAKc3E3PF5SlZfiiuHY'
    })
    console.log('token', token)
  } catch (e) {
    console.log('get token error:', e)
  }

  onMessage(messaging, (payload) => {
    console.log('front message:', payload);
  });

  onBackgroundMessage(messaging, (payload) => {
    console.log('background message:', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

})()
