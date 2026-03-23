import Router from "koa-router";
import type { AppState, AppContext } from "@server/types";

const router = new Router<AppState, AppContext>();

router.post("ai.answer", async (ctx) => {
  const { question } = ctx.request.body;

  ctx.body = {
    data: {
      answer: "Respuesta de prueba para: " + question,
      sources: [],
    },
  };
});

export default router;
