// lib/levels/empatia/mision1.ts

export const mision1 = {
  id: 1,
  title: "Misión 1: El Escudo de la Escucha",
  type: "combo", // 👈 indica que es roleplay + quiz
  background: "assets/worlds/selva.png",
  intro: {
    title: "Misión 1: El Escudo de la Escucha",
    scenario:
      "Tu compañero (Jugador A) siente que sus ideas no son escuchadas en las reuniones. Tu reto es responder con empatía para mantener abierta la comunicación.",
  },
  hint: "👉 No respondas con soluciones inmediatas. Primero nombra la emoción que ves en la otra persona.",
  xpReward: 100,
  coinReward: 40,

  // 🔹 Parte 1: ROLEPLAY
  roleplay: {
    steps: [
      {
        situation: "Jugador A: 'Siempre que hablo en las reuniones, nadie me presta atención.'",
        options: [
          {
            text: "Entiendo que te sientas frustrado, me interesa escuchar lo que piensas.",
            correct: true,
            points: 100,
            feedback: {
              correct: "✅ ¡Excelente! Mostraste empatía y validaste su emoción.",
              incorrect: "❌ Recuerda, lo primero es validar lo que siente la persona.",
            },
          },
          {
            text: "No creo que sea tan grave, quizá exageras un poco.",
            correct: false,
            points: 40,
            feedback: {
              correct: "",
              incorrect: "Eso minimiza sus emociones, lo hace sentir ignorado.",
            },
          },
          {
            text: "Eso pasa porque tus ideas no son claras.",
            correct: false,
            points: 10,
            feedback: {
              correct: "",
              incorrect: "Eso suena crítico y puede cerrar la comunicación.",
            },
          },
        ],
      },
      {
        situation: "Jugador A: 'Gracias, me hace bien sentir que alguien sí quiere escucharme.'",
        options: [
          {
            text: "¿Quieres contarme un ejemplo de cuándo te pasó?",
            correct: true,
            points: 100,
            feedback: {
              correct: "✅ Perfecto, pedir ejemplos muestra interés genuino.",
              incorrect: "",
            },
          },
          {
            text: "Seguro solo fue un malentendido.",
            correct: false,
            points: 40,
            feedback: {
              correct: "",
              incorrect: "Minimizar no ayuda, mejor muestra curiosidad real.",
            },
          },
          {
            text: "No deberías tomártelo tan personal.",
            correct: false,
            points: 20,
            feedback: {
              correct: "",
              incorrect: "Eso invalida lo que siente.",
            },
          },
        ],
      },
    ],
    closing: {
      success: "🎉 Tu compañero se sintió escuchado y validado. ¡Ganaste su confianza!",
      fail: "😔 Tu compañero se cerró y dejó de compartir. Intenta mostrar empatía la próxima vez.",
    },
  },

  // 🔹 Parte 2: QUIZ
  quiz: {
    questions: [
      {
        question: "¿Qué monstruo enfrentaste en esta misión?",
        options: [
          { text: "La Frustración", correct: true },
          { text: "La Alegría", correct: false },
          { text: "La Euforia", correct: false },
        ],
        feedback: {
          correct: "✅ Exacto, enfrentaste la frustración de tu compañero.",
          incorrect: "❌ Era la frustración, no otra emoción.",
        },
      },
      {
        question: "¿Cuál fue tu arma más poderosa?",
        options: [
          { text: "Dar consejos rápidos", correct: false },
          { text: "Escuchar y repetir con tus palabras", correct: true },
          { text: "Cambiar de tema", correct: false },
        ],
        feedback: {
          correct: "✅ Muy bien, la empatía y la escucha son tu mejor escudo.",
          incorrect: "❌ El arma fue escuchar y validar, no dar consejos inmediatos.",
        },
      },
      {
        question: "¿Qué pasó cuando usaste bien tu escudo?",
        options: [
          { text: "Tu compañero se tranquilizó", correct: true },
          { text: "Se enojó más", correct: false },
          { text: "Nada cambió", correct: false },
        ],
        feedback: {
          correct: "✅ Exacto, la empatía calmó la situación.",
          incorrect: "❌ La empatía genera calma, no enojo.",
        },
      },
    ],
  },
}
