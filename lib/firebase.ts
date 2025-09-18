// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth"

// ⚡ Configuración con variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

// ✅ Inicializar Firebase App (una sola vez)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

// ✅ Firestore funciona tanto en server como en client
export const db = getFirestore(app)

// ⚠️ Auth y Google Provider solo deben inicializarse en el navegador
export let auth: ReturnType<typeof getAuth> | null = null
export let googleProvider: GoogleAuthProvider | null = null

if (typeof window !== "undefined") {
  auth = getAuth(app)
  googleProvider = new GoogleAuthProvider()
  googleProvider.setCustomParameters({ prompt: "select_account" })

  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Silenciar errores de persistencia en navegadores que bloquean localStorage
  })
}
