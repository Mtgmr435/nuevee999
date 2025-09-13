"use client"
export const dynamic = "force-dynamic"

import CourseList from "@/components/CourseList"
import { UserData, pets, Pet, Level } from "@/lib/userTypes"
import LevelComponent from "@/components/LevelComponent"
import RoleplayLevel from "@/playground/RoleplayLevel"
import QuizLevel from "@/playground/QuizLevel"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import LoginButton from "@/components/LoginButton"
import Dashboard from "@/components/Dashboard"
import { allLevels } from "../lib/levels"
import { updateStreak } from "@/lib/progress"
import { useAuth } from "@/components/AuthProvider"

import {
  Trophy,
  Heart,
  Award,
  Coins,
  Gem,
  ShoppingBag,
  Map,
  User,
  Play,
  Lock,
  CheckCircle,
  Sparkles,
  Volume2,
  Eye,
  MessageCircle,
  Users,
  Presentation,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

// 🔗 Firebase (misma instancia en toda la app)
import { app } from "@/lib/firebase"
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"

// ------- Constantes de persistencia local -------
const LS_USER_KEY = "nu9ve_userData_v1"
const LS_VIEW_KEY = "nu9ve_view_v1"

interface Course {
  id: string
  title: string
  description: string
  icon: string
  color: string
  totalLevels: number
  unlockedLevels: number
  completedLevels: number
}

const initialUserData: UserData = {
  level: 1,
  xp: 0,
  coins: 100,
  gems: 5,
  lives: 5,
  maxLives: 5,
  lastDailyChest: null,
  completedLevels: [],
  badges: [],
  currentPet: "baby-capybara",
  unlockedPets: ["baby-capybara"],
}

const courses: Course[] = [
  {
    id: "communication-v1",
    title: "Comunicación Efectiva",
    description: "Domina el arte de comunicarte con confianza y empatía",
    icon: "💬",
    color: "from-amber-400 to-orange-500",
    totalLevels: 12,
    unlockedLevels: 3,
    completedLevels: 0,
  },
  {
    id: "communication-v2",
    title: "Comunicación Efectiva v2",
    description: "Versión avanzada con nuevos escenarios y desafíos",
    icon: "🗣️",
    color: "from-orange-500 to-red-500",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
  {
    id: "communication-v3",
    title: "Comunicación Efectiva v3",
    description: "Edición especial con casos de estudio empresariales",
    icon: "📢",
    color: "from-yellow-400 to-amber-500",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
  {
    id: "communication-v4",
    title: "Comunicación v4",
    description: "Técnicas avanzadas de persuasión y liderazgo",
    icon: "🎯",
    color: "from-amber-500 to-yellow-600",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
  {
    id: "communication-premium",
    title: "Comunicación Premium",
    description: "Masterclass exclusiva con casos reales de éxito",
    icon: "👑",
    color: "from-yellow-600 to-orange-700",
    totalLevels: 12,
    unlockedLevels: 1,
    completedLevels: 0,
  },
]

const communicationLevels: Level[] = [
  { id: 1, title: "Primeros Encuentros", type: "roleplay", duration: 8, xpReward: 50, coinReward: 20, isCompleted: false, isUnlocked: true, world: "campamento" },
  { id: 2, title: "Escucha Activa", type: "quiz", duration: 6, xpReward: 40, coinReward: 15, isCompleted: false, isUnlocked: true, world: "montana" },
  { id: 3, title: "Comunicacion no verbal", type: "roleplay", duration: 10, xpReward: 60, coinReward: 25, isCompleted: false, isUnlocked: true, world: "rio" },
  { id: 4, title: "Manejo de Conflictos", type: "quiz", duration: 12, xpReward: 80, coinReward: 30, isCompleted: false, isUnlocked: false, world: "mercado" },
  { id: 5, title: "Presentaciones Efectivas", type: "roleplay", duration: 15, xpReward: 100, coinReward: 40, isCompleted: false, isUnlocked: false, world: "selva" },
]

const petData = {
  "baby-capybara": { name: "Capi Bebé", icon: "🐹" },
  "adult-capybara": { name: "Capi Adulto", icon: "🦫" },
  "golden-capybara": { name: "Capi Dorado", icon: "✨🦫" },
  "ninja-capybara": { name: "Capi Ninja", icon: "🥷🦫" },
}

const DeckCarousel = ({
  courses,
  onCourseSelect,
}: { courses: Course[]; onCourseSelect: (courseId: string) => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const handleNext = () => setCurrentIndex((prevIndex) => (prevIndex + 1) % courses.length)
  const handlePrev = () => setCurrentIndex((prevIndex) => (prevIndex - 1 + courses.length) % courses.length)

  const getCardPosition = (index: number) => {
    const position = (index - currentIndex + courses.length) % courses.length
    if (position === 0) return "center"
    if (position === 1 || position === courses.length - 1) return "side"
    return "hidden"
  }

  return (
    <div className="relative h-[550px] flex items-center justify-center px-8">
      <div className="relative w-full max-w-5xl flex items-center justify-center">
        {courses.map((course, index) => {
          const position = getCardPosition(index)
          const isActive = position === "center"
          const isLeft = index < currentIndex || (currentIndex === 0 && index === courses.length - 1)
          if (position === "hidden") return null

          return (
            <div
              key={course.id}
              className={`absolute transition-all duration-700 ease-out transform ${position === "center"
                  ? "z-20 scale-110 opacity-100 translate-x-0"
                  : position === "side"
                    ? isLeft
                      ? "z-10 scale-85 opacity-50 -translate-x-80"
                      : "z-10 scale-85 opacity-50 translate-x-80"
                    : "opacity-0"
                }`}
              style={{ pointerEvents: isActive ? "auto" : "none" }}
            >
              <div
                className={`w-80 h-[450px] rounded-3xl p-8 shadow-2xl border-2 transition-all duration-700 bg-gradient-to-br ${course.color} ${isActive
                    ? "cursor-pointer hover:scale-105 hover:shadow-3xl border-white/40 hover:border-white/60"
                    : "cursor-default border-white/20"
                  }`}
                onClick={isActive ? () => onCourseSelect(course.id) : undefined}
                tabIndex={isActive ? 0 : -1}
                role="button"
                data-active={isActive}
                onKeyDown={(e) => {
                  if (isActive && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault()
                    onCourseSelect(course.id)
                  }
                }}
              >
                <div className="h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-6xl mb-6 text-center drop-shadow-lg">{course.icon}</div>
                    <h3 className="text-2xl font-bold mb-4 text-center drop-shadow-md">{course.title}</h3>
                    <p className="text-white/90 mb-6 text-center leading-relaxed drop-shadow-sm">{course.description}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-white/90">
                      <span className="font-medium">Progreso</span>
                      <span className="font-bold">{course.completedLevels} / {course.totalLevels}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                      <div className="bg-white h-3 rounded-full transition-all duration-500 shadow-sm"
                        style={{ width: `${(course.completedLevels / course.totalLevels) * 100}%` }} />
                    </div>

                    {isActive && (
                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-2 border-white/40 hover:border-white/60 backdrop-blur-sm font-bold py-3 rounded-xl transition-all duration-300">
                        {course.completedLevels > 0 ? "Continuar Aventura" : "Comenzar Aventura"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={handlePrev}
        className="absolute left-4 z-30 w-16 h-16 rounded-full border-2 border-white/40 text-white hover:bg-white/20 bg-black/20 backdrop-blur-md hover:border-white/60 transition-all duration-300"
        aria-label="Curso anterior"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      <Button
        variant="outline"
        size="lg"
        onClick={handleNext}
        className="absolute right-4 z-30 w-16 h-16 rounded-full border-2 border-white/40 text-white hover:bg-white/20 bg-black/20 backdrop-blur-md hover:border-white/60 transition-all duration-300"
        aria-label="Siguiente curso"
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {courses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? "bg-white shadow-lg scale-125" : "bg-white/40 hover:bg-white/60"}`}
            aria-label={`Ir al curso ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function Nu9veAcademy() {
  const [userData, setUserData] = useState<UserData>(initialUserData)
  const [currentView, setCurrentView] = useState<"welcome" | "dashboard" | "course" | "level" | "shop" | "profile">("welcome")
  const { user, loading } = useAuth()
  const [streak, setStreak] = useState<number>(0)
  const [showDailyChest, setShowDailyChest] = useState(true)
  const [chestAnimation, setChestAnimation] = useState(false)
  const [lifeTimer, setLifeTimer] = useState(0)
  const [currentLevel, setCurrentLevel] = useState<number | null>(null)

  // ====== Persistencia local (hidratar + guardar) ======
  const hydratedRef = useRef(false)
  const lsDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hidratar desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_USER_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as UserData
        setUserData({ ...initialUserData, ...parsed })
      }
      const v = localStorage.getItem(LS_VIEW_KEY) as any
      if (v === "dashboard" || v === "course" || v === "level" || v === "shop" || v === "profile") {
        setCurrentView(v)
      }
    } catch { }
    hydratedRef.current = true
  }, [])

  // Guardar en localStorage (debounce)
  useEffect(() => {
    if (!hydratedRef.current) return
    if (lsDebounce.current) clearTimeout(lsDebounce.current)
    lsDebounce.current = setTimeout(() => {
      try {
        localStorage.setItem(LS_USER_KEY, JSON.stringify(userData))
        localStorage.setItem(LS_VIEW_KEY, currentView)
      } catch { }
    }, 300)
    return () => {
      if (lsDebounce.current) clearTimeout(lsDebounce.current)
    }
  }, [userData, currentView])

  // 👉 mover welcome → dashboard cuando hay usuario (no rompe invitado)
  useEffect(() => {
    if (user) setCurrentView((v) => (v === "welcome" ? "dashboard" : v))
  }, [user])

  // ❤️ recarga de vidas cada 15s (demo)
  useEffect(() => {
    const interval = setInterval(() => {
      setUserData((prev: UserData) => {
        if (prev.lives < prev.maxLives) {
          const newTimer = lifeTimer + 1
          if (newTimer >= 15) {
            setLifeTimer(0)
            return { ...prev, lives: prev.lives + 1 }
          } else {
            setLifeTimer(newTimer)
            return prev
          }
        }
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [lifeTimer])

  // 🔥 racha diaria en Firestore
  useEffect(() => {
    if (user) {
      updateStreak(user.uid, user.displayName || "Jugador Anónimo").then((data) => {
        setStreak(data?.streak || 1)
      })
    }
  }, [user])

  // 🎁 cofre diario: disponibilidad
  useEffect(() => {
    const today = new Date().toDateString()
    if (userData.lastDailyChest !== today) setShowDailyChest(true)
  }, [userData.lastDailyChest])

  // 🎁 abrir cofre
  const openDailyChest = () => {
    setChestAnimation(true)
    const rewards = {
      coins: Math.floor(Math.random() * 50) + 25,
      gems: Math.floor(Math.random() * 3) + 1,
      xp: Math.floor(Math.random() * 30) + 20,
    }
    setTimeout(() => {
      setUserData((prev) => ({
        ...prev,
        coins: prev.coins + rewards.coins,
        gems: prev.gems + rewards.gems,
        xp: prev.xp + rewards.xp,
        lastDailyChest: new Date().toDateString(),
      }))
      setShowDailyChest(false)
      setChestAnimation(false)
    }, 2000)
  }

  const buyLife = () => {
    if (userData.lives < userData.maxLives && userData.coins >= 15) {
      setUserData((prev) => ({ ...prev, lives: prev.lives + 1, coins: prev.coins - 15 }))
    }
  }

  const startLevel = (levelId: number) => {
    setCurrentLevel(levelId)
    setCurrentView("level")
  }

  const loseLife = () => setUserData((prev) => ({ ...prev, lives: Math.max(0, prev.lives - 1) }))

  // ✅ completar nivel
  const handleCompleteLevel = (levelId: number, xp: number, coins: number, badges: string[]) => {
    setUserData((prev) => {
      const newCompleted = prev.completedLevels.includes(levelId)
        ? prev.completedLevels
        : [...prev.completedLevels, levelId]
      return { ...prev, xp: prev.xp + xp, coins: prev.coins + coins, completedLevels: newCompleted }
    })
    const nextLevelIndex = communicationLevels.findIndex((level) => level.id === levelId + 1)
    if (nextLevelIndex !== -1) {
      communicationLevels[nextLevelIndex].isUnlocked = true
    }
    setCurrentView("course")
  }

  // ==========================
  // 🔄 SINCRONIZACIÓN FIRESTORE
  // ==========================
  const cloudLoadedRef = useRef(false)

  // ⬇️ Cargar datos del usuario al iniciar sesión (mezclando con local si existe)
  useEffect(() => {
    cloudLoadedRef.current = false
    if (!user) return // invitado: no usamos nube

      ; (async () => {
        try {
          const db = getFirestore(app)
          const ref = doc(db, "users", user.uid)
          const snap = await getDoc(ref)

          // lee local (si jugó como invitado)
          let local: Partial<UserData> | null = null
          try {
            const raw = localStorage.getItem(LS_USER_KEY)
            if (raw) local = JSON.parse(raw)
          } catch { }

          if (snap.exists()) {
            const cloud = snap.data() as Partial<UserData>

            // merge: nube base + añade progreso local si hay
            const merged: UserData = {
              ...initialUserData,
              ...cloud,
              completedLevels: Array.from(
                new Set([
                  ...(Array.isArray(cloud?.completedLevels) ? cloud!.completedLevels! : []),
                  ...(Array.isArray(local?.completedLevels) ? local!.completedLevels! : []),
                ])
              ),
              badges: Array.isArray(cloud?.badges) ? cloud!.badges! : [],
              unlockedPets: Array.isArray(cloud?.unlockedPets) ? cloud!.unlockedPets! : ["baby-capybara"],
              currentPet: (cloud?.currentPet ?? local?.currentPet) || "baby-capybara",
              // toma lo "mejor" de ambos contadores
              coins: Math.max(cloud?.coins ?? 0, local?.coins ?? 0),
              xp: Math.max(cloud?.xp ?? 0, local?.xp ?? 0),
              gems: Math.max(cloud?.gems ?? 0, local?.gems ?? 0),
              lives: Math.max(cloud?.lives ?? initialUserData.lives, local?.lives ?? initialUserData.lives),
            }

            setUserData(merged)
            // guarda también a local inmediatamente
            try { localStorage.setItem(LS_USER_KEY, JSON.stringify(merged)) } catch { }
          } else {
            // Primer login: si hay local, úsalo; si no, defaults
            const seed: UserData = { ...initialUserData, ...(local || {}) }
            await setDoc(ref, { ...seed, displayName: user.displayName ?? null, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
            setUserData(seed)
            try { localStorage.setItem(LS_USER_KEY, JSON.stringify(seed)) } catch { }
          }

          cloudLoadedRef.current = true
        } catch (e) {
          console.warn("⚠️ No se pudo cargar Firestore:", e)
          cloudLoadedRef.current = true // seguir en local aunque falle
        }
      })()
  }, [user])

  // ⬆️ Guardar en Firestore al cambiar userData (debounce)
  const saveDebounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    if (!user) return // invitado
    if (!cloudLoadedRef.current) return // espera a que cargue
    if (saveDebounce.current) clearTimeout(saveDebounce.current)

    saveDebounce.current = setTimeout(async () => {
      try {
        const db = getFirestore(app)
        const ref = doc(db, "users", user.uid)
        const payload = { ...userData, updatedAt: serverTimestamp() }
        await setDoc(ref, payload, { merge: true })
      } catch (e) {
        console.warn("⚠️ No se pudo guardar Firestore:", e)
      }
    }, 700)

    return () => {
      if (saveDebounce.current) clearTimeout(saveDebounce.current)
    }
  }, [userData, user])

  // ---- RENDERIZADORES ----
  function renderWelcome() {
    return (
      <div
        className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('jungle-adventure-background.jpg')` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6">
          <div className="text-[9rem] mb-10 animate-bounce">🦫</div>
          <h1 className="text-6xl sm:text-7xl font-extrabold text-orange-400 mb-8 drop-shadow-lg">Bienvenido a Nu9ve</h1>
          <p className="text-2xl sm:text-3xl text-gray-100 mb-16 leading-relaxed drop-shadow-md">
            Aquí aprenderás a expresarte con <br /> confianza, empatía y claridad.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <div className="flex-1"><LoginButton /></div>
            <Button
              onClick={() => setCurrentView("dashboard")}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-lg px-8 py-4 rounded-xl shadow-md flex items-center justify-center"
            >
              Continuar como Invitado
            </Button>
          </div>
        </div>
      </div>
    )
  }

  function renderDashboard() {
    return (
      <div
        className="relative min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/jungle-adventure-background.jpg')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/30 via-orange-900/20 to-yellow-900/30"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 space-y-8">
          <div className="flex items-center justify-between bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="text-5xl animate-bounce">
                {petData[userData.currentPet as keyof typeof petData]?.icon || "🐹"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-amber-800 mb-1">¡Hola, Explorador!</h1>
                <p className="text-amber-600">Continúa tu aventura de aprendizaje</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                <span className="font-semibold text-amber-800">{userData.coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-cyan-500" />
                <span className="font-semibold text-cyan-800">{userData.gems}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🔥</span>
                <span className="font-semibold text-orange-600">{streak} días</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="font-semibold text-red-800">
                  {userData.lives}/{userData.maxLives}
                </span>
                {userData.lives < userData.maxLives && (
                  <div className="text-xs text-red-600 ml-1">+1 en {15 - lifeTimer}s</div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-amber-800">Progreso General</h2>
              <div className="text-sm text-amber-600">{userData.completedLevels.length} niveles completados</div>
            </div>
            <div className="mt-2">
              <Progress
                value={
                  (userData.completedLevels.length / courses.reduce((acc, course) => acc + course.totalLevels, 0)) * 100
                }
                className="h-2"
              />
            </div>
          </div>

          {showDailyChest && (
            <Card className="border-2 border-amber-400 bg-white/90 backdrop-blur-md shadow-lg">
              <CardContent className="p-6 text-center">
                <div className={`text-6xl mb-4 ${chestAnimation ? "animate-bounce" : "animate-pulse"}`}>🎁</div>
                <h3 className="text-xl font-bold mb-2 text-amber-800">¡Cofre Diario Disponible!</h3>
                <p className="text-amber-600 mb-4">Tu capibara ha encontrado un tesoro especial</p>
                <Button
                  onClick={openDailyChest}
                  className="bg-amber-500 hover:bg-amber-600 text-white shadow-lg"
                  disabled={chestAnimation}
                >
                  {chestAnimation ? "Abriendo..." : "Abrir Cofre"}
                </Button>
              </CardContent>
            </Card>
          )}

          <div>
            <h2 className="text-3xl font-bold mb-8 text-white text-center drop-shadow-lg">Selecciona tu Curso</h2>
            <DeckCarousel
              courses={courses.map((course) => ({
                ...course,
                completedLevels: userData.completedLevels.filter((level) => {
                  if (course.id === "communication-v1") return level >= 1 && level <= 12
                  if (course.id === "communication-v2") return level >= 13 && level <= 24
                  if (course.id === "communication-v3") return level >= 25 && level <= 36
                  if (course.id === "communication-v4") return level >= 37 && level <= 48
                  if (course.id === "communication-premium") return level >= 49 && level <= 60
                  return false
                }).length,
              }))}
              onCourseSelect={() => setCurrentView("course")}
            />
          </div>
        </div>
      </div>
    )
  }

  function renderShop() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" onClick={() => setCurrentView("dashboard")} className="border-amber-300 text-amber-700">← Volver</Button>
            <h1 className="text-3xl font-bold text-amber-800">🛍️ Tienda de Mascotas</h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="border-2 border-amber-200 hover:border-amber-400 transition-colors">
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{pet.icon}</div>
                  <h3 className="text-lg font-bold mb-2 text-amber-800">{pet.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span className="font-bold text-amber-700">{pet.price === 0 ? "Gratis" : pet.price}</span>
                  </div>
                  {userData.unlockedPets.includes(pet.id) ? (
                    <div className="space-y-2">
                      {userData.currentPet === pet.id ? (
                        <Button disabled className="w-full bg-green-100 text-green-800">✓ Equipada</Button>
                      ) : (
                        <Button
                          onClick={() => setUserData((prev) => ({ ...prev, currentPet: pet.id }))}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          Equipar
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        if (userData.coins >= pet.price) {
                          setUserData((prev) => ({
                            ...prev,
                            coins: prev.coins - pet.price,
                            unlockedPets: [...prev.unlockedPets, pet.id],
                            currentPet: pet.id,
                          }))
                        }
                      }}
                      disabled={userData.coins < pet.price}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-300"
                    >
                      {userData.coins >= pet.price ? "Comprar" : "Sin monedas"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  function renderProfile() {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setCurrentView("dashboard")}>← Volver</Button>
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6 mb-6">
              <div className="text-8xl">{pets.find((p) => p.id === userData.currentPet)?.icon}</div>
              <div>
                <h2 className="text-2xl font-bold">Explorador Nu9ve</h2>
                <p className="text-muted-foreground">Nivel {userData.level}</p>
                <Progress value={userData.xp % 100} className="w-48 mt-2" />
                <p className="text-sm text-muted-foreground mt-1">{userData.xp % 100}/100 XP para el siguiente nivel</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-bold text-lg">{userData.completedLevels.length}</p>
                <p className="text-sm text-muted-foreground">Niveles Completados</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <p className="font-bold text-lg">{userData.badges.length}</p>
                <p className="text-sm text-muted-foreground">Insignias Obtenidas</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Sparkles className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="font-bold text-lg">{userData.unlockedPets.length}</p>
                <p className="text-sm text-muted-foreground">Mascotas Desbloqueadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  function renderCourse() {
    const getLevelIcon = (type: string) => {
      switch (type) {
        case "roleplay": return <MessageCircle className="w-6 h-6 text-blue-500" />
        case "interactive": return <Volume2 className="w-6 h-6 text-green-500" />
        case "video": return <Eye className="w-6 h-6 text-purple-500" />
        case "story": return <Users className="w-6 h-6 text-orange-500" />
        case "quiz": return <Presentation className="w-6 h-6 text-red-500" />
        default: return <Play className="w-6 h-6" />
      }
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={() => setCurrentView("dashboard")} className="border-amber-300 text-amber-700 hover:bg-amber-50">← Volver</Button>
          <h1 className="text-2xl font-bold text-amber-800">Comunicación Efectiva</h1>
          <div className="text-3xl animate-bounce">🦫</div>
        </div>

        <div className="relative">
          <div className="grid gap-6">
            {communicationLevels.map((level, index) => {
              const isUnlocked = index === 0 || userData.completedLevels.includes(index)
              const isCompleted = userData.completedLevels.includes(level.id)
              const displayType = level.type === "roleplay" ? "roleplay" : "quiz"

              return (
                <Card
                  key={level.id}
                  className={`relative overflow-hidden transition-all duration-300 ${isUnlocked ? "cursor-pointer hover:shadow-xl hover:scale-[1.02]" : "opacity-50"
                    } ${isCompleted ? "border-green-500 bg-green-50 shadow-green-200 shadow-lg" : "border-amber-200"}`}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: `url('/--getlevelbackground-level-id--.png')`, backgroundSize: "cover", backgroundPosition: "center" }}
                  ></div>

                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          {isCompleted ? (
                            <div className="relative">
                              <CheckCircle className="w-12 h-12 text-green-500" />
                              <div className="absolute -top-1 -right-1 text-xl">✨</div>
                            </div>
                          ) : isUnlocked ? (
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                              {level.id}
                            </div>
                          ) : (
                            <Lock className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getLevelIcon(level.type)}
                            <h3 className="text-lg font-bold text-amber-800">{level.title}</h3>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-amber-600">
                            <span>⏱️ {level.duration} min</span>
                            <span>⭐ {level.xpReward} XP</span>
                            <span>🪙 {level.coinReward} monedas</span>
                            <Badge variant="secondary" className="lowercase">{displayType}</Badge>
                          </div>
                          <p className="text-sm text-amber-600 mt-2">
                            {level.id === 1 && "Aprende a hacer una primera impresión positiva"}
                            {level.id === 2 && "Técnicas para escuchar activamente"}
                            {level.id === 3 && "Domina el lenguaje corporal efectivo"}
                            {level.id === 4 && "Resuelve conflictos con confianza"}
                            {level.id === 5 && "Presenta ideas de manera impactante"}
                          </p>
                        </div>
                      </div>
                      {isUnlocked && (
                        <Button
                          onClick={() => startLevel(level.id)}
                          disabled={!isUnlocked}
                          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg"
                        >
                          {isCompleted ? "Repetir" : "Jugar"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // 🔄 loader mientras resolvemos sesión (sin llamar renderWelcome aquí)
  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <div className="text-amber-700 animate-pulse">Cargando…</div>
      </main>
    )
  }

  return (
    <>
      {currentView === "welcome" && renderWelcome()}
      {currentView !== "welcome" && (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
          <nav className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl animate-pulse">🦫</div>
                  <h1 className="text-xl font-bold text-amber-800">Nu9ve Academy</h1>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={currentView === "dashboard" ? "default" : "ghost"}
                    onClick={() => setCurrentView("dashboard")}
                    size="sm"
                    className={currentView === "dashboard" ? "bg-amber-500 hover:bg-amber-600" : "text-amber-700 hover:bg-amber-50"}
                  >
                    <Map className="w-4 h-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={currentView === "shop" ? "default" : "ghost"}
                    onClick={() => setCurrentView("shop")}
                    size="sm"
                    className={currentView === "shop" ? "bg-amber-500 hover:bg-amber-600" : "text-amber-700 hover:bg-amber-50"}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Tienda
                  </Button>
                  <Button
                    variant={currentView === "profile" ? "default" : "ghost"}
                    onClick={() => setCurrentView("profile")}
                    size="sm"
                    className={currentView === "profile" ? "bg-amber-500 hover:bg-amber-600" : "text-amber-700 hover:bg-amber-50"}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Perfil
                  </Button>
                </div>
              </div>
            </div>
          </nav>

          <main className="min-h-screen w-full">
            {currentView === "dashboard" && renderDashboard()}
            {currentView === "course" && (
              <CourseList
                levels={communicationLevels}
                userData={userData}
                onBack={() => setCurrentView("dashboard")}
                onStartLevel={(id) => startLevel(id)}
              />
            )}
            {currentView === "shop" && renderShop()}
            {currentView === "profile" && renderProfile()}
            {currentView === "level" && currentLevel && (
              <LevelComponent
                levelId={allLevels[currentLevel - 1].id}
                userData={userData}
                onComplete={(xp, coins, badges) => handleCompleteLevel(currentLevel, xp, coins, badges)}
                onBack={() => setCurrentView("course")}
                onLoseLife={loseLife}
              />
            )}
          </main>
        </div>
      )}
    </>
  )
}
