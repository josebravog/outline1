import OpenAI from "openai";
import env from "../env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function getAiAnswer(userQuestion: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo económico y potente
      messages: [
        { role: "system", content: "Eres un asistente útil integrado en un Wiki de Outline." },
        { role: "user", content: userQuestion },
      ],
      temperature: 0.7,
    });

    return response.choices[0].message.content || "No recibí respuesta de la IA.";
  } catch (error) {
    console.error("Error en OpenAI Service:", error);
    throw new Error("Error al conectar con OpenAI");
  }
}