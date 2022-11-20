import { initializeApp, FirebaseOptions } from 'firebase/app'
import { isSupported, getMessaging, getToken } from 'firebase/messaging'

import './main.css'

(async () => {
  const sw = await window.navigator.serviceWorker.register('./service-worker.js')

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

  const token = await getToken(messaging, {
    serviceWorkerRegistration: sw
  })

  console.log('token', token)

})()
