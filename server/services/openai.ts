import OpenAI from "openai";
import env from "@server/env";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

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
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: question,
      tools: [
        {
          type: "file_search",
          vector_store_ids: [env.OPENAI_VECTOR_STORE_ID ?? ""],
        },
      ],
    });

    const answer =
      response.output
        .filter((b: any) => b.type === "message")
        .flatMap((b: any) => b.content)
        .filter((c: any) => c.type === "output_text")
        .map((c: any) => c.text)
        .join("\n") || "No se encontró respuesta.";

    const citations =
      response.output
        .filter((b: any) => b.type === "message")
        .flatMap((b: any) => b.content)
        .filter((c: any) => c.type === "output_text")
        .flatMap((c: any) => c.annotations ?? [])
        .filter((a: any) => a.type === "file_citation")
        .map((a: any) => ({
          filename: a.filename ?? "documento",
          snippet: a.quote ?? "",
        })) ?? [];

    return { answer, citations };
  }
}

export default new OpenAIService();