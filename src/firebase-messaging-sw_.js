importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyBAcp1sqaS-fjIJP_9Ar5lxa1etqllwzUk",
    authDomain: "rb-web-push-20427.firebaseapp.com",
    projectId: "rb-web-push-20427",
    storageBucket: "rb-web-push-20427.appspot.com",
    messagingSenderId: "696340818215",
    appId: "1:696340818215:web:223cc352b22ce50df8a102"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle incoming messages while the app is not in focus (i.e in the background, hidden behind other tabs, or completely closed).
messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.data.title;
    const notificationOptions = {
        body: payload.data.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
