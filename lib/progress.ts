// lib/progress.ts
import { supabase } from "./supabase"

export type UserProfile = {
    id: string
    name?: string | null
    streak: number
    last_login: string | null
    level: number
    xp: number
    coins: number
    gems: number
    lives: number
    max_lives: number
    last_daily_chest: string | null
    completed_levels: number[]
    badges: string[]
    current_pet: string
    unlocked_pets: string[]
}

function toCamel(row: any): UserProfile {
    return {
        id: row.id,
        name: row.name ?? null,
        streak: row.streak ?? 0,
        last_login: row.last_login ?? null,
        level: row.level ?? 1,
        xp: row.xp ?? 0,
        coins: row.coins ?? 0,
        gems: row.gems ?? 0,
        lives: row.lives ?? 5,
        max_lives: row.max_lives ?? 5,
        last_daily_chest: row.last_daily_chest ?? null,
        completed_levels: Array.isArray(row.completed_levels) ? row.completed_levels : [],
        badges: Array.isArray(row.badges) ? row.badges : [],
        current_pet: row.current_pet ?? "baby-capybara",
        unlocked_pets: Array.isArray(row.unlocked_pets) ? row.unlocked_pets : ["baby-capybara"],
    }
}

function toRow(uid: string, data: Partial<UserProfile>) {
    return {
        id: uid,
        name: data.name ?? undefined,
        streak: data.streak ?? undefined,
        last_login: data.last_login ?? undefined,
        level: data.level ?? undefined,
        xp: data.xp ?? undefined,
        coins: data.coins ?? undefined,
        gems: data.gems ?? undefined,
        lives: data.lives ?? undefined,
        max_lives: data.max_lives ?? undefined,
        last_daily_chest: data.last_daily_chest ?? undefined,
        completed_levels: data.completed_levels ?? undefined,
        badges: data.badges ?? undefined,
        current_pet: data.current_pet ?? undefined,
        unlocked_pets: data.unlocked_pets ?? undefined,
        updated_at: new Date().toISOString(),
    }
}

export async function getUserData(uid: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from("progress").select("*").eq("id", uid).maybeSingle()
    if (error) return null
    return data ? toCamel(data) : null
}

export async function saveUserData(uid: string, data: Partial<UserProfile>) {
    const row = toRow(uid, data)
    const { error } = await supabase.from("progress").upsert(row, { onConflict: "id" })
    if (error) throw error
    return true
}

// Mantén la firma que ya usabas en tu page:
export async function updateStreak(userId: string, displayName?: string) {
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    const current = await getUserData(userId)
    let newStreak = 1

    if (current?.last_login) {
        if (current.last_login === todayStr) {
            return { streak: current.streak, lastLogin: current.last_login }
        }
        const y = new Date()
        y.setDate(today.getDate() - 1)
        const yesterdayStr = y.toISOString().split("T")[0]
        newStreak = current.last_login === yesterdayStr ? (current.streak ?? 0) + 1 : 1
    }

    await saveUserData(userId, {
        name: displayName ?? current?.name ?? "Jugador Anónimo",
        streak: newStreak,
        last_login: todayStr,
        level: current?.level ?? 1,
        xp: current?.xp ?? 0,
        coins: current?.coins ?? 0,
        gems: current?.gems ?? 0,
        lives: current?.lives ?? 5,
        max_lives: current?.max_lives ?? 5,
        last_daily_chest: current?.last_daily_chest ?? null,
        completed_levels: current?.completed_levels ?? [],
        badges: current?.badges ?? [],
        current_pet: current?.current_pet ?? "baby-capybara",
        unlocked_pets: current?.unlocked_pets ?? ["baby-capybara"],
    })

    return { streak: newStreak, lastLogin: todayStr }
}
