"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Heart, Lightbulb } from "lucide-react"
import { launchConfetti } from "@/lib/confetti"
import { UserData, pets, Pet } from "@/lib/userTypes"
import useSound from "@/hooks/useSound"

export default function LevelComponent({

  
  levelId,
  onComplete,
  onBack,
  userData,
  onLoseLife,
}: {
  levelId: number
  onComplete: (xp: number, coins: number) => void
  onBack: () => void
  userData: UserData
  onLoseLife: () => void
}) {
  
  // --- ESTADO PRINCIPAL ---
  // Pasadas: 'first' (primera vuelta) y 'retry' (revisión de falladas)
  const [pass, setPass] = useState<"first" | "retry">("first")
  const [currentIndex, setCurrentIndex] = useState(0)        // índice de la pasada actual
  const [retryQueue, setRetryQueue] = useState<number[]>([]) // índices de preguntas falladas
  const [retryPos, setRetryPos] = useState(0)                // puntero dentro de retryQueue
  // estado nuevo
  const [isFixing, setIsFixing] = useState(false)
  const playClick = useSound("/sounds/click.mp3")
  const playSuccess = useSound("/sounds/success.mp3")
  const playSuccess2 = useSound("/sounds/success2.mp3")
  const playFail = useSound("/sounds/fail.mp3")
const pets = [
  { id: "baby-capybara", name: "Capi Bebé", icon: "🐹", price: 0, unlocked: true },
  { id: "adult-capybara", name: "Capi Adulto", icon: "🦫", price: 200, unlocked: false },
  { id: "golden-capybara", name: "Capi Dorado", icon: "✨🦫", price: 1000, unlocked: false },
  { id: "ninja-capybara", name: "Capi Ninja", icon: "🥷🦫", price: 1500, unlocked: false },
]

  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [hintUsed, setHintUsed] = useState(false)
  // Level content data with complete content from the attachment
  const levelData = {
    1: {
      title: "Primeros Encuentros",
      type: "roleplay",
      duration: 8,
      xpReward: 50,
      coinReward: 20,
      background: "jungle-campfire-night-scene-animated.png",
      story:
        "Llegas a un campamento de capibaras exploradoras en medio de la selva. Es tu primer día y necesitas presentarte al grupo. Tu objetivo es causar una buena primera impresión.",
      hint: "Recuerda: una sonrisa genuina y mostrar interés por los demás son claves universales para conectar.",
      steps: [
        {
          situation: "¿Cómo saludarás a una capibara desconocida que se acerca a ti?",
          options: [
            { text: "Con una sonrisa cálida y contacto visual directo", correct: true, points: 20 },
            { text: "Con un saludo rápido sin mirar mucho", correct: false, points: 0 },
            { text: "Esperando a que ella hable primero", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! El contacto visual y la sonrisa genuina transmiten confianza y apertura.",
            incorrect:
              "Una sonrisa cálida y contacto visual directo son fundamentales para una buena primera impresión.",
          },
        },
        {
          situation: "Durante la conversación, ¿mantienes contacto visual?",
          options: [
            { text: "Sí, de manera natural y respetuosa", correct: true, points: 20 },
            { text: "No, me da pena mirar a los ojos", correct: false, points: 0 },
            { text: "Solo cuando hablo yo", correct: false, points: 5 },
          ],
          feedback: {
            correct: "Perfecto. El contacto visual muestra interés genuino y construye confianza.",
            incorrect: "El contacto visual natural (no fijo) demuestra respeto e interés por la otra persona.",
          },
        },
        {
          situation: "El interlocutor responde de manera tímida. ¿Qué haces?",
          options: [
            { text: "Le doy espacio y hablo más suave", correct: true, points: 20 },
            { text: "Trato de animarlo hablando más fuerte", correct: false, points: 0 },
            { text: "Cambio de tema inmediatamente", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Muy bien! Adaptar tu energía a la del otro muestra inteligencia emocional.",
            incorrect: "Cuando alguien es tímido, es mejor bajar la intensidad y darle espacio para abrirse.",
          },
        },
        {
          situation: "Una capibara te ofrece la mano para saludar. ¿Qué tipo de apretón usas?",
          options: [
            { text: "Firme pero no excesivo, con contacto visual", correct: true, points: 20 },
            { text: "Muy suave, casi sin fuerza", correct: false, points: 0 },
            { text: "Muy fuerte para mostrar seguridad", correct: false, points: 0 },
          ],
          feedback: {
            correct: "Excelente. Un apretón firme pero respetuoso transmite confianza sin intimidar.",
            incorrect: "Un apretón de manos debe ser firme pero no excesivo, acompañado de contacto visual.",
          },
        },
        {
          situation: "Te presentan al grupo. ¿Cómo te presentas?",
          options: [
            { text: "Digo mi nombre y algo que me gusta hacer", correct: true, points: 20 },
            { text: "Solo digo mi nombre", correct: false, points: 5 },
            { text: "Hago una broma para romper el hielo", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Compartir un interés personal ayuda a otros a conectar contigo.",
            incorrect: "Agregar algo personal (un interés o pasión) ayuda a crear conexiones más profundas.",
          },
        },
      ],
    },
    2: {
      title: "Escucha Activa",
      type: "interactive",
      duration: 6,
      xpReward: 40,
      coinReward: 15,
      background: "dense-jungle-sounds.png",
      story:
        "En el corazón de la selva, dos capibaras están compartiendo sus experiencias. Tu misión es desarrollar tu habilidad de escucha activa prestando atención a cada detalle.",
      hint: "La escucha activa no es solo oír palabras, es entender emociones y necesidades detrás del mensaje.",
      steps: [
        {
          situation: "Una capibara habla de su día difícil. ¿Qué técnica usarías para demostrar que escuchas?",
          options: [
            { text: "Repetir palabras clave y asentir", correct: true, points: 20 },
            { text: "Interrumpir para dar consejos", correct: false, points: 0 },
            { text: "Cambiar el tema a algo positivo", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Parafrasear y usar lenguaje corporal muestra que realmente escuchas.",
            incorrect: "Escuchar activamente significa reflejar lo que oyes sin interrumpir o juzgar.",
          },
        },
        {
          situation: "Escuchas a una capibara contar una historia emotiva. ¿Qué frase muestra mejor escucha?",
          options: [
            { text: "'Entiendo cómo te sientes'", correct: true, points: 20 },
            { text: "'Lo mismo me pasó a mí'", correct: false, points: 0 },
            { text: "'No te preocupes, no es tan grave'", correct: false, points: 0 },
          ],
          feedback: {
            correct: "Perfecto. Validar las emociones del otro es clave en la escucha activa.",
            incorrect: "Evita minimizar o hacer sobre ti. Enfócate en validar sus sentimientos.",
          },
        },
        {
          situation: "Una capibara te cuenta 3 cosas importantes. ¿En qué orden de importancia las escuchaste?",
          options: [
            { text: "Su preocupación por la familia, el trabajo, el clima", correct: true, points: 20 },
            { text: "El clima, el trabajo, la familia", correct: false, points: 0 },
            { text: "El trabajo, el clima, la familia", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Muy bien! Identificaste correctamente que la familia era su mayor preocupación.",
            incorrect: "Escuchar activamente incluye identificar qué es más importante para la otra persona.",
          },
        },
        {
          situation: "El interlocutor baja la voz mientras habla. ¿Qué haces?",
          options: [
            { text: "Me acerco ligeramente y mantengo atención", correct: true, points: 20 },
            { text: "Ignoro el cambio de volumen", correct: false, points: 0 },
            { text: "Le pido que hable más fuerte", correct: false, points: 0 },
          ],
          feedback: {
            correct: "Excelente. Adaptarte físicamente muestra respeto e interés genuino.",
            incorrect: "Cuando alguien baja la voz, suele ser porque el tema es importante o personal.",
          },
        },
        {
          situation: "Una capibara te cuenta un problema personal. ¿Cuál es la mejor respuesta?",
          options: [
            { text: "'Debe ser difícil para ti. ¿Cómo te sientes?'", correct: true, points: 20 },
            { text: "'Deberías hacer esto...'", correct: false, points: 0 },
            { text: "'Al menos no es tan malo como...'", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Validar emociones y hacer preguntas abiertas profundiza la conexión.",
            incorrect: "Evita dar consejos inmediatos o comparar. Primero valida sus emociones.",
          },
        },
      ],
    },
    3: {
      title: "Lenguaje Corporal",
      type: "video",
      duration: 10,
      xpReward: 60,
      coinReward: 25,
      background: "natural-landscape-body-language.png",
      story:
        "En un claro del bosque, observas diferentes capibaras interactuando. Tu misión es interpretar y usar el lenguaje corporal efectivamente.",
      hint: "El cuerpo comunica más que las palabras. Observa posturas, gestos y expresiones para entender el mensaje completo.",
      steps: [
        {
          situation: "Observas una capibara con brazos cruzados durante una conversación. ¿Qué comunica?",
          options: [
            { text: "Posible resistencia o incomodidad", correct: true, points: 20 },
            { text: "Está relajada y cómoda", correct: false, points: 0 },
            { text: "Tiene frío solamente", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Correcto! Los brazos cruzados suelen indicar una barrera emocional o física.",
            incorrect: "Los brazos cruzados generalmente indican resistencia, defensa o incomodidad.",
          },
        },
        {
          situation: "Ves una sonrisa natural vs una forzada. ¿Cómo las diferencias?",
          options: [
            { text: "La natural involucra los ojos, la forzada solo la boca", correct: true, points: 20 },
            { text: "La natural es más grande", correct: false, points: 0 },
            { text: "No hay diferencia real", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Una sonrisa genuina activa los músculos alrededor de los ojos.",
            incorrect: "Las sonrisas genuinas involucran toda la cara, especialmente los ojos (sonrisa Duchenne).",
          },
        },
        {
          situation: "¿Qué postura corporal muestra más seguridad y apertura?",
          options: [
            { text: "Espalda recta, hombros relajados, brazos abiertos", correct: true, points: 20 },
            { text: "Encorvado con manos en los bolsillos", correct: false, points: 0 },
            { text: "Rígido con brazos a los lados", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Perfecto! Esta postura transmite confianza sin intimidar.",
            incorrect: "Una postura abierta y relajada transmite confianza y accesibilidad.",
          },
        },
        {
          situation: "Durante una presentación, ¿qué hacer con las manos?",
          options: [
            { text: "Usarlas para acompañar y enfatizar el mensaje", correct: true, points: 20 },
            { text: "Mantenerlas ocultas o quietas", correct: false, points: 0 },
            { text: "Cruzarlas para verse profesional", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Muy bien! Los gestos naturales con las manos refuerzan tu mensaje.",
            incorrect: "Las manos son herramientas poderosas para comunicar. Úsalas de manera natural.",
          },
        },
        {
          situation: "¿Cuántos segundos es ideal mantener contacto visual en una conversación?",
          options: [
            { text: "3-5 segundos, luego desviar naturalmente", correct: true, points: 20 },
            { text: "Todo el tiempo sin parar", correct: false, points: 0 },
            { text: "Solo cuando hablas tú", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Correcto! El contacto visual natural evita intimidar pero mantiene conexión.",
            incorrect: "El contacto visual debe ser natural: 3-5 segundos, luego desviar brevemente.",
          },
        },
      ],
    },
    4: {
      title: "Manejo de Conflictos",
      type: "story",
      duration: 12,
      xpReward: 80,
      coinReward: 30,
      background: "conflict-resolution-scene.png",
      story:
        "Dos capibaras están en desacuerdo sobre qué ruta tomar para llegar al río. La tensión está aumentando y necesitas mediar para resolver el conflicto.",
      hint: "En conflictos, busca primero entender antes de ser entendido. La empatía desarma la tensión.",
      steps: [
        {
          situation: "Dos capibaras discuten por un recurso limitado. ¿Qué haces primero?",
          options: [
            { text: "Escucho a ambas partes por separado", correct: true, points: 20 },
            { text: "Tomo una decisión rápida", correct: false, points: 0 },
            { text: "Les digo que se calmen", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Excelente! Entender todas las perspectivas es el primer paso para resolver conflictos.",
            incorrect: "Antes de resolver, necesitas entender completamente el problema desde todas las perspectivas.",
          },
        },
        {
          situation: "Una parte está muy alterada emocionalmente. ¿Qué tono de voz usarías?",
          options: [
            { text: "Calmado y pausado, más bajo que el suyo", correct: true, points: 20 },
            { text: "Firme y autoritario", correct: false, points: 0 },
            { text: "Al mismo nivel de intensidad", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Un tono calmado ayuda a reducir la tensión emocional.",
            incorrect: "Bajar el tono y hablar pausadamente ayuda a calmar la situación.",
          },
        },
        {
          situation: "La tensión sube entre las partes. ¿Qué haces?",
          options: [
            { text: "Hago una pausa y respiro profundo", correct: true, points: 20 },
            { text: "Acelero para resolver rápido", correct: false, points: 0 },
            { text: "Dejo que se desahoguen", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Muy bien! Las pausas estratégicas permiten que las emociones se calmen.",
            incorrect: "Cuando la tensión sube, una pausa estratégica puede cambiar toda la dinámica.",
          },
        },
        {
          situation: "Buscas una solución. ¿En qué te enfocas?",
          options: [
            { text: "En puntos en común e intereses compartidos", correct: true, points: 20 },
            { text: "En quién tiene la razón", correct: false, points: 0 },
            { text: "En las diferencias para resolverlas", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Excelente! Los puntos en común son la base para construir soluciones.",
            incorrect: "Enfócate en lo que une, no en lo que divide. Los intereses comunes son clave.",
          },
        },
        {
          situation: "Una parte no quiere hablar más. ¿Qué haces?",
          options: [
            { text: "Respeto su espacio y propongo retomar después", correct: true, points: 20 },
            { text: "Insisto en que debe participar", correct: false, points: 0 },
            { text: "Resuelvo sin su opinión", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Perfecto! Respetar los límites mantiene la confianza y abre futuras oportunidades.",
            incorrect: "Forzar la participación puede empeorar el conflicto. Respeta los límites.",
          },
        },
      ],
    },
    5: {
      title: "Presentaciones Efectivas",
      type: "quiz",
      duration: 15,
      xpReward: 100,
      coinReward: 40,
      background: "presentation-stage-natural.png",
      story:
        "Es tu turno de presentar un proyecto importante al consejo de capibaras ancianas. Debes demostrar todas tus habilidades de comunicación para ser claro, convincente y memorable.",
      hint: "Una gran presentación cuenta una historia clara: problema, solución, beneficios. Conecta emocionalmente con tu audiencia.",
      steps: [
        {
          situation: "¿Cuál es la mejor manera de iniciar tu presentación?",
          options: [
            { text: "Con una historia breve relacionada al tema", correct: true, points: 20 },
            { text: "Con estadísticas y datos duros", correct: false, points: 5 },
            { text: "Disculpándome por posibles errores", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Las historias capturan atención y crean conexión emocional inmediata.",
            incorrect: "Las historias conectan emocionalmente desde el inicio y hacen tu mensaje memorable.",
          },
        },
        {
          situation: "¿Cuánto tiempo máximo deberías usar para la introducción?",
          options: [
            { text: "1-2 minutos máximo", correct: true, points: 20 },
            { text: "5 minutos para dar contexto completo", correct: false, points: 0 },
            { text: "30 segundos, directo al grano", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Correcto! Una introducción concisa mantiene la atención y genera expectativa.",
            incorrect: "La introducción debe ser breve pero suficiente para enganchar y contextualizar.",
          },
        },
        {
          situation: "Notas que el público se distrae. ¿Qué haces?",
          options: [
            { text: "Hago una pregunta directa o cambio el ritmo", correct: true, points: 20 },
            { text: "Continúo como si nada pasara", correct: false, points: 0 },
            { text: "Hablo más fuerte para captar atención", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Muy bien! Involucrar activamente al público recupera su atención.",
            incorrect: "Cuando pierdes atención, involucra al público con preguntas o cambios de ritmo.",
          },
        },
        {
          situation: "Olvidas parte de tu discurso. ¿Qué haces?",
          options: [
            { text: "Respiro, hago una pausa y retomo naturalmente", correct: true, points: 20 },
            { text: "Me disculpo y admito que olvidé", correct: false, points: 0 },
            { text: "Improviso algo completamente diferente", correct: false, points: 5 },
          ],
          feedback: {
            correct: "¡Perfecto! La confianza y naturalidad mantienen la credibilidad.",
            incorrect: "Las pausas naturales y retomar con confianza mantienen tu credibilidad intacta.",
          },
        },
        {
          situation: "Para el cierre de tu presentación, ¿qué es más efectivo?",
          options: [
            { text: "Resumir puntos clave y hacer un llamado a la acción", correct: true, points: 20 },
            { text: "Agradecer y terminar abruptamente", correct: false, points: 5 },
            { text: "Presumir sobre tu trabajo", correct: false, points: 0 },
          ],
          feedback: {
            correct: "¡Excelente! Un cierre fuerte refuerza tu mensaje y motiva a la acción.",
            incorrect: "El cierre debe reforzar tu mensaje principal y motivar a la audiencia a actuar.",
          },
        },
      ],
    },
  }

  const currentLevelData = levelData[levelId as keyof typeof levelData]
  const currentPet = pets.find((p) => p.id === userData.currentPet)

  if (!currentLevelData) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Nivel en Desarrollo</h2>
        <p className="text-muted-foreground mb-4">Este nivel estará disponible pronto.</p>
        <Button onClick={onBack}>Volver al curso</Button>
      </div>
    )
  }

  // Normalizamos: todo lo que no sea 'roleplay' lo tratamos como 'quiz'
  const levelKind: "roleplay" | "quiz" = currentLevelData.type === "roleplay" ? "roleplay" : "quiz"

  // Resolvemos qué índice de paso mostrar según la pasada
  const stepIndex = pass === "first" ? currentIndex : retryQueue[retryPos]
  const currentStepData = currentLevelData.steps[stepIndex]

  const pushWrongOnce = (idx: number) => {
    setRetryQueue((prev) => (prev.includes(idx) ? prev : [...prev, idx]))
  }

  const resetForNext = () => {
    setIsFixing(false)
    setSelectedOption(null)
    setShowFeedback(false)
    setIsCorrect(null)
    setHintUsed(false)
  }

  const handleOptionSelect = (optionIndex: number) => {
     
    setSelectedOption(optionIndex)
    const option = currentStepData.options[optionIndex]

    if (levelKind === "roleplay") {
      // Roleplay: reintento inmediato hasta acertar
      if (option.correct) {
        playSuccess2()
        setScore((s) => s + option.points)
        setIsCorrect(true)
        setIsFixing(false)
      } else {
        playFail()
        setIsCorrect(false)
        onLoseLife()
        setIsFixing(true)   // ← estamos corrigiendo esta misma
      }
      setShowFeedback(true)
      return
    }

    // Quiz: si fallas, se agenda para el final; igual mostramos feedback
    if (option.correct) {
      playSuccess2()
      setScore((s) => s + option.points)
      setIsCorrect(true)
    } else {
      playFail()
      pushWrongOnce(stepIndex)
      setIsCorrect(false)
      onLoseLife()
    }
    setShowFeedback(true)
  }

  const goToNextInFirstPass = () => {
    if (currentIndex < currentLevelData.steps.length - 1) {
      setCurrentIndex((i) => i + 1)
      resetForNext()
    } else {
      // Terminó primera pasada
      if (retryQueue.length > 0) {
        setPass("retry")
        setRetryPos(0)
        resetForNext()
      } else {
        playSuccess() // sonido de éxito al completar
      launchConfetti() // 🎉 confetti
        onComplete(currentLevelData.xpReward, currentLevelData.coinReward)
      }
    }
  }

  const goToNextInRetryPass = () => {
    if (retryPos < retryQueue.length - 1) {
      setRetryPos((p) => p + 1)
      resetForNext()
    } else {
      playSuccess() // sonido de éxito al completar
  launchConfetti() // 🎉 confetti
      onComplete(currentLevelData.xpReward, currentLevelData.coinReward)
    }
  }

  const handleNext = () => {
    if (levelKind === "roleplay") {
      // Roleplay: solo avanzamos si acertó; si falló, reintenta en el acto
      if (isCorrect) {
        if (pass === "first") {
          goToNextInFirstPass()
        } else {
          // En retry de roleplay (poco común), también avanzamos sólo si acertó
          goToNextInRetryPass()
        }
      } else {
        // reintento inmediato
        resetForNext()
      }
      return
    }

    // Quiz:
    if (pass === "first") {
      // En la primera pasada SIEMPRE avanzamos (haya sido correcto o no)
      goToNextInFirstPass()
    } else {
      // En la pasada de retry, nos quedamos en la misma hasta que acierte
      if (isCorrect) {
        goToNextInRetryPass()
      } else {
        // reintenta esta misma fallada
        resetForNext()
      }
    }
  }

  const showHint = () => {
    if (!hintUsed) setHintUsed(true)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Level header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={onBack} className="border-amber-300 text-amber-700 bg-transparent">
          ← Volver al curso
        </Button>
        <h1 className="text-2xl font-bold text-amber-800">{currentLevelData.title}</h1>
        <div className="text-3xl animate-bounce">{currentPet?.icon}</div>
        <div className="flex items-center gap-2 ml-auto">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="font-bold text-red-600">
            {userData.lives}/{userData.maxLives}
          </span>
        </div>
      </div>

      {/* Level content */}
      <Card className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('/${currentLevelData.background}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <CardContent className="p-8 relative z-10">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-amber-700 mb-2">
              <span>Progreso</span>
              <span>
                {pass === "retry"
                  ? "Repitiendo preguntas"
                  : `${stepIndex + 1} de ${currentLevelData.steps.length}${retryQueue.length > 0 ? ` (${retryQueue.length} por repetir)` : ""
                  }`}
              </span>
            </div>
            <Progress value={((stepIndex + 1) / currentLevelData.steps.length) * 100} />
          </div>

          {/* Story intro (only on first step) */}
          {stepIndex === 0 && (
            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-amber-800">{currentLevelData.story}</p>
            </div>
          )}

          {/* Pet hint section - separate from feedback */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{currentPet?.icon}</div>
              <div>
                <p className="text-sm text-amber-600 font-medium">{currentPet?.name} está aquí para ayudarte</p>
                {!hintUsed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={showHint}
                    className="mt-1 border-amber-300 hover:bg-amber-50 text-white bg-amber-700"
                  >
                    💡 Pedir pista (1 por nivel)
                  </Button>
                )}
              </div>
            </div>
            {hintUsed && (
              <div className="max-w-md p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <div className="text-lg">{currentPet?.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Pista de {currentPet?.name}:</p>
                    <p className="text-sm text-blue-700">{currentLevelData.hint}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Current situation */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 text-amber-800">Situación:</h3>
            <p className="text-amber-700 bg-white/80 p-4 rounded-lg">{currentStepData.situation}</p>
          </div>

          {/* Options */}
          {!showFeedback && (
            <div className="space-y-3">
              <h4 className="font-semibold text-amber-800">¿Qué harías?</h4>
              {currentStepData.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto border-amber-200 hover:bg-amber-50 text-white bg-amber-700"
                  disableClickSound
                  onClick={() => handleOptionSelect(index)}
                >
                  {option.text}
                </Button>
              ))}
            </div>
          )}

          {showFeedback && (
            <div className="mt-4">
              <div
                className={`p-4 rounded-lg border-2 ${isCorrect ? "bg-green-500/20 border-green-400/50" : "bg-red-500/20 border-red-400/50"
                  }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`text-2xl ${isCorrect ? "animate-bounce" : ""}`}>{isCorrect ? "✅" : "❌"}</div>
                  <span className={`font-semibold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                    {isCorrect ? "¡Correcto!" : "Incorrecto"}
                  </span>
                  {!isCorrect && <span className="text-red-600 text-sm">(-1 vida)</span>}
                </div>
                <p className={isCorrect ? "text-green-800" : "text-red-800"}>
                  {isCorrect ? currentStepData.feedback.correct : currentStepData.feedback.incorrect}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm text-amber-600">
                  Puntos ganados: +{currentStepData.options[selectedOption!].points}
                </div>
                <Button
                
                  onClick={handleNext}
                  className={`mt-2 px-6 py-2 text-white font-semibold rounded-lg ${isCorrect
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                    }`}
                >
                  {isCorrect
                    ? (pass === "first"
                      ? (stepIndex < currentLevelData.steps.length - 1
                        ? "Siguiente"
                        : (retryQueue.length > 0 ? "Repasar falladas" : "Completar nivel"))
                      : (retryPos < retryQueue.length - 1 ? "Siguiente (repaso)" : "Completar nivel"))
                    : "Reintentar"}
                </Button>


              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}