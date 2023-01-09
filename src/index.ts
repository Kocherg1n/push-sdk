import { Push } from './push'

import './main.css'

declare const window: any

document.addEventListener('DOMContentLoaded', () => {
  if (!window.RamblerPush) {
    window.RamblerPush = new Push()

    window.RamblerPush.initialize({
      // firebaseConfig: {
      //     apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
      //     authDomain: "rb-web-push-20427.firebaseapp.com",
      //     projectId: "rb-web-push-20427",
      //     storageBucket: "rb-web-push-20427.appspot.com",
      //     messagingSenderId: "696340818215",
      //     appId: "1:696340818215:web:223cc352b22ce50df8a102"
      // }
      firebaseConfig: {
        apiKey: 'AIzaSyDz56mB2jaGsNq9mPM3tL6Y0yIhwQu7LkQ',
        authDomain: 'test-push-service-d2113.firebaseapp.com',
        projectId: 'test-push-service-d2113',
        storageBucket: 'test-push-service-d2113.appspot.com',
        messagingSenderId: '212207302903',
        appId: '1:212207302903:web:b7e41e4ab679a9be6b3bf2',
      }
    })
  }
})
