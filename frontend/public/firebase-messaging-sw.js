importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');



firebase.initializeApp({
  apiKey: "AIzaSyBqbrS2ifx46gVzFwej1Nie_ZGfwd_ah4k",
  authDomain: "sportfithub-4355d.firebaseapp.com",
  projectId: "sportfithub-4355d",
  storageBucket: "sportfithub-4355d.firebasestorage.app",
  messagingSenderId: "862073823228",
  appId: "1:862073823228:web:753348ff6f8c32a85f9c79"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background message received:', payload)
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/sportfithub_logo.png',
  });
});