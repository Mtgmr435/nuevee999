"use client"
import { useEffect, useState } from "react"
import { useAuth } from "./AuthProvider"
import { getProgress, saveProgress, updateStreak, getLeaderboard } from "@/lib/progress"

export default function Dashboard() {
    const { user } = useAuth()
    const [progress, setProgress] = useState<any>(null)
    const [streak, setStreak] = useState<number | null>(null)
    const [leaders, setLeaders] = useState<any[]>([])

    // 🔹 Cargar progreso, racha y ranking
    useEffect(() => {
        if (user) {
            // Leer progreso guardado
            getProgress(user.uid).then((data) => {
                if (data) setProgress(data)
                else setProgress({ level: 1, points: 0 })
            })

            // Actualizar racha
            updateStreak(user.uid, user.displayName || "Jugador Anónimo").then((data) => {
                setStreak(data?.streak || 1)
            })
        }

        // Ranking visible para todos (incluso invitados)
        getLeaderboard(10).then((data) => {
            setLeaders(data)
        })
    }, [user])

    // 🔹 Actualizar progreso (sumar puntos)
    const handleUpdate = async () => {
        if (user && progress) {
            const newProgress = { ...progress, points: progress.points + 10 }
            setProgress(newProgress)
            await saveProgress(user.uid, newProgress)
        }
    }

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            {/* Si hay usuario logueado */}
            {user ? (
                <div>
                    <h1>Hola {user.displayName} 👋</h1>

                    <div style={{
                        marginTop: "15px",
                        padding: "15px",
                        border: "2px solid #eee",
                        borderRadius: "12px",
                        maxWidth: "320px"
                    }}>
                        <p>⭐ Nivel: {progress?.level}</p>
                        <p>🎯 Puntos: {progress?.points}</p>
                        <p style={{ fontSize: "20px", fontWeight: "bold", color: "orangered" }}>
                            🔥 Racha: {streak} {streak === 1 ? "día" : "días"}
                        </p>
                    </div>

                    <button
                        onClick={handleUpdate}
                        style={{
                            marginTop: "20px",
                            padding: "10px 15px",
                            background: "orange",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >
                        ➕ Sumar 10 puntos
                    </button>
                </div>
            ) : (
                <h2>👋 Bienvenido invitado</h2>
            )}

            {/* Leaderboard visible siempre */}
            <div style={{ marginTop: "30px" }}>
                <h2>🏆 Ranking de Rachas</h2>
                {leaders.length === 0 && <p>No hay jugadores aún.</p>}

                <ol style={{ paddingLeft: "20px" }}>
                    {leaders.map((player, index) => (
                        <li key={player.id} style={{ marginBottom: "8px" }}>
                            <span style={{ fontWeight: "bold" }}>#{index + 1}</span>{" "}
                            {player.name || "Jugador Anónimo"} → 🔥 {player.streak} días
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    )
}
