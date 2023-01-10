import EventEmitter from 'events'

import {
  type FirebaseApp,
  type FirebaseOptions,
  initializeApp
} from 'firebase/app'
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
  type Messaging
} from 'firebase/messaging'

EventEmitter.defaultMaxListeners = Infinity

interface InitOptions {
  firebaseConfig: FirebaseOptions
}

export class Push extends EventEmitter {
  private firebaseApp: FirebaseApp | undefined
  private firebaseMessaging: Messaging | undefined
  private firebaseMessagingToken: string | undefined

  private serviceWorkerRegistration: ServiceWorkerRegistration | undefined

  constructor() {
    super()
  }

  public push(callback: () => void): void {
    callback()
  }

  public async initialize(options: InitOptions): Promise<void> {
    const hasFirebaseMessagingSupport = await isSupported()
    const hasServiceWorkerSupport = 'serviceWorker' in window.navigator
    const hasGrantedPermission =
      (await Notification.requestPermission()) === 'granted'

    if (!hasFirebaseMessagingSupport) {
      console.log('firebase messaging is not supported')

      return
    }

    if (!hasServiceWorkerSupport) {
      console.log('service workers are not supported')

      return
    }

    if (!hasGrantedPermission) {
      console.log('notifications permission is not granted')

      return
    }

    try {
      await this.initFirebaseApp(options.firebaseConfig)
      await this.registerServiceWorker(options.firebaseConfig)
      await this.getFirebaseMessagingToken()
      this.handleMessage()
    } catch (error: any) {
      console.log(error.message)
    }
  }

  private async initFirebaseApp(
    firebaseConfig: FirebaseOptions
  ): Promise<void> {
    try {
      this.firebaseApp = initializeApp(firebaseConfig)
    } catch {
      throw new Error('error with firebase app initialize')
    }

    try {
      this.firebaseMessaging = getMessaging(this.firebaseApp)
    } catch {
      throw new Error('error with firebase messaging initialize')
    }
  }

  private async registerServiceWorker(
    firebaseConfig: FirebaseOptions
  ): Promise<void> {
    try {
      this.serviceWorkerRegistration =
        await window.navigator.serviceWorker.register('./firebase-messaging-sw.js')
    } catch {
      throw new Error('error with service-worker register')
    }

    try {
      this.serviceWorkerRegistration?.active?.postMessage(
        JSON.stringify(firebaseConfig)
      )
    } catch {
      throw new Error('error with sending service worker config')
    }
  }

  private async getFirebaseMessagingToken(): Promise<void> {
    if (this.firebaseMessaging) {
      try {
        this.firebaseMessagingToken = await getToken(this.firebaseMessaging, {
          serviceWorkerRegistration: this.serviceWorkerRegistration
        })
        console.log(this.firebaseMessagingToken)
      } catch (error) {
        throw new Error('error with getting firebase messaging token')
      }
    }
  }

  private handleMessage(): void {
    if (this.firebaseMessaging) {
      try {
        onMessage(this.firebaseMessaging, (payload) => {
          console.log('onMessage', payload)

          const title = payload.data?.title ?? ''
          const notificationOptions = {
            body: payload.data?.body,
            data: {url: payload.data?.clickAction}
          }

          if (this.serviceWorkerRegistration)
            this.serviceWorkerRegistration.showNotification(
              title,
              notificationOptions
            )
        })
      } catch (error) {
        throw new Error('error with firebase onMessage listener')
      }
    }
  }
}
