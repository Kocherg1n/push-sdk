import Push from './push'

import './main.css'

declare const window: any

document.addEventListener('DOMContentLoaded', () => {
  if (!window.RamblerPush) {
    window.RamblerPush = new Push()
  }
})
