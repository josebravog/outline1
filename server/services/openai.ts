import OpenAI from "openai";
import env from "@server/env";

interface AnswerOptions {
  question: string;
  userId: string;
  teamId: string;
}

export interface AiAnswer {
  answer: string;
  citations: Array<{ filename: string; snippet: string }>;
}

class OpenAIService {
  async answer({ question }: AnswerOptions): Promise<AiAnswer> {
    console.log("GROQ_API_KEY presente:", !!env.GROQ_API_KEY, "longitud:", env.GROQ_API_KEY?.length);

    const groq = new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Eres un asistente de conocimiento integrado en Outline, una wiki colaborativa. Responde en el mismo idioma que la pregunta.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer = response.choices[0]?.message?.content ?? "No se pudo generar una respuesta.";
    return { answer, citations: [] };
  }
}

export default new OpenAIService();
