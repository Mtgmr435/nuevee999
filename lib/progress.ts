import { doc, setDoc, getDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "./firebase"

// 🔹 Guardar progreso del usuario
export async function saveProgress(userId: string, progress: any) {
    try {
        await setDoc(doc(db, "progress", userId), progress, { merge: true })
        console.log("✅ Progreso guardado")
    } catch (error) {
        console.error("❌ Error al guardar progreso:", error)
    }
}

// 🔹 Leer progreso del usuario
export async function getProgress(userId: string) {
    try {
        const ref = doc(db, "progress", userId)
        const snap = await getDoc(ref)

        if (snap.exists()) {
            return snap.data()
        } else {
            return null // No tiene progreso aún
        }
    } catch (error) {
        console.error("❌ Error al leer progreso:", error)
    }
}

// 🔹 Actualizar y verificar racha del usuario
export async function updateStreak(userId: string, displayName?: string) {
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0] // YYYY-MM-DD

    const ref = doc(db, "progress", userId)
    const snap = await getDoc(ref)

    if (snap.exists()) {
        const data = snap.data()
        const lastLogin = data.lastLogin
        const streak = data.streak || 0

        if (lastLogin === todayStr) {
            // Ya entró hoy → no cambiar
            return { streak, lastLogin }
        }

        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        const yesterdayStr = yesterday.toISOString().split("T")[0]

        let newStreak = 1
        if (lastLogin === yesterdayStr) {
            newStreak = streak + 1 // siguió la racha
        }

        await setDoc(ref, {
            ...data,
            name: displayName || data.name || "Jugador Anónimo",
            streak: newStreak,
            lastLogin: todayStr,
        }, { merge: true })

        return { streak: newStreak, lastLogin: todayStr }
    } else {
        // Primera vez que entra
        await setDoc(ref, {
            name: displayName || "Jugador Anónimo",
            streak: 1,
            lastLogin: todayStr,
            level: 1,
            points: 0
        })
        return { streak: 1, lastLogin: todayStr }
    }
}

// 🔹 Obtener ranking de rachas (Leaderboard)
export async function getLeaderboard(top: number = 10) {
    try {
        const q = query(
            collection(db, "progress"),
            orderBy("streak", "desc"),
            limit(top)
        )

        const querySnapshot = await getDocs(q)
        const leaderboard: any[] = []

        querySnapshot.forEach((doc) => {
            leaderboard.push({
                id: doc.id,
                ...doc.data()
            })
        })

        return leaderboard
    } catch (error) {
        console.error("❌ Error al cargar leaderboard:", error)
        return []
    }
}
