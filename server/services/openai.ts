class OpenAIService {
  async answer(params: { question: string }) {
    return {
      answer: "Servicio OpenAI listo: " + params.question,
      sources: [],
    };
  }
}

export default new OpenAIService();
