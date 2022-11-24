import {initializeApp, FirebaseOptions} from 'firebase/app'
import {getMessaging, getToken, deleteToken, onMessage, isSupported, Messaging} from 'firebase/messaging'

import './main.css'

type ServiceWorkerGlobalScope = any

declare let self: ServiceWorkerGlobalScope

const getTokenBtn = document.querySelector('#get_token')
const removeTokenBtn = document.querySelector('#remove_token')
const tokenDisplay = document.querySelector('#token_display')

const cfg: FirebaseOptions = {
  // apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
  // authDomain: "rb-web-push-20427.firebaseapp.com",
  // projectId: "rb-web-push-20427",
  // storageBucket: "rb-web-push-20427.appspot.com",
  messagingSenderId: "696340818215",
  // appId: "1:696340818215:web:223cc352b22ce50df8a102"
} as any

const requestPermission = async (): Promise<NotificationPermission> => {
  return await Notification.requestPermission()
}

const renderToken = (token: string) => {
  tokenDisplay.textContent = token
}

const getNewToken = async (messaging: Messaging, sw: any): Promise<void> => {
  const token = await getToken(messaging, {vapidKey: 'BA-EeuWIdVFB0lJ4lAIxq1kxYdZZZE_hg9DZpzZzXXP-h6AxKnJbk5AfgXDj-LSWbkiliz33oIc6XQoXFKlVzNA'})
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
  const sw = await window.navigator.serviceWorker.register('./firebase-messaging-sw.js')

  if (apiPushExist && permission === 'granted') {
    const app = initializeApp(cfg)
    const messaging = getMessaging(app)

    getTokenBtn.addEventListener('click', () => getNewToken(messaging, sw))
    removeTokenBtn.addEventListener('click', () => removeToken(messaging))

    await getNewToken(messaging, sw)

    onMessage(messaging, (payload) => {
      console.log('Message received', payload);
      const {title, body} = payload.data

      sw.showNotification(title, {body})

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
