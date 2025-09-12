export interface UserData {
  level: number
  xp: number
  coins: number
  gems: number
  lives: number
  maxLives: number
  lastDailyChest: string | null
  completedLevels: number[]
  badges: string[]
  currentPet: string
  unlockedPets: string[]
}

export interface Pet {
  id: string
  name: string
  icon: string
  price: number
  unlocked: boolean
}

export const pets: Pet[] = [
  { id: "baby-capybara", name: "Capi Bebé", icon: "🐹", price: 0, unlocked: true },
  { id: "adult-capybara", name: "Capi Adulto", icon: "🦫", price: 200, unlocked: false },
  { id: "golden-capybara", name: "Capi Dorado", icon: "✨🦫", price: 1000, unlocked: false },
  { id: "ninja-capybara", name: "Capi Ninja", icon: "🥷🦫", price: 1500, unlocked: false },
]
