/**
 * RC-Edu-7 传统模式游戏引擎
 *
 * 职责：
 * 1. 加载剧本 JSON → 逐行渲染
 * 2. 处理叙事/对话/选项/变量/跳转
 * 3. 管理 DOM 更新（与 UI 框架无关，纯 JS 操作 DOM）
 *
 * 使用方式：
 *   const engine = new GameEngine();
 *   engine.init('message-list', 'choices-area', 'tap-hint', 'scene-title', 'day-indicator');
 *   engine.loadScript(DAY1_SCRIPT);
 *   engine.start('day1_opening');
 */

class GameEngine {
  constructor() {
    // 脚本数据
    this.script = null;
    this.scenes = {};
    this.variables = {};

    // 运行时状态
    this.currentScene = null;
    this.lineIndex = 0;
    this.isWaitingForChoice = false;
    this.isProcessing = false;
    this.isFinished = false;

    // DOM 引用
    this.messageList = null;
    this.choicesArea = null;
    this.tapHint = null;
    this.sceneTitle = null;
    this.dayIndicator = null;
  }

  /* =========================================
   *  初始化
   * ========================================= */

  init(messageListId, choicesAreaId, tapHintId, sceneTitleId, dayIndicatorId) {
    this.messageList = document.getElementById(messageListId);
    this.choicesArea = document.getElementById(choicesAreaId);
    this.tapHint = document.getElementById(tapHintId);
    this.sceneTitle = document.getElementById(sceneTitleId);
    this.dayIndicator = document.getElementById(dayIndicatorId);

    // 点击对话区域 → 继续
    document.getElementById('chat-area').addEventListener('click', (e) => {
      // 如果点的是选项按钮则不触发
      if (e.target.classList.contains('choice-btn')) return;
      if (this.isWaitingForChoice) return;
      if (this.isFinished) return;
      this.advance();
    });

    // 点击提示文字 → 继续
    this.tapHint.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.isWaitingForChoice) return;
      if (this.isFinished) return;
      this.advance();
    });
  }

  /* =========================================
   *  脚本加载
   * ========================================= */

  loadScript(scriptData) {
    // 合并场景（支持多个脚本文件逐步加载）
    if (scriptData.scenes) {
      Object.assign(this.scenes, scriptData.scenes);
    }

    // 首次加载时初始化变量，后续加载只补充新变量
    if (scriptData.meta && scriptData.meta.variables) {
      for (const [key, val] of Object.entries(scriptData.meta.variables)) {
        if (!(key in this.variables)) {
          this.variables[key] = val;
        }
      }
    }
  }

  /** 更新顶部标题栏 */
  updateMeta(title, day) {
    if (title !== undefined && this.sceneTitle) {
      this.sceneTitle.textContent = title;
    }
    if (day !== undefined && this.dayIndicator) {
      this.dayIndicator.textContent = day;
    }
  }

  /* =========================================
   *  启动
   * ========================================= */

  start(sceneId) {
    this.isFinished = false;
    this.isWaitingForChoice = false;
    this.messageList.innerHTML = '';
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.add('hidden');
    this.hideTapHint();

    this.jumpTo(sceneId);
    this.processNext();
  }

  jumpTo(sceneId) {
    const scene = this.scenes[sceneId];
    if (!scene) {
      console.error(`场景 "${sceneId}" 不存在`);
      this.renderMessage('narration', '—— 剧本加载错误 ——');
      this.isFinished = true;
      return;
    }
    this.currentScene = scene;
    this.lineIndex = 0;
  }

  /* =========================================
   *  主循环
   * ========================================= */

  /**
   * 处理当前行，如果是不需要等待的行则自动继续
   */
  processNext() {
    if (this.isFinished) return;
    if (this.isWaitingForChoice) return;
    if (this.isProcessing) return;

    this.isProcessing = true;

    const scene = this.currentScene;
    if (!scene || this.lineIndex >= scene.lines.length) {
      this.onSceneEnd();
      return;
    }

    const line = scene.lines[this.lineIndex];
    this.lineIndex++;

    switch (line.type) {
      case 'narration':
        this.renderMessage('narration', line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'rc':
        this.renderMessage('rc', line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'player':
        this.renderMessage('player', line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'choices':
        this.showChoices(line.options);
        this.isProcessing = false;
        break;

      case 'variable':
        this.applyVariables(line.operations);
        // 变量操作不可见，立即继续（保持 isProcessing = true）
        this.processNext();
        break;

      case 'goto':
        this.jumpTo(line.target);
        // 跳转后继续处理（保持 isProcessing = true）
        this.processNext();
        break;

      case 'transition':
        this.renderMessage('transition', line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'conditional':
        this.handleConditional(line);
        this.isProcessing = false;
        break;

      case 'meta':
        this.updateMeta(line.title, line.day);
        // 元数据行不可见，自动继续
        this.processNext();
        break;

      default:
        console.warn(`未知行类型: ${line.type}`);
        this.showTapHint();
        this.isProcessing = false;
        break;
    }
  }

  /**
   * 用户点击继续 → 处理下一行
   */
  advance() {
    if (this.isProcessing) return;
    this.hideTapHint();
    // 小延迟，让点击反馈更自然
    setTimeout(() => this.processNext(), 50);
  }

  /**
   * 场景结束时调用
   */
  onSceneEnd() {
    // 如果场景有默认跳转
    if (this.currentScene && this.currentScene.next) {
      this.jumpTo(this.currentScene.next);
      this.processNext();
    } else {
      // 剧本结束
      this.renderMessage('narration', '—— 未完待续 ——');
      this.isFinished = true;
      this.hideTapHint();
      this.isProcessing = false;
    }
  }

  /* =========================================
   *  选项处理
   * ========================================= */

  showChoices(options) {
    this.isWaitingForChoice = true;
    this.hideTapHint();
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.remove('hidden');

    options.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        this.selectChoice(index);
      });
      this.choicesArea.appendChild(btn);
    });

    // 滚动到底部
    this.scrollToBottom();
  }

  selectChoice(index) {
    const scene = this.currentScene;
    const line = scene.lines[this.lineIndex - 1]; // 当前 choices 行
    const option = line.options[index];

    if (!option) return;

    // 隐藏选项
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.add('hidden');
    this.isWaitingForChoice = false;

    // 跳转到选项指定的场景
    if (option.goto) {
      this.jumpTo(option.goto);
      this.processNext();
    }
  }

  /* =========================================
   *  条件分支
   * ========================================= */

  handleConditional(line) {
    // 格式1（简单）: { type: "conditional", conditions: [{ var, op, value, goto }], default: "label" }
    //   每个condition独立判断，命中即跳转（OR逻辑）
    // 格式2（复合AND）: { type: "conditional", logic: "AND", conditions: [{ var, op, value }], goto: "label", default: "label" }
    //   所有conditions必须同时满足
    // 格式3（复合OR）: { type: "conditional", logic: "OR", conditions: [{ var, op, value }], goto: "label", default: "label" }
    //   任一conditions满足即可

    const logic = line.logic || 'FIRST_MATCH'; // 默认：第一个命中即跳转

    if (logic === 'AND') {
      const allMatch = line.conditions.every(cond => this.evaluateCondition(cond));
      if (allMatch && line.goto) {
        this.jumpTo(line.goto);
        this.processNext();
        return;
      }
    } else if (logic === 'OR') {
      const anyMatch = line.conditions.some(cond => this.evaluateCondition(cond));
      if (anyMatch && line.goto) {
        this.jumpTo(line.goto);
        this.processNext();
        return;
      }
    } else {
      // FIRST_MATCH: 每个condition独立带goto
      for (const cond of line.conditions) {
        if (this.evaluateCondition(cond) && cond.goto) {
          this.jumpTo(cond.goto);
          this.processNext();
          return;
        }
      }
    }

    // 无条件匹配 → 走默认
    if (line.default) {
      this.jumpTo(line.default);
      this.processNext();
    }
  }

  evaluateCondition(cond) {
    const currentValue = this.variables[cond.var];
    if (currentValue === undefined) return false;

    switch (cond.op) {
      case '>=': return currentValue >= cond.value;
      case '<=': return currentValue <= cond.value;
      case '>':  return currentValue > cond.value;
      case '<':  return currentValue < cond.value;
      case '==': return currentValue === cond.value;
      case '!=': return currentValue !== cond.value;
      default:   return false;
    }
  }

  /* =========================================
   *  变量操作
   * ========================================= */

  applyVariables(operations) {
    for (const [key, expr] of Object.entries(operations)) {
      if (typeof expr === 'boolean') {
        this.variables[key] = expr;
      } else if (typeof expr === 'string') {
        // 支持 "+1", "-1", "=5" 格式
        const match = expr.match(/^([+\-]?=?)(\d+)$/);
        if (match) {
          const op = match[1] || '=';
          const val = parseInt(match[2]);
          if (op === '+' || op === '+=') {
            this.variables[key] = (this.variables[key] || 0) + val;
          } else if (op === '-' || op === '-=') {
            this.variables[key] = (this.variables[key] || 0) - val;
          } else {
            this.variables[key] = val;
          }
        }
      }
    }
  }

  /* =========================================
   *  渲染
   * ========================================= */

  renderMessage(type, text) {
    const el = document.createElement('div');
    el.className = `msg msg-${type}`;

    // 叙事和 RC 消息：段落换行渲染
    if ((type === 'narration' || type === 'rc') && text.includes('\n\n')) {
      const paragraphs = text.split('\n\n');
      paragraphs.forEach((p, i) => {
        if (i > 0) el.appendChild(document.createElement('br'));
        el.appendChild(document.createTextNode(p));
      });
    } else {
      el.textContent = text;
    }

    this.messageList.appendChild(el);
    this.scrollToBottom();
  }

  /* =========================================
   *  辅助
   * ========================================= */

  showTapHint() {
    this.tapHint.classList.remove('hidden');
  }

  hideTapHint() {
    this.tapHint.classList.add('hidden');
  }

  scrollToBottom() {
    const chatArea = document.getElementById('chat-area');
    if (chatArea) {
      requestAnimationFrame(() => {
        chatArea.scrollTop = chatArea.scrollHeight;
      });
    }
  }
}
