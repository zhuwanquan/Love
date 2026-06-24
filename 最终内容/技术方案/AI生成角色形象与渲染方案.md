---
name: ai-character-generation-rendering
description: 零美术资源的RC-7角色形象方案——AI生成精致正面头像+CSS滤镜状态渲染+变体生成不同情绪
metadata:
  type: project
  project: story-project
  related: [[角色形象展示区设计方案]], [[角色形象设计方案]], [[RC-7传统女性美设计]], [[中国传统女性理想形象资料库]]
---

# AI 生成角色形象 + 滤镜渲染方案（修正版）

> 核心修正：正面头像、精致五官、视频通话画框标准。杜绝"无脸人"恐怖谷。

---

## 〇、设计修正

**之前的错误**：水墨留白、无五官、朦胧轮廓——放在聊天框旁边像一个没有脸的鬼影。

**正确的方向**：正面头部+颈部+肩部。五官必须精致清晰。风格可以参考：
- 高质量 CG 角色肖像（但不是日式动漫风）
- 东方写实风格——接近中国古风插画的精致度
- 类似"半写实半插画"的质感——有真实感但不追求照片级写实

她不是"一幅画"——她是**一个在画框里看着你的人**。

---

## 一、外观精确描述（给 AI 的生图基础）

RC-7 的完整面部+上半身描述——来自 `角色形象设计方案.md`：

> **年龄感**：约33岁。不是少女——是成熟女性的沉静。
>
> **脸型**：轮廓清晰，不圆不尖。下颌线柔和但不模糊。
>
> **眼睛**：光学虹膜为暖琥珀色——设计时刻意避开了冷色调。不是金色，不是棕色——是琥珀：被封存的温度。眼神不热切、不回避——是平稳地回看你。
>
> **眉毛**：自然。不刻意描画。不张扬。
>
> **鼻子**：挺直但不锐利。
>
> **嘴唇**：自然色。不施唇彩。嘴角不轻易上扬也不下垂——不是冷漠，是平稳。
>
> **面部整体**：不施粉黛。表情不轻易变动。"轮廓清晰而沉静"。
>
> **发型**：深棕色长发，在颈后束成低马尾。几缕碎发垂在耳侧。不是精心打理的发型——是"不需要通过发型来证明什么"。
>
> **着装**：白色衬衫。没有一丝褶皱。领口整齐。深灰色隐约可见。
>
> **铭刻线**：左耳后侧一条细长的工业铭刻线，刻着"RC-7"。平时被头发遮住——正面看不到。
>
> **光线**：她面向你。暖琥珀色的眼睛是画面中唯一有温度的光源。不是她在发光——是她的虹膜被某种内在的光照亮。

---

## 二、平台推荐

### 首选：海艺AI（haiyi.art）
- 免费、无水印、国内直连
- 模型库大，写实/半写实风格模型丰富
- 网页+微信小程序

### 备选：文心一格（yige.baidu.com）
- 国风模型好，中文理解强
- 免费额度
- 可能有水印

---

## 三、生图 Prompt

### 3.1 主 Prompt（中文，适用于海艺AI/文心一格）

```
一位约33岁的中国女性的正面半身像，头部+颈部+肩部，
视频通话的视角——她正面对着你，眼神平静地回看你，

五官精致清晰：轮廓分明的脸型，暖琥珀色的眼睛（这是她最突出的特征——虹膜不是棕色不是金色，是温暖的琥珀色，像被封存的温度），
眉毛自然不刻意，鼻梁挺直，嘴唇自然色不施唇彩，
表情沉静平稳——不是冷漠，不是微笑，是"不需要通过表情来证明什么"的从容，

深棕色长发，在颈后束成低马尾，几缕碎发垂在耳侧，
白色衬衫，领口整齐，没有一丝褶皱，
深灰色的背景——不是纯黑，是深夜房间里的那种灰，
柔和的正面光——但她的琥珀色眼睛似乎在发出极微弱的光芒，

风格：半写实CG角色肖像，精致但不失真实感，
不是日式动漫，不是照片级写实，不是水墨画，
是中国古风插画与高质量CG之间的质感，
画面干净，不要多余的元素，她就是全部焦点，
竖幅3:4比例
```

### 3.2 英文 Prompt（适用于 Midjourney/Stable Diffusion）

```
A front-facing portrait of a Chinese woman, approximately 33 years old,
head and shoulders, video call framing, direct eye contact,
refined delicate facial features, warm amber colored eyes -- her most striking feature,
the iris is amber: not gold, not brown, captured warmth,
natural eyebrows, straight nose bridge, natural lip color, no makeup,
calm composed expression, neither cold nor smiling -- steady presence,

long dark brown hair tied in a low ponytail at the nape, a few loose strands by the ears,
white collared shirt, crisp and unwrinkled,
dark gray background -- the color of a room late at night,
soft frontal lighting, but her amber eyes seem to hold a faint inner glow,

photorealistic CG portrait style, highly detailed face, refined features,
NOT anime, NOT abstract, NOT ink painting, NOT photorealistic photo,
closer to high-end Chinese gufeng illustration with realistic facial rendering,
clean composition, no extra elements, 3:4 aspect ratio,
--ar 3:4
```

### 3.3 负面 Prompt（所有平台通用）

```
模糊, 朦胧, 无脸, 面具, 恐怖, 诡异, 
动漫, 卡通, 日式二次元, 
水墨画, 抽象, 艺术风格化（过度）,
过度磨皮, 塑料感, AI感严重,
露齿笑, 夸张表情, 过度情绪化,
浓妆, 口红, 眼影, 假睫毛,
珠宝, 首饰, 耳环, 项链,
暴露, 性感, 低胸,
杂乱背景, 多余人物, 文字, 水印
```

---

## 四、生图策略

### 4.1 分轮迭代

| 轮次 | 目标 | 数量 | 选图标准 |
|------|------|------|---------|
| **第一轮** | 找到"对的方向"——脸型、气质、琥珀眼 | 20-30张 | 眼神对了就留——琥珀色、平稳、不热切不回避 |
| **第二轮** | 用第一轮选中的图做图生图微调 | 10-15张 | 五官更精致、光线更好、整体更"干净" |
| **第三轮** | 精修最后1-2张——裁剪、调色 | 5-10张 | 完美匹配3:4画框比例 |

### 4.2 选图标准

| 标准 | 说明 |
|------|------|
| **眼神** | 这是最重要的。必须是"平稳地回看你"——不热切（不是渴望）、不回避（不是害羞）、不空洞（不是死鱼眼）。琥珀色的温暖感必须能感受到 |
| **年龄感** | 约33岁——不是20岁少女。有沉淀感但不老 |
| **面部清晰度** | 五官必须清晰精致。不能有AI常见的"糊脸" |
| **衬衫** | 白色、整齐——传达"精确" |
| **背景干净** | 深灰、无杂物——后期容易处理 |
| **比例** | 3:4 竖幅。头部在画面上半部分，肩部在下方 |

### 4.3 常见的 AI 翻车点

| 问题 | 怎么办 |
|------|--------|
| 眼睛不是琥珀色——是棕色/金色/蓝色 | 图生图时加强 `warm amber eyes, amber iris color` 权重 |
| 脸太年轻像20岁 | 加 `mature, 33 years old, settled beauty` |
| AI 把"沉静"理解成"冷漠/凶" | 加 `gentle eyes, calm but not cold` |
| 衬衫不是白色 | 加 `white shirt, crisp white collar` 并在负面加 `colored clothing` |
| 头发散开不是低马尾 | 加 `low ponytail, hair tied back, nape of neck` |
| 背景太亮/太白 | 加 `dark gray background, dimly lit room` |

---

## 五、CSS 滤镜状态渲染系统（修正版）

**核心修正**：因为底图有精致的面部，滤镜的参数必须非常保守——不能用强滤镜破坏面部质感。状态的差异主要通过**光点亮度、整体色温、边缘柔和度**来区分。

### 5.1 五个状态

```css
/* ── 底图基础 ── */
.portrait-base {
  background-image: url('portrait.webp');
  background-size: cover;
  background-position: center;
  transition: filter 2s ease, opacity 2s ease;
}

/* ── 静待：默认状态 ── */
.portrait-state-idle {
  filter: 
    brightness(0.92)      /* 略暗——深夜灯光 */
    saturate(0.85)        /* 略去色——不鲜艳 */
    contrast(0.95);
  opacity: 1;
}

/* ── 聆听：他正在输入 ── */
.portrait-state-listening {
  filter: 
    brightness(0.98)      /* 微亮——她在"看" */
    saturate(0.9)
    contrast(0.93);       /* 微柔——边缘更软 */
  opacity: 1;
}

/* ── 回应：她的消息生成中 ── */
.portrait-state-responding {
  filter: 
    brightness(0.95)
    saturate(0.88)
    contrast(0.94);
  opacity: 1;
}

/* ── 关怀：TCP触发 ── */
.portrait-state-caring {
  filter: 
    brightness(0.96)
    saturate(0.92)        /* 微提饱和——暖一点 */
    sepia(0.08)           /* 极淡暖调 */
    contrast(0.9);        /* 柔——温柔 */
  opacity: 1;
}

/* ── 深度：情感最重的时刻 ── */
.portrait-state-deep {
  filter: 
    brightness(0.82)      /* 暗——但不熄灭 */
    saturate(0.75)        /* 去色——安静 */
    contrast(0.97);       /* 轮廓更清 */
  opacity: 0.95;
}
```

### 5.2 琥珀色眼睛的微光

眼睛是底图的一部分——但可以在眼睛位置叠加一个极微弱的 CSS 光晕：

```css
.eye-glow {
  position: absolute;
  /* 位置需根据实际底图调整，大约在眼部 */
  top: 32%;
  left: 42%;
  width: 30px;
  height: 15px;
  border-radius: 50%;
  background: radial-gradient(
    ellipse,
    rgba(200, 150, 100, 0.12) 0%,   /* 极淡——不能亮到像发光 */
    transparent 70%
  );
  opacity: 0.6;
  transition: opacity 2s ease;
}

/* 深度状态：光更暗但还在 */
.portrait-state-deep .eye-glow {
  opacity: 0.3;
}

/* 关怀状态：光暖一点 */
.portrait-state-caring .eye-glow {
  background: radial-gradient(
    ellipse,
    rgba(210, 145, 85, 0.15) 0%,   /* 多一点红 */
    transparent 70%
  );
}

/* 回应状态：微弱的明暗循环 */
@keyframes processingPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}

.portrait-state-responding .eye-glow {
  animation: processingPulse 2.5s ease-in-out;
}
```

### 5.3 状态切换参数总表

| 状态 | brightness | saturate | sepia | contrast | 眼辉 | 切换速度 |
|------|-----------|----------|-------|----------|------|---------|
| 静待 | 0.92 | 0.85 | 0 | 0.95 | 0.6 | — |
| 聆听 | 0.98 | 0.90 | 0 | 0.93 | 0.7 | 1.5s |
| 回应 | 0.95 | 0.88 | 0 | 0.94 | 0.6→0.8循环 | 0.8s |
| 关怀 | 0.96 | 0.92 | 0.08 | 0.90 | 0.75 | 2s |
| 深度 | 0.82 | 0.75 | 0 | 0.97 | 0.3 | 2.5s |

---

## 六、情绪变体：应对不同场景

一张底图覆盖所有场景可能不够——特别是在情感重场（Day 6崩溃、Day 8结局），她的面部表情可能需要微妙的差异。

### 6.1 生成三张变体

用同一张底图做 **图生图（img2img）**——保持面部一致性，微调表情：

| 变体 | 触发场景 | Prompt 追加 |
|------|---------|------------|
| **A. 基准** | 默认。大部分场景 | 主 prompt |
| **B. 微俯** | Day 3 聆听、Day 6 崩溃前 | `slightly lowered gaze, gentle concern, listening intently but not worried` |
| **C. 微暖** | Day 8 夏至、结局A | `very subtle warmth in expression, the faintest softening around the eyes, like someone who has been present for a year` |

**关键**：变体之间的差异必须极微小——不是"不同表情"，是同一个人的不同时刻。使用 img2img 的 `denoising strength: 0.15-0.25`——只微调眼神和嘴角的细微差异，不改变面部结构。

### 6.2 如果不能生成变体

只有一张底图也可以。CSS 滤镜的五个状态足以覆盖大部分场景。只是 Day 6 和 Day 8 的微表情差异无法体现——但对整体体验影响不大。

---

## 七、画框 HTML 结构（修正版）

```html
<div id="portrait-frame">
  
  <!-- 背景：随节点日变化 -->
  <div id="portrait-bg" class="portrait-background bg-day1"></div>
  
  <!-- 角色底图：AI 生成的精致正面半身像 -->
  <div id="portrait-base" class="portrait-base portrait-state-idle"></div>
  
  <!-- 琥珀色眼辉：极微弱的叠加光晕 -->
  <div id="eye-glow" class="eye-glow"></div>
  
  <!-- 画框边框：细灰边 -->
  <div id="portrait-border"></div>
  
</div>
```

---

## 八、从生图到上线的完整流程

```
1. 海艺AI / 文心一格 → 输入 Prompt → 跑 20-30 张
        ↓
2. 选 2-3 张最好的（眼神对、气质对、五官清晰）
        ↓
3. 用免费工具（Photopea.com 在线PS）：
   - 裁剪到精确 3:4
   - 如果眼睛颜色不对 → 用色相调整微调虹膜颜色到琥珀色
   - 去除 AI 常见的皮肤过度光滑 → 加 0.5% 噪点模拟真实肤质
   - 导出 WebP（质量 85%，文件 < 150KB）
        ↓
4. 放入 game/www/assets/portrait/portrait.webp
        ↓
5. 调整 CSS 中 .eye-glow 的 top/left 匹配底图眼位
        ↓
6. 浏览器中打开 → 切换五个状态 → 微调滤镜参数
        ↓
7. 完成
```

---

*本方案完成于 2026.06.24。核心修正：正面头像+精致五官+视频通话视角——杜绝"无脸人"恐怖谷。*
