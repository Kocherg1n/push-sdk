importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js"),importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");const firebaseConfig={apiKey:"AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",authDomain:"rb-web-push-20427.firebaseapp.com",projectId:"rb-web-push-20427",storageBucket:"rb-web-push-20427.appspot.com",messagingSenderId:"696340818215",appId:"1:696340818215:web:223cc352b22ce50df8a102"};firebase.initializeApp(firebaseConfig);const messaging=firebase.messaging();messaging.onBackgroundMessage((function(e){console.log("Received background message ",e);const s=e.data.title,a={body:e.data.body};self.registration.showNotification(s,a)}));