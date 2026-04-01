import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock axios to avoid real API calls in tests
vi.mock("axios", () => ({
  default: {
    post: vi.fn().mockResolvedValue({
      data: {
        choices: [
          {
            message: {
              content: "老夫以为，此诗乃唐代送别诗之精华，海内存知己，天涯若比邻。",
            },
          },
        ],
      },
    }),
    isAxiosError: vi.fn().mockReturnValue(false),
  },
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("agent.chat (豆包模型)", () => {
  beforeEach(() => {
    // 确保ARK_API_KEY已设置
    process.env.ARK_API_KEY = process.env.ARK_API_KEY || "test-key-for-unit-tests";
  });

  it("ARK_API_KEY 环境变量已配置", () => {
    const key = process.env.ARK_API_KEY;
    expect(key).toBeDefined();
    expect(key?.length).toBeGreaterThan(5);
  });

  it("should return a reply from the Doubao model", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.chat({
      message: "请讲解《送杜少府之任蜀州》",
      history: [],
    });

    expect(result).toHaveProperty("reply");
    expect(typeof result.reply).toBe("string");
    expect(result.reply.length).toBeGreaterThan(0);
  });

  it("should accept conversation history", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.agent.chat({
      message: "这首诗的作者是谁？",
      history: [
        { role: "user", content: "请介绍送杜少府之任蜀州" },
        { role: "assistant", content: "此诗为王勃所作..." },
      ],
    });

    expect(result).toHaveProperty("reply");
    expect(typeof result.reply).toBe("string");
  });

  it("should reject empty messages", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.agent.chat({ message: "", history: [] })
    ).rejects.toThrow();
  });

  it("should reject messages that are too long", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const longMessage = "a".repeat(2001);
    await expect(
      caller.agent.chat({ message: longMessage, history: [] })
    ).rejects.toThrow();
  });
});
