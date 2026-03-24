import Router from "koa-router";
import type { AppState, AppContext } from "@server/types";
import OpenAIService from "@server/services/openai";

const router = new Router<AppState, AppContext>();

router.post("ai.answer", async (ctx) => {
  const { question, collectionId, documentId } = ctx.request.body;
  const { user } = ctx.state.auth;

  const result = await OpenAIService.answer({
    question,
    collectionId,
    documentId,
    userId: user.id,
    teamId: user.teamId,
  });

  ctx.body = {
    data: result,
  };
});

export default router;
