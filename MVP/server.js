require("dotenv").config();
const express = require("express");
const Anthropic = require("@anthropic-ai/sdk").default;
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Load System Prompt from final content
const systemPromptPath = path.join(
  __dirname,
  "..",
  "最终内容",
  "核心设定",
  "RC-Edu-7-System-Prompt.md"
);
const SYSTEM_PROMPT = fs.readFileSync(systemPromptPath, "utf-8");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

// In-memory session store (MVP only - resets on server restart)
const sessions = {};

// Create a new session
app.post("/api/session", (req, res) => {
  const sessionId =
    Date.now().toString(36) + Math.random().toString(36).slice(2);
  sessions[sessionId] = {
    messages: [], // conversation history for Anthropic API
    roundCount: 0,
    createdAt: new Date().toISOString(),
  };
  res.json({ sessionId });
});

// Send a message to RC-Edu-7
app.post("/api/chat", async (req, res) => {
  const { sessionId, message } = req.body;

  if (!sessionId || !sessions[sessionId]) {
    return res.status(400).json({ error: "无效的会话。请刷新页面重新开始。" });
  }

  const session = sessions[sessionId];

  // Validate input length (150 Chinese characters)
  if (message.length > 150) {
    return res.status(400).json({
      error: `输入超过150字限制（当前${message.length}字）。请精简你的表达。`,
    });
  }

  // Check round limit
  if (session.roundCount >= 15) {
    return res.json({
      reply:
        "今天的对话已达到建议的时长上限。根据课程安排，你应该休息了。是否需要我保存今天的对话记录，以便下次继续？",
      roundCount: session.roundCount,
      limitReached: true,
    });
  }

  // Add user message to history
  session.messages.push({ role: "user", content: message });
  session.roundCount++;

  try {
    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500, // 250 Chinese chars ≈ 500 tokens
      system: SYSTEM_PROMPT,
      messages: session.messages,
      temperature: 0.7,
    });

    const reply =
      response.content[0]?.text || "（处理异常。请重新输入你的问题。）";

    // Add assistant response to history
    session.messages.push({ role: "assistant", content: reply });

    res.json({
      reply,
      roundCount: session.roundCount,
      limitReached: session.roundCount >= 15,
    });
  } catch (error) {
    console.error("API Error:", error.message);
    res.status(500).json({
      error: "RC-Edu-7 响应异常。请稍后重试。",
      detail: error.message,
    });
  }
});

// Get session stats
app.get("/api/session/:sessionId", (req, res) => {
  const session = sessions[req.params.sessionId];
  if (!session) {
    return res.status(404).json({ error: "会话不存在" });
  }
  res.json({
    roundCount: session.roundCount,
    createdAt: session.createdAt,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n  RC-Edu-7 MVP 已启动`);
  console.log(`  打开浏览器访问: http://localhost:${PORT}\n`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn("  ⚠ 未设置 ANTHROPIC_API_KEY 环境变量");
    console.warn(
      "  请创建 MVP/.env 文件并添加: ANTHROPIC_API_KEY=your-key-here\n"
    );
  }
});
