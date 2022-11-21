import { initializeApp } from 'firebase/app'
import { isSupported, getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

type ServiceWorkerGlobalScope = any

declare let self: ServiceWorkerGlobalScope

const app = initializeApp({
  apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
  // authDomain: "rb-web-push-20427.firebaseapp.com",
  projectId: "rb-web-push-20427",
  // storageBucket: "rb-web-push-20427.appspot.com",
  messagingSenderId: "696340818215",
  appId: "1:696340818215:web:223cc352b22ce50df8a102"
})

isSupported()
  .then(() => {
    const messaging = getMessaging(app)

    console.log('sw:', messaging)

    onBackgroundMessage(messaging, ({ notification }) => {
      const { title, body, image } = notification ?? {}

      console.log('notification', notification)

      if (!title) {
        return
      }

      self.registration.showNotification(title, {
        body,
        icon: image
      })
    })
  })
  .catch(err => {
    console.log('error:', err)
  })
