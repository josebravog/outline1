cat > server / routes / api / ai / ai.ts << 'EOF'
import Router from "koa-router";
import type { AppState, AppContext } from "@server/types";
import OpenAIService from "@server/services/openai";

const router = new Router<AppState, AppContext>();

router.post("ai.answer", async (ctx) => {
  try {
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
  } catch (err: any) {
    console.error("AI Answer error:", err?.message ?? err);
    ctx.status = 500;
    ctx.body = {
      ok: false,
      error: err?.message ?? "Unknown error",
    };
  }
});

export default router;
EOFcat > server / routes / api / ai / ai.ts << 'EOF'
import Router from "koa-router";
import type { AppState, AppContext } from "@server/types";
import OpenAIService from "@server/services/openai";

const router = new Router<AppState, AppContext>();

router.post("ai.answer", async (ctx) => {
  try {
    const { question, collectionId, documentId } = ctx.request.body;
    Usa esto(más seguro):
    const user = ctx.state.auth?.user;

    if (!user) {
      ctx.throw(401, "Debes estar autenticado para usar la IA");
    }

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
  } catch (err: any) {
    console.error("AI Answer error:", err?.message ?? err);
    ctx.status = 500;
    ctx.body = {
      ok: false,
      error: err?.message ?? "Unknown error",
    };
  }
});

export default router;