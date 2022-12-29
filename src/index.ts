import { Push } from './push'

import './main.css'

declare const window: any

document.addEventListener('DOMContentLoaded', () => {
  if (!window.RamblerPush) {
    window.RamblerPush = new Push()

    window.RamblerPush.initialize({
      firebaseConfig: {
          apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
          authDomain: "rb-web-push-20427.firebaseapp.com",
          projectId: "rb-web-push-20427",
          storageBucket: "rb-web-push-20427.appspot.com",
          messagingSenderId: "696340818215",
          appId: "1:696340818215:web:223cc352b22ce50df8a102"
      }
    })
  }
})
