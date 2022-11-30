import Push from './push'

import './main.css'

declare const window: any

document.addEventListener('DOMContentLoaded', () => {
  if (!window.RamblerPush) {
    window.RamblerPush = new Push()

    window.RamblerPush.init({
      firebaseConfig: {
        apiKey: "AIzaSyDz56mB2jaGsNq9mPM3tL6Y0yIhwQu7LkQ",
        authDomain: "test-push-service-d2113.firebaseapp.com",
        projectId: "test-push-service-d2113",
        storageBucket: "test-push-service-d2113.appspot.com",
        messagingSenderId: "212207302903",
        appId: "1:212207302903:web:b7e41e4ab679a9be6b3bf2",
      },
      subscribeParams: {
        projectUuid: "project::60d4e4e5-7670-4af0-9a93-32d3565672ab",
        campaignUuid: "campaign::90d540c0-cb8c-4af0-a95f-2fe465b7047b",
      }})
  }
})
