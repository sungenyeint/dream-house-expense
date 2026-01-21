import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.public.firebase.apiKey,
    authDomain: config.public.firebase.authDomain,
    projectId: config.public.firebase.projectId,
    storageBucket: config.public.firebase.storageBucket,
    messagingSenderId: config.public.firebase.messagingSenderId,
    appId: config.public.firebase.appId,
    measurementId: config.public.firebase.measurementId,
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  //   // Offline persistence
  //   enableIndexedDbPersistence(db).catch((err) => {
  //     console.log('Persistence failed:', err.code)
  //   })

  return {
    provide: {
      db, // Now available as $db in your components
    },
  };
});
