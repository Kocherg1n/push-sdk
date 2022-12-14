import {initializeApp} from 'firebase/app'
import {onBackgroundMessage, getMessaging} from 'firebase/messaging/sw'

import {NotificationPayload, NotificationPayloadData, NotificationType} from "./push"

/** TODO: настроить типы для self, избавится от any */
// https://github.com/microsoft/TypeScript/issues/14877
// https://stackoverflow.com/questions/56356655/structuring-a-typescript-project-with-workers/56374158#56374158
// declare let self: ServiceWorkerGlobalScope
declare const self: any

self.addEventListener('message', (event: any) => {
    const firebaseConfig = JSON.parse(event.data)
    const firebaseApp = initializeApp(firebaseConfig)
    const firebaseMessaging = getMessaging(firebaseApp)

    onBackgroundMessage(firebaseMessaging, (payload: NotificationPayload) => {
        const {data, metadata}: NotificationPayloadData = JSON.parse(payload.data.jsonData as string)

        console.log('onBackgroundMessage:', payload)

        let url = ''
        let notificationTitle = ''
        let notificationBody = ''

        if (metadata.messageInfo.version === NotificationType.SIMPLE && 'clickAction' in data) {
            url = data.clickAction
            notificationTitle = data.title
            notificationBody = data.body
        }

        if (metadata.messageInfo.version === NotificationType.PROBE && 'text' in data) {
            const pushDataStr = JSON.stringify({...payload, data, metadata})

            console.log('1', {...payload, data, metadata})

            url = `send?pushData=${encodeURI(pushDataStr)}`
            notificationTitle = 'Служебно-отладочное уведомление'
            notificationBody = data.text
        }

        const notificationOptions = {
            body: notificationBody,
            data: {url}
        }

        console.log('notificationOptions:', notificationOptions)

        return self.registration.showNotification(
            notificationTitle,
            notificationOptions
        )
    })

    self.addEventListener('notificationclick', (event: any) => {
        event.notification.close()

        console.log('notificationclick event', event)

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
