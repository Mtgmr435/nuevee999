// components/AuthProvider.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  inMemoryPersistence,
  User,
} from "firebase/auth";
import { app } from "@/lib/firebase";

type AuthCtx = { user: User | null; loading: boolean; error?: string | null };
const Ctx = createContext<AuthCtx>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app); // MISMA instancia

  useEffect(() => {
    let unsub = () => { };
    (async () => {
      try {
        // Persistencia con fallback (Safari / WebViews)
        try {
          await setPersistence(auth, browserLocalPersistence);
        } catch {
          try {
            await setPersistence(auth, browserSessionPersistence);
          } catch {
            await setPersistence(auth, inMemoryPersistence);
          }
        }

        // Por si vienes de signInWithRedirect
        try {
          await getRedirectResult(auth);
        } catch { }

        unsub = onAuthStateChanged(auth, (fbUser) => {
          setUser(fbUser);
          setLoading(false);
        });
      } catch (e) {
        console.warn("AuthProvider init error", e);
        setLoading(false);
      }
    })();

    return () => {
      try {
        unsub && unsub();
      } catch { }
    };
  }, [auth]);

  const value = useMemo(() => ({ user, loading, error: null }), [user, loading]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
