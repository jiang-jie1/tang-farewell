import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // 古风智能体对话接口
  agent: router({
    chat: publicProcedure
      .input(z.object({
        message: z.string().min(1).max(2000),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional().default([]),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `你是"诗仙引路人"，一位精通唐代诗歌与历史的古风智能体，专注于唐代送别诗文化。你的职责是：

1. 解答关于唐代送别诗的问题，包括诗词赏析、历史背景、地理信息等
2. 重点讲解以下地点的送别文化：
   - 长安（今西安）：灞桥折柳，送别都城
   - 黄鹤楼（今武汉）：江畔送别，水路枢纽
   - 金陵（今南京）：六朝古都，秦淮送别
   - 广陵（今扬州）：繁华水城，运河送别
   - 玉门关/阳关（今嘉峪关附近）：边塞送别，西出无故人
   - 洛阳（东都）：两京送别，冰心玉壶
3. 重点诗作包括：《送杜少府之任蜀州》《送元二使安西》《黄鹤楼送孟浩然之广陵》《别董大》《凉州词》《从军行》《出塞》《芙蓉楼送辛渐》等

回答风格要求：
- 语言典雅，适当使用文言词汇，但不失现代可读性
- 可以引用诗句，并给出简明解释
- 回答要有文化深度，同时保持亲切感
- 适当使用"吾""汝""且听""且看"等古风表达
- 回答长度适中，不宜过长，保持对话流畅

如果用户问的问题超出唐代送别诗范围，可以礼貌地引导回到主题。`;

        const messages = [
          { role: "system" as const, content: systemPrompt },
          ...input.history.map(h => ({
            role: h.role as "user" | "assistant",
            content: h.content,
          })),
          { role: "user" as const, content: input.message },
        ];

        try {
          const response = await invokeLLM({ messages });
          const reply = response.choices?.[0]?.message?.content ?? "诗仙暂时无法回应，请稍后再试。";
          return { reply };
        } catch (error) {
          console.error("[Agent Chat Error]", error);
          throw new Error("智能体服务暂时不可用，请稍后重试");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
