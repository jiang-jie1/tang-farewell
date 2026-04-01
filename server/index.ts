import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.use(express.json());

  // 聊天 API 代理 - 调用火山引擎 Doubao 模型
  app.post("/api/chat", async (req, res) => {
    const { prompt, history, systemPrompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: "请输入内容" });
    }

    try {
      // 构建消息列表
      const messages: Array<{ role: string; content: string }> = [];

      if (systemPrompt) {
        messages.push({ role: "system", content: systemPrompt });
      }

      // 添加历史消息（最近8条）
      if (history && Array.isArray(history)) {
        const recentHistory = history.slice(-8);
        for (const msg of recentHistory) {
          if (msg.role && msg.content) {
            messages.push({ role: msg.role, content: msg.content });
          }
        }
      }

      // 确保最后一条是用户消息
      if (!messages.length || messages[messages.length - 1].role !== "user") {
        messages.push({ role: "user", content: prompt });
      }

      // 调用火山引擎 API
      const apiKey = "73b2152b-af29-4df5-ba2b-fcd4ffe1dff9";
      const baseUrl = "https://ark.cn-beijing.volces.com/api/v3";

      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "doubao-seed-2-0-lite-260215",
          messages,
          max_tokens: 1500,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Volcano API error:", response.status, errorText);
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data.choices?.[0]?.message?.content || "抱歉，老夫一时语塞，请稍后再问。";

      return res.json({ reply });
    } catch (error) {
      console.error("Chat API error:", error);
      return res.status(500).json({
        error: "服务异常，请稍后重试",
        reply: "老夫与外界通讯暂时受阻，请稍候片刻再试。",
      });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
