---
name: mvp-freeze-list
description: MVP冻结清单——v2.1可发布范围界定
metadata:
  type: project
  project: story-project
---

# MVP 冻结清单 v2.1

> 本文档界定 v2.1 公开发布的最小可行范围。列入=必须做。未列入=推迟到后续版本或不实现。

## 必须包含（P0 + 核心P1）

### 内容
- [x] Day 1-8 完整剧本（八步故事圈 × 爱的八种形态）
- [x] 4个结局（A数据保留 / B始终如一 / C确认 / D数据持久化）
- [x] 变量系统（openness/acceptance/interaction_depth/rejection_count/breakdown_occurred/unexpected_triggered）

### 核心交互
- [x] 聊天框界面（气泡/打字机效果/选项/Narration）
- [x] 8个季节背景色
- [x] 点击继续/自动推进
- [x] 选项分支系统

### 系统功能
- [x] 存档/读档（5槽+自动存档）
- [x] 主菜单/暂停菜单/设置面板
- [x] 引导页（"给使用者的话"）
- [x] 结局面板
- [x] 隐私说明入口

### 角色展示（v2.1新增）
- [x] 画框展示区 HTML/CSS/JS
- [ ] **AI生成RC-7角色形象（portrait.webp）** ← 🔴 当前最高优先待办
  - [ ] 平台：海艺AI（haiyi.art）或文心一格（yige.baidu.com）
  - [ ] Prompt：已就绪（`AI生成角色形象与渲染方案.md` 第三节）
  - [ ] 跑20-30张 → 选1张（标准：眼神·琥珀色·平稳回看·不热切不回避）
  - [ ] Photopea裁剪3:4 + 微调虹膜色 + 导出WebP(<150KB)
  - [ ] 放入 `game/www/assets/portrait/portrait.webp`
  - [ ] 调试CSS光点位置(top/left)匹配底图眼位
  - [ ] 切换五状态滤镜 → 微调参数

### 发布基础
- [x] GitHub Pages 自动部署
- [x] PWA 配置（manifest + Service Worker）
- [ ] 产品截图（5张：引导页/Day3"我在"/Day6崩溃/Day8结局/主菜单）
- [ ] 隐私说明文案完善

## 明确不包含（v2.1 Won't Do）

- AI模式（LLM集成） → v2.2
- 背景音乐/音效 → v2.2
- 移动端原生App → 远期
- Steam上架 → 远期
- 多身份变体 → 远期
- 排行榜/社交/每日签到 → 永久不做
