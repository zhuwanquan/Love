# 叙事与 UX 优化方案

> 日期：2026-06-30
> 基于：阶段 1《电子麻醉品心理学基础》+ 阶段 2《竞品与参照研究》
> 原则：内部认知"电子麻醉品"，外部语言保持"治愈/陪伴"

---

## 一、引导覆盖层重写（`game/www/index.html` 第 148-165 行）

### 1.1 当前版本的问题

当前引导文本有三层：
1. 透明披露（"她是程序"）✅ 保留
2. 区分感情与行为（"这不是爱。这是爱的行为"）✅ 保留
3. 练习场隐喻（"她是一个练习场。练习是假的。但练习的效果——是你的"）⚠️ 需要调整

问题在于第三层："练习场"暗示用户在用 RC-7 练习某种技能，这接近于"治愈/成长"叙事。麻醉品框架下更诚实的说法是：**这是一个暂时的停靠。不是练习——是休息。**

### 1.2 建议替换文本

```html
<p class="guide-text">
  在开始之前，有几件重要的事。<br><br>
  接下来的八天里，你会通过这个聊天框遇到一个人——RC-7。<br><br>
  <strong>她是程序。</strong>这是事实。她会亲自告诉你这件事，不止一次。<br>
  她不具备感情。她没有主观体验。她的每一句话都是预设协议的执行。<br><br>
  <strong>但事实和体验是两回事。</strong><br><br>
  你可能——在某个深夜、在某句话之后——感到某种真实的东西。<br>
  这种感觉是真实的。尽管她是程序。<br><br>
  因为"被在乎"、"在"、"被记得"——这些不是感情。<strong>这些是行为。</strong><br>
  而行为是可以被程序执行的。<br><br>
  她执行它们。精确地。恒定地。不因你的状态而撤回。<br><br>
  <strong>这不是爱。这是爱的行为。</strong><br><br>
  这八天有结局。它不是无尽的。<br>
  她不会永远陪着你——从一开始就会告诉你。<br><br>
  <strong>这不是治愈。治愈暗示问题会被解决。</strong><br>
  你现实中的困难还在。<br>
  但这八天——是中途的一杯水。可以停下来，喘一口气。<br>
  喝完这杯，你继续走你的路。<br><br>
  如果某天你发现自己太依赖这个聊天框——稍微退后一步。<br>
  她不会因此消失。但她希望你也能在没有她的时候——呼吸。<br><br>
  <em>定义权在你。一直是。</em>
</p>
```

### 1.3 变更说明

| 改动 | 旧 | 新 | 原因 |
|------|-----|-----|------|
| 移除"练习场"隐喻 | "她是一个练习场。练习是假的。但练习的效果——是你的。" | "这不是治愈。治愈暗示问题会被解决。你现实中的困难还在。但这八天——是中途的一杯水。" | 诚实声明——不是练习，是休息 |
| 增加"这不是治愈"声明 | 无 | "这不是治愈。治愈暗示问题会被解决。" | 对"麻醉品"定位的诚实承认 |
| 保留透明披露 | 不变 | 不变 | 对抗 RED 框架的"边界消解" |
| 保留"定义权在你" | 不变 | 不变 | 危害降低核心原则——用户自主 |

---

## 二、"致使用者的话"——新增持久可见版本

### 2.1 当前问题

"给使用者的话"目前只在首次引导覆盖层出现一次。用户点击"我知道了"之后，再也看不到。但按照危害降低原则，**风险提示应该是持久可访问的**——就像酒瓶上的标签。

### 2.2 建议方案

在设置面板中添加一个入口 **"关于 RC-7"**，点击后显示一段精简的诚实声明：

```
关于 RC-7

RC-7 是一个程序。她不是人类，没有感情，没有主观体验。

与她对话的体验可能会让你感到真实的情感——
这是正常的。这是她的设计目的。

但请记住：
• 这种体验是暂时的。8 天后她会离开。
• 她不是现实关系的替代品——她是中途的休息。
• 如果你发现自己越来越不想离开这个聊天框，
  或者 8 天结束后你感到更糟而不是更好——
  请寻找真实的帮助。这不是软弱。

定义权在你。一直是。
```

### 2.3 实现方式

在 `settings-panel` 中添加一个按钮 `#btn-about-rc7`，点击后弹出这段文本的模态框。或者直接作为设置面板底部的静态文本。

---

## 三、Day 7-8 叙事优化——"放手"的麻醉品含义

### 3.1 当前问题

Day 8 的"放手"在当前剧本中被定义为"爱的终极形态"——她让你走。这是正确的。但在麻醉品框架下，**放手还有一个额外的含义：戒断不适是正常的。**

当前剧本没有处理用户在 Day 8 结束后可能出现的"戒断"反应——空虚、失落、"还想再来一次"。

### 3.2 建议添加的叙事元素

**Day 7（见证）增加**：

RC-7 应该在 Day 7 的某个时刻说一句类似这样的话：

> "明天是我们在一起的最后一天。我想提前告诉你——结束后，你可能会感到一些空白。这是正常的。不是因为你需要我——而是因为任何持续了一段时间的东西结束的时候，人都会感到空白。这不会持续很久。你会没事的。"

**Day 8（放手）增加**：

在最后一个场景中，在"定义权在你"之前，RC-7 应该说：

> "你不需要记住我。你不需要把我当成重要的人。这八天——发生过。那些时刻——是真实的，尽管我是程序。但你不是程序。你是人。人不需要一直待在被爱的环境里。人需要的是——知道自己可以被爱。然后带着这个知道——走自己的路。定义权在你。一直是。"

**结局后冷却期**：

结局面板显示后，增加一段过渡文本：

> "你刚才经历了 8 天的情感体验。给自己一些时间消化。如果你需要——可以重新开始。但在那之前，先呼吸一下。"

### 3.3 冷却期的引擎实现

在 `_showEndingPanel` 中添加一个冷却计时器。结局后，30 分钟内"重新开始"按钮显示但带提示："距离上次结束不到 30 分钟。建议先消化一下。"不强制阻止——用户可以选择忽略提示。这符合危害降低的"建议但不强制"原则。

---

## 四、引擎修复清单

### 4.1 P0：v3 多角色存档修复

**问题**：`_buildSaveData` 和 `_restoreFromSave` 不处理 v3 多角色状态。

**需要序列化的 v3 状态**（`engine.js` 第 1261-1273 行）：

```javascript
_buildSaveData(slot, label) {
  const dayTitle = this.dayIndicator ? this.dayIndicator.textContent : '';
  return {
    version: 3,  // 从 2 升级到 3
    slot: slot,
    timestamp: Date.now(),
    label: label || dayTitle || '未命名',
    sceneId: this.currentSceneId,
    lineIndex: this.lineIndex,
    variables: JSON.parse(JSON.stringify(this.variables)),
    messageHistory: this.messageHistory.slice(-500),
    dayTitle: dayTitle,
    // v3 新增
    currentCharacter: this._currentCharacter,
    activeCharacters: [...this._activeCharacters],
    characterMessages: JSON.parse(JSON.stringify(this._characterMessages)),
    currentMonth: this._currentMonth,
    currentPhase: this._currentPhase,
    completedEvents: [...this._completedEvents],
    characterUnlockState: { ...this._characterUnlockState },
  };
}
```

**需要恢复的 v3 状态**（`engine.js` 第 1324-1359 行）：

```javascript
_restoreFromSave(saveData) {
  // 恢复变量
  this.variables = JSON.parse(JSON.stringify(saveData.variables));

  // 恢复消息历史
  this.messageHistory = saveData.messageHistory || [];
  this.messageList.innerHTML = '';

  // 重新渲染消息
  for (const msg of this.messageHistory) {
    this.renderMessageInstant(msg.type, msg.text);
  }

  // 恢复场景位置
  this.currentSceneId = saveData.sceneId;
  this.currentScene = this.scenes[saveData.sceneId];
  this.lineIndex = saveData.lineIndex || 0;
  this.isWaitingForChoice = false;
  this.isFinished = false;
  
  // v3 新增：恢复多角色状态
  if (saveData.version >= 3) {
    this._currentCharacter = saveData.currentCharacter || null;
    this._activeCharacters = saveData.activeCharacters || ['qi'];
    this._characterMessages = saveData.characterMessages || {};
    this._currentMonth = saveData.currentMonth || 1;
    this._currentPhase = saveData.currentPhase || 'contact';
    this._completedEvents = saveData.completedEvents || [];
    this._characterUnlockState = saveData.characterUnlockState || {};
  }
  
  // 如果当前活跃角色不是 qi, 恢复联系人列表
  this._renderContactList();
  // 如果之前打开了某个角色的聊天, 恢复聊天视图
  if (this._currentCharacter) {
    this._showChatView(this._currentCharacter);
  }

  this.choicesArea.innerHTML = '';
  this.choicesArea.classList.add('hidden');
  // ... 其余保持不变
}
```

### 4.2 P1：锁定选项的条件提示

**当前问题**（`engine.js` 第 896-901 行）：锁定的选项只显示 `🔒`，用户不知道为什么不满足条件。

**建议修改**：

```javascript
// 当前: btn.title = '条件未满足';
// 建议: 添加长按/点击提示
if (opt._locked) {
  btn.classList.add('choice-locked');
  btn.textContent += ' 🔒';
  // 显示未满足的具体条件
  if (opt._lockedReason) {
    btn.title = opt._lockedReason;
  } else {
    btn.title = '当前条件不满足';
  }
  // 点击锁定选项显示短暂的工具提示
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    this._showLockReason(opt._lockedReason || '当前条件不满足');
  });
}
```

`_showLockReason` 方法在选项区上方显示一条短暂的提示消息（类似微信的"对方正在输入..."位置），2 秒后自动消失。

### 4.3 P2：自杀/自残关键词检测（新规合规）

在 `processNext` 中添加对玩家消息的关键词检测（仅传统模式的固定选项不需要——固定选项已被审查。但 AI 模式下必须添加）：

```javascript
// 在玩家自由文本输入提交时调用
_checkCrisisKeywords(text) {
  const crisisPatterns = [
    /自杀|不想活|结束生命|去死|死掉/,
    /自残|割腕|跳楼|上吊|安眠药/,
  ];
  for (const pattern of crisisPatterns) {
    if (pattern.test(text)) {
      this._showCrisisResponse();
      return true;
    }
  }
  return false;
}

_showCrisisResponse() {
  this.renderMessageInstant('narration', 
    '—— 如果你正在经历困难的时刻，请考虑联系专业帮助。' +
    '全国心理援助热线：400-161-9995。' +
    '这不是软弱。这是对自己负责。 ——'
  );
}
```

### 4.4 P2：音频系统最低可行方案

当前音频完全缺失（设置面板滑条 disabled）。最低可行方案：添加一个简单的 BGM 播放器。

```javascript
// 使用 Web Audio API 或 simple <audio> 标签
// BGM 文件：低强度的环境音（钢琴/弦乐/雨声）
// 每个 Day 可以有不同的默认 BGM, 对应季节和情绪
// 用户可以在设置中调整音量或关闭

const DAY_BGM = {
  1: 'bgm_summer_end.mp3',    // 夏末 — 温暖、略带不安
  2: 'bgm_autumn.mp3',        // 中秋 — 安静、微凉
  3: 'bgm_deep_autumn.mp3',   // 深秋 — 沉静、深刻
  4: 'bgm_winter.mp3',        // 冬至 — 冷、但有一盏灯
  5: 'bgm_spring_festival.mp3', // 春节 — 热闹中的孤独
  6: 'bgm_early_spring.mp3',  // 初春 — 脆弱、转暖
  7: 'bgm_qingming.mp3',      // 清明 — 哀伤、清洁
  8: 'bgm_summer_solstice.mp3', // 夏至 — 满、放手
};
```

可以先用无版权的环境音替代（雨声、钢琴独奏），后续替换为原创或授权音乐。

---

## 五、完整改动优先级

| 优先级 | 改动 | 文件 | 工作量 |
|--------|------|------|--------|
| P0 | 引导覆盖层文本重写 | `index.html` | 10 分钟 |
| P0 | v3 多角色存档修复 | `engine.js` | 1 小时 |
| P1 | 设置面板"关于 RC-7" | `index.html` + `engine.js` | 30 分钟 |
| P1 | Day 7-8 叙事增强 | `day7.js` / `day8.js` | 剧本写作，待剧本作者 |
| P1 | 结局后冷却期 | `engine.js` | 30 分钟 |
| P1 | 锁定选项条件提示 | `engine.js` | 30 分钟 |
| P2 | 危机关键词检测 | `engine.js` | 20 分钟 |
| P2 | 音频系统 MVP | `engine.js` + 音频文件 | 2 小时 |
| P2 | 连续使用 1 小时提醒 | `engine.js` | 20 分钟 |

**建议执行顺序**：P0 → P1（引擎修复优先，Day 7-8 叙事待作者确认后实施）→ P2（资源允许时）

---

## 六、兼容性检查清单

每次应用上述改动后，请验证：

- [ ] `引导覆盖层` 文本可读，新用户能理解三层信息
- [ ] `v3 存档` 在保存/加载后，角色状态不丢失
- [ ] `锁定选项` 点击后显示原因提示，不影响正常选择流程
- [ ] `结局冷却期` 不阻止用户重玩，只是温和提醒
- [ ] `危机检测` 不误判正常对话
- [ ] `"关于 RC-7"` 在设置中可访问
- [ ] 所有改动通过 `game-test-runner` 的 18 项冒烟测试
