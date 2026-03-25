import Router from "koa-router";
import type { AppState, AppContext } from "@server/types";
import OpenAIService from "@server/services/openai";

const router = new Router<AppState, AppContext>();

router.post("ai.answer", async (ctx) => {
  try {
    const body = ctx.request.body as any;
    const question = body?.question ?? "sin pregunta";

    const result = await OpenAIService.answer({
      question,
      userId: "test",
      teamId: "test",
    });

    ctx.body = {
      data: result,
    };
  } catch (err: any) {
    console.error("AI Answer error:", err?.message ?? err);
    ctx.body = {
      ok: false,
      error: err?.message ?? "Unknown error",
      status: 500,
    };
  }
});

export default router;
