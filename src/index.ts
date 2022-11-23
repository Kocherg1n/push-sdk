import {initializeApp, FirebaseOptions} from 'firebase/app'
import {getMessaging, getToken, deleteToken, onMessage, isSupported, Messaging} from 'firebase/messaging'

import './main.css'

type ServiceWorkerGlobalScope = any

declare let self: ServiceWorkerGlobalScope

const getTokenBtn = document.querySelector('#get_token')
const removeTokenBtn = document.querySelector('#remove_token')
const tokenDisplay = document.querySelector('#token_display')

const cfg: FirebaseOptions = {
  apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
  // authDomain: "rb-web-push-20427.firebaseapp.com",
  projectId: "rb-web-push-20427",
  // storageBucket: "rb-web-push-20427.appspot.com",
  messagingSenderId: "696340818215",
  appId: "1:696340818215:web:223cc352b22ce50df8a102"
} as any

const app = initializeApp(cfg)

const requestPermission = async (): Promise<NotificationPermission> => {
  return await Notification.requestPermission()
}

const renderToken = (token: string) => {
  tokenDisplay.textContent = token
}

const getNewToken = async (messaging: Messaging): Promise<void> => {
  const sw = await window.navigator.serviceWorker.register('./firebase-messaging-sw.js')
  const token = await getToken(messaging, {serviceWorkerRegistration: sw})
  console.log('token', token)
  renderToken(token)
}

const removeToken = async (messaging: Messaging): Promise<void> => {
  await deleteToken(messaging)
  renderToken('')
}

(async () => {
  const apiPushExist = await isSupported()
  const permission = await requestPermission()

  if (apiPushExist && permission === 'granted') {
    const messaging = getMessaging(app)

    getTokenBtn.addEventListener('click', () => getNewToken(messaging))
    removeTokenBtn.addEventListener('click', () => removeToken(messaging))

    await getNewToken(messaging)

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // ...
    });
  } else {
    if (!apiPushExist) {
      console.log('API Push not available')
    }

    if (permission !== 'granted') {
      console.log('permission denied')
    }
  }
})()
