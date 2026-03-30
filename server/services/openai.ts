import OpenAI from "openai";
import env from "@server/env";

interface AnswerOptions {
  question: string;
  userId: string;
  teamId: string;
}

interface IndexDocumentOptions {
  id: string;
  title: string;
  text: string;
  collectionId: string | null;
}

export interface AiAnswer {
  answer: string;
  citations: Array<{ filename: string; snippet: string }>;
}

class OpenAIService {
  private getGroqClient() {
    return new OpenAI({
      apiKey: env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  private getOpenAIClient() {
    return new OpenAI({
      apiKey: env.OPENAI_API_KEY,
    });
  }

  async answer({ question }: AnswerOptions): Promise<AiAnswer> {
    const groq = this.getGroqClient();

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente de conocimiento integrado en Outline, una wiki colaborativa. Responde en el mismo idioma que la pregunta.",
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    const answer =
      response.choices[0]?.message?.content ??
      "No se pudo generar una respuesta.";
    return { answer, citations: [] };
  }

  async indexDocument(doc: IndexDocumentOptions): Promise<void> {
    const vectorStoreId = env.OPENAI_VECTOR_STORE_ID;
    if (!vectorStoreId || !env.OPENAI_API_KEY) {
      return;
    }

    const openai = this.getOpenAIClient();
    const content = `# ${doc.title}\n\n${doc.text}`;
    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], `${doc.id}.txt`, { type: "text/plain" });

    const uploaded = await openai.files.create({
      file,
      purpose: "assistants",
    });

    await openai.vectorStores.files.create(vectorStoreId, {
      file_id: uploaded.id,
    });
  }
}

export default new OpenAIService();
