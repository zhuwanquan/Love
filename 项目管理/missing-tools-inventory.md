---
name: missing-tools-inventory
description: 项目缺失的工具和自动化能力清单 — 暂未实现，记录原因和替代方案
metadata: 
  node_type: memory
  type: project
  status: open
  originSessionId: e4640c22-1a76-4048-8a5c-6d6a2bacd90a
---

# 缺失工具清单

记录已识别但暂未实现的工具和自动化能力。每个条目包含：功能描述、未实现原因、替代方案、实现建议。

## 暂未实现的 Skills

### 1. build-and-deploy（自动化构建部署）
- **功能**：`gradlew assembleDebug` + GitHub Pages 部署
- **优先级**：P2
- **未实现原因**：
  - 需要 Android SDK 环境（`sdkmanager`/`gradlew`），环境依赖重
  - GitHub Pages 部署需要 `gh` CLI + push 权限
  - 更适合作为 CI/CD pipeline（GitHub Actions）而非 Claude Skill
- **替代方案**：
  - 手动运行：`cd game/android && ./gradlew assembleDebug`
  - GitHub Pages：`git push` 到 `game` 分支自动触发部署
- **实现建议**：创建 `.github/workflows/build-and-deploy.yml`

### 2. cross-day-reference-map（跨日引用拓扑图）
- **功能**：构建所有跨日引用的可视化拓扑图，标注入度/出度
- **优先级**：P2
- **未实现原因**：功能已被 `script-validator` 的第四步（跨日引用一致性检查）覆盖
- **替代方案**：运行 `/script-validator` → 查看"跨日引用一致性"章节
- **状态**：已覆盖，无需单独实现

### 3. android-device-test（Android 设备测试桥接）
- **功能**：通过 `adb` 连接设备、安装 APK、截图验证
- **优先级**：P3
- **未实现原因**：
  - 需要物理 Android 设备或模拟器运行
  - Claude 无法直接控制移动设备
- **替代方案**：手动 `adb install` + 浏览器预览 `python -m http.server`
- **实现建议**：如果要实现，需要 MCP server 通过 adb 协议桥接

### 4. llm-evaluation-api（LLM 驱动的剧本评估）
- **功能**：用另一个 LLM 扮演"玩家小陈"，逐条评估剧本的共鸣度
- **优先级**：P3
- **未实现原因**：
  - API 调用成本高（8 天剧本全部评估需要大量 tokens）
  - 需要独立的评估 prompt 和评分标准
- **替代方案**：`persona-alignment` skill 已经覆盖了用户画像对齐的静态检查
- **实现建议**：可创建为一个调用 LLM API 的独立脚本

### 5. automated-playthrough-recorder（自动游戏录像）
- **功能**：自动运行游戏、截图每个关键节点、生成可视化 playthrough 报告
- **优先级**：P3
- **未实现原因**：需要在 headless browser 中运行游戏引擎，技术复杂度高
- **替代方案**：手动打开 `game/www/index.html` 走查
- **实现建议**：使用 Puppeteer/Playwright + 游戏引擎 API

## 暂未配置的 MCP 工具

| MCP Server | 功能 | 优先级 | 未实现原因 |
|------------|------|--------|-----------|
| GitHub Pages 部署监控 | 自动检测 Pages build 状态 | P2 | 可通过 `gh api` CLI 替代 |
| Android 设备测试桥接 | adb 操作封装 | P3 | 需要物理设备 |
| LLM 评估 API | 大规模剧本评测 | P3 | 成本 + prompt 工程 |

## 替代方案总结

当前缺失的能力都可以通过现有工具组合或手动操作弥补：
- **构建** → 手动 gradlew
- **部署** → git push 自动触发
- **跨日引用** → script-validator 已覆盖
- **设备测试** → 浏览器预览 + 手动 adb
- **LLM 评估** → persona-alignment + script-evaluator 已覆盖静态检查

---

*记录日期：2026-06-25*
