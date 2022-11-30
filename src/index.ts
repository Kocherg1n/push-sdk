import Push from './push'

import './main.css'

type ServiceWorkerGlobalScope = any

declare let self: ServiceWorkerGlobalScope
declare const window: any

if (!window.RamblerPush) {
  window.RamblerPush = new Push()
}
