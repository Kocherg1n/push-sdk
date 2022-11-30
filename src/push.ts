import EventEmitter from 'events'
import {FirebaseOptions, initializeApp} from 'firebase/app'
import {getMessaging, getToken, onMessage, isSupported} from 'firebase/messaging'

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

interface Subscribe {
  success: boolean
  internalRequestId: string
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

        this._serviceWorker = sw
        this._token = token

        await this._subscribe(options.subscribeParams)

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
        });

      } catch {
        console.log('Something went wrong when initializing the application')
      }
    } else {
      !apiPushExist
        ? console.log('Push API not supported')
        : console.log('Notification permission is: ', permission)
    }
  }

  private async _subscribe(subscribeParams: SubscribeParams): Promise<void> {
    try {
        console.log(`You are subscribed to the campaign: ${subscribeParams.params.campaignUuid}`)
    } catch (e) {
      console.log('Something went wrong when subscribing:', e)
    }
  }

  public init(options: InitOptions): void {
    this.emit(Events.INIT, options)
  }
}
