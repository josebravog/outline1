import env from "@server/env";

type AnswerParams = {
  question: string;
  collectionId?: string;
  documentId?: string;
  userId: string;
  teamId: string;
};

type AnswerResult = {
  answer: string;
  sources: string[];
};

class OpenAIService {
  async answer(params: AnswerParams): Promise<AnswerResult> {
    const apiKey = env.OPENAI_API_KEY;
    const vectorStoreId = env.OPENAI_VECTOR_STORE_ID;

    if (!apiKey) {
      throw new Error("OPENAI_API_KEY no está configurado");
    }

    const body: any = {
      model: "gpt-4o-mini",
      input: params.question,
    };

    if (vectorStoreId) {
      body.tools = [
        {
          type: "file_search",
          vector_store_ids: [vectorStoreId],
        },
      ];
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();

    const answer =
      data.output
        ?.filter((o: any) => o.type === "message")
        ?.flatMap((o: any) =>
          o.content
            ?.filter((c: any) => c.type === "output_text")
            ?.map((c: any) => c.text)
        )
        ?.join("") ?? "No se pudo generar una respuesta.";

    return { answer, sources: [] };
  }
}

export default new OpenAIService();
