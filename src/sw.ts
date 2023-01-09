import {initializeApp} from 'firebase/app'
import {
  onBackgroundMessage,
  getMessaging,
  MessagePayload
} from 'firebase/messaging/sw'

/** TODO: настроить типы для self, избавится от any */
// https://github.com/microsoft/TypeScript/issues/14877
// https://stackoverflow.com/questions/56356655/structuring-a-typescript-project-with-workers/56374158#56374158
// declare let self: ServiceWorkerGlobalScope
declare const self: any

self.addEventListener('message', (event: any) => {
  const firebaseConfig = JSON.parse(event.data)
  const firebaseApp = initializeApp(firebaseConfig)
  const firebaseMessaging = getMessaging(firebaseApp)

  // onBackgroundMessage(firebaseMessaging, (payload: MessagePayload) => {
  //   console.log('onBackgroundMessage:', payload)
  //
  //   const notificationTitle = payload.notification?.title ?? ''
  //   const notificationOptions = {
  //     body: payload.notification?.body,
  //     data: {url: payload.fcmOptions?.link}
  //   }
  //
  //   return self.registration.showNotification(notificationTitle, notificationOptions)
  // })

  self.addEventListener('notificationclick', (event: any) => {
    event.notification.close()

    if (!event.notification.data.url) return
    const url = event.notification.data.url

    // если url текущего окна не равен url из notification то окрываем новую вкладку
    event.waitUntil(
      self.clients
        .matchAll({type: 'window', includeUncontrolled: true})
        .then((clientsArr: any) => {
          const hadWindowToFocus = clientsArr.some((windowClient: any) =>
            windowClient.url === url ? (windowClient.focus(), true) : false
          )

          if (!hadWindowToFocus)
            self.clients
              .openWindow(url)
              .then((windowClient: any) =>
                windowClient ? windowClient.focus() : null
              )
        })
    )
  })
})
