import { defineNuxtPlugin } from '#app'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: "AIzaSyA_-EedPYtRTnZiQoj67WzwLd6QKbZQaJM",
    authDomain: "buddhism-23f8c.firebaseapp.com",
    projectId: "buddhism-23f8c",
    storageBucket: "buddhism-23f8c.firebasestorage.app",
    messagingSenderId: "692586976272",
    appId: "1:692586976272:web:a3b5a6e9dd4e78d4cb6695",
    measurementId: "G-E2ZRPWE5JX",
  };

  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)

//   // Offline persistence
//   enableIndexedDbPersistence(db).catch((err) => {
//     console.log('Persistence failed:', err.code)
//   })

  return {
    provide: {
      db  // Now available as $db in your components
    }
  }
})

