// components/LoginButton.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut,
} from "firebase/auth";
import { app } from "@/lib/firebase";

export default function LoginButton() {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const auth = getAuth(app); // MISMA instancia

  const login = async () => {
    if (busy) return;
    setBusy(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      await signInWithPopup(auth, provider);
      // onAuthStateChanged (AuthProvider) cambiará la UI
    } catch (e: any) {
      if (
        e?.code === "auth/popup-blocked" ||
        e?.code === "auth/popup-closed-by-user" ||
        e?.code === "auth/cancelled-popup-request" ||
        e?.code === "auth/operation-not-supported-in-this-environment"
      ) {
        await signInWithRedirect(auth, provider);
      } else {
        console.warn("Login error", e);
        alert("No se pudo iniciar sesión.");
      }
    } finally {
      setBusy(false);
    }
  };

  const logout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut(auth);
    } finally {
      setBusy(false);
    }
  };

  if (user) {
    return (
      <Button variant="secondary" onClick={logout} disabled={busy}>
        Cerrar sesión
      </Button>
    );
  }
  return (
    <Button onClick={login} disabled={busy}>
      {busy ? "Conectando…" : "Iniciar sesión con Google"}
    </Button>
  );
}

