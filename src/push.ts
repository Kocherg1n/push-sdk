import EventEmitter from 'events'
import {FirebaseOptions, initializeApp} from 'firebase/app'
import {getMessaging, getToken, onMessage, isSupported, Messaging} from 'firebase/messaging'

EventEmitter.defaultMaxListeners = Infinity

enum Events {
  INIT = 'init',
}

interface SubscribeParams {
  params: {
    projectUuid: string
    campaignUuid: string
  }
}

interface InitOptions {
  firebaseConfig: FirebaseOptions
  subscribeParams: SubscribeParams
}

export default class Push extends EventEmitter {
  _token: string | undefined
  _serviceWorker: ServiceWorkerRegistration | undefined

  constructor() {
    super()

    this.on(Events.INIT, this._init)
  }

  private async _init(options: InitOptions): Promise<void> {
    const apiPushExist = await isSupported()
    const permission = await Notification.requestPermission()

    if (apiPushExist && permission === 'granted') {
      try {
        const app = initializeApp(options.firebaseConfig)
        const messaging = getMessaging(app)

        const sw = await window.navigator.serviceWorker.register('./firebase-messaging-sw.js')
        const token = await getToken(messaging, {serviceWorkerRegistration: sw})

        console.log('token', token)

        this._serviceWorker = sw
        this._token = token

        self.addEventListener('notificationclick', (event) => {

          console.log('notificationclick 1', event)

          // event.notification.close()
          //
          // if (!event.notification.data.pathname) return
          // const pathname = event.notification.data.pathname
          // const url = new URL(pathname, self.location.origin).href
          //
          // event.waitUntil(
          //   self.clients
          //     .matchAll({ type: 'window', includeUncontrolled: true })
          //     .then((clientsArr) => {
          //       const hadWindowToFocus = clientsArr.some((windowClient) =>
          //         windowClient.url === url ? (windowClient.focus(), true) : false
          //       )
          //
          //       if (!hadWindowToFocus)
          //         self.clients
          //           .openWindow(url)
          //           .then((windowClient) =>
          //             windowClient ? windowClient.focus() : null
          //           )
          //     })
          // )
        })

        await this._subscribe(messaging, options.subscribeParams)
      } catch {
        console.log('Something went wrong when initializing the application')
      }
    } else {
      !apiPushExist
        ? console.log('Push API not supported')
        : console.log('Notification permission is: ', permission)
    }
  }

  private async _subscribe(messaging: Messaging, subscribeParams: SubscribeParams): Promise<void> {
    onMessage(messaging, (payload) => {
      console.log('Message received', payload)

      const title = payload.notification?.title ?? ''
      const notificationOptions = {
        body: payload.notification?.body,
        data: {url: payload.fcmOptions?.link}
      };

      if (this._serviceWorker) {
        this._serviceWorker.showNotification(title, notificationOptions)
      }

      console.log('subscribeParams', subscribeParams)

    });
  }

  public init(options: InitOptions): void {
    this.emit(Events.INIT, options)
  }
}
