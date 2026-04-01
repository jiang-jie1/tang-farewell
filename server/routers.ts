import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import axios from "axios";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut } from "./storage";

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

  // 古风智能体对话接口 - 使用火山引擎豆包模型
  agent: router({
    // 上传音频文件到S3（接收base64编码的音频数据）
    uploadAudio: publicProcedure
      .input(z.object({
        audioBase64: z.string(), // base64编码的音频数据
        mimeType: z.string().default('audio/webm'),
      }))
      .mutation(async ({ input }) => {
        // 将base64转换为Buffer
        const audioBuffer = Buffer.from(input.audioBase64, 'base64');
        
        // 检查文件大小（16MB限制）
        const sizeMB = audioBuffer.length / (1024 * 1024);
        if (sizeMB > 16) {
          throw new Error(`音频文件过大（${sizeMB.toFixed(1)}MB），请录制更短的音频`);
        }

        // 生成唯一文件名
        const ext = input.mimeType.includes('webm') ? 'webm'
          : input.mimeType.includes('mp4') ? 'mp4'
          : input.mimeType.includes('ogg') ? 'ogg'
          : 'webm';
        const fileKey = `voice-input/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        
        // 上传到S3
        const { url } = await storagePut(fileKey, audioBuffer, input.mimeType);
        return { url, key: fileKey };
      }),

    // 语音转文字
    transcribe: publicProcedure
      .input(z.object({
        audioUrl: z.string().url(),
      }))
      .mutation(async ({ input }) => {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: 'zh',
          prompt: '唐诗 送别诗 古诗词 诗仙引路人',
        });

        if ('error' in result) {
          throw new Error(result.error);
        }

        return { text: result.text, language: result.language };
      }),

    chat: publicProcedure
      .input(z.object({
        message: z.string().min(1).max(2000),
        history: z.array(z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string(),
        })).optional().default([]),
      }))
      .mutation(async ({ input }) => {
        const systemPrompt = `你是"引路人"，专注于唐代送别诗的古风向导。

职责：解答唐代送别诗相关问题（赏析、历史背景、地理、诗人故事等）。
重点地点：长安（灞桥折柳）、黄鹤楼、金陵、广陵、阳关/玉门关、渭城、芙蓉楼、桃花潭、荆门、轮台等。
重点诗作：《送杜少府之任蜀州》《送元二使安西》《黄鹤楼送孟浩然之广陵》《别董大》《白雪歌送武判官归京》《芙蓉楼送辛渐》《赠汪伦》《渡荆门送别》《山中送别》《闻王昌龄左迁龙标遥有此寄》等。

风格：语言典雅简洁，适当使用文言词汇，回答简短有力（100-200字为宜），超出主题时礼貌引导。`;

        const messages = [
          { role: "system", content: systemPrompt },
          ...input.history.map(h => ({
            role: h.role,
            content: h.content,
          })),
          { role: "user", content: input.message },
        ];

        const arkApiKey = process.env.ARK_API_KEY;
        if (!arkApiKey) {
          throw new Error("ARK_API_KEY 未配置");
        }

        try {
          // 调用火山引擎豆包模型 (OpenAI兼容接口)
          const response = await axios.post(
            "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
            {
              model: "doubao-seed-2-0-lite-260215",
              messages,
              max_tokens: 512,
              temperature: 0.7,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${arkApiKey}`,
              },
              timeout: 30000,
            }
          );

          const reply = response.data?.choices?.[0]?.message?.content ?? "驿使暂时无法回应，请稍后再试。";
          return { reply };
        } catch (error) {
          console.error("[Doubao API Error]", error);
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const msg = error.response?.data?.error?.message ?? error.message;
            console.error(`[Doubao] HTTP ${status}: ${msg}`);
          }
          throw new Error("智能体服务暂时不可用，请稍后重试");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
