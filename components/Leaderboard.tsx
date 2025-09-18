"use client"
import { useEffect, useState } from "react"
import { getLeaderboard } from "@/lib/progress"

export default function Leaderboard() {
    const [leaders, setLeaders] = useState<any[]>([])

    useEffect(() => {
        getLeaderboard(10).then((data) => {
            setLeaders(data)
        })
    }, [])

    return (
        <div style={{ marginTop: "30px" }}>
            <h2>🏆 Ranking de Rachas</h2>
            {leaders.length === 0 && <p>No hay jugadores aún.</p>}

            <ol style={{ paddingLeft: "20px" }}>
                {leaders.map((user, index) => (
                    <li key={user.id} style={{ marginBottom: "8px" }}>
                        <span style={{ fontWeight: "bold" }}>
                            #{index + 1}
                        </span>{" "}
                        {user.name || "Jugador Anónimo"} → 🔥 {user.streak} días
                    </li>
                ))}
            </ol>
        </div>
    )
}
