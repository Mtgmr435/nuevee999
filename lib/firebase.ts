// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import {
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth"

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// Evita re-crear la app en HMR
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// Auth + proveedor Google
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })

// Persistencia en el navegador
setPersistence(auth, browserLocalPersistence).catch(() => {
    // Silencia errores de persistencia (p.ej., privacidad del navegador)
})
