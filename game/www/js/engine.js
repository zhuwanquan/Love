/**
 * RC-7 传统模式游戏引擎 v2.0
 *
 * 职责：
 * 1. 加载剧本 JSON → 逐行渲染（含打字机效果）
 * 2. 处理叙事/对话/选项/变量/跳转/条件/场景背景
 * 3. 存档/读档（localStorage，5槽位+自动存档）
 * 4. 结局条件判定
 * 5. 主菜单/暂停菜单/设置面板/存档面板
 * 6. 对话历史回看
 * 7. 开发者调试面板
 *
 * 使用方式：
 *   const engine = new GameEngine();
 *   engine.init(...);
 *   engine.loadScript(DAY1_SCRIPT);
 *   engine.showMainMenu();
 */

class GameEngine {
  constructor() {
    // ── 脚本数据 ──
    this.scenes = {};
    this.variables = {};
    this._endings = null;       // 结局条件定义
    this._scriptMetas = [];     // 所有已加载脚本的 meta

    // ── 运行时状态 ──
    this.currentScene = null;
    this.currentSceneId = null;
    this.lineIndex = 0;
    this.isWaitingForChoice = false;
    this.isProcessing = false;
    this.isFinished = false;
    this.isPaused = false;

    // ── 打字机状态 ──
    this._isTyping = false;
    this._skipRequested = false;
    this._typewriterTimer = null;

    // ── 对话历史 ──
    this.messageHistory = [];

    // ── 设置 ──
    this._settings = this._loadSettings();

    // ── DOM 引用 ──
    this.messageList = null;
    this.choicesArea = null;
    this.tapHint = null;
    this.sceneTitle = null;
    this.dayIndicator = null;
    this.chatArea = null;

    // ── 通知/主动消息 ──
    this._pendingNotifications = [];
    this._autoAdvanceTimer = null;

    // ── 存档系统 ──
    this._saveKey = 'rc7_saves';
    this._autoSaveSlot = 0;
    this._manualSlots = 5;

    // ── 当前存档槽（用于继续游戏覆盖） ──
    this._currentSaveSlot = null;

    // ── v3 多角色状态 ──
    this._activeCharacters = ['qi'];
    this._characterMessages = {};
    this._currentCharacter = null;
    this._currentRoute = null;
    this._currentMonth = 1;
    this._currentPhase = 'contact';
    this._completedEvents = new Set();
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
    this.chatArea = document.getElementById('chat-area');

    // ── v3 通讯录初始化 ──
    this._initContactList();

    // ── 游戏区域点击 → 推进 ──
    if (this.chatArea) {
      this.chatArea.addEventListener('click', (e) => {
        if (e.target.classList.contains('choice-btn')) return;
        if (this.isWaitingForChoice) return;
        if (this.isFinished) return;
        if (this.isPaused) return;
        this.advance();
      });
    }

    // ── 点击提示 → 推进 ──
    if (this.tapHint) {
      this.tapHint.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.isWaitingForChoice) return;
        if (this.isFinished) return;
        if (this.isPaused) return;
        this.advance();
      });
    }

    // ── 键盘快捷键 ──
    document.addEventListener('keydown', (e) => {
      // ESC → 暂停菜单
      if (e.key === 'Escape') {
        if (this.isPaused) {
          this.resumeGame();
        } else if (!this._isTyping && !this.isWaitingForChoice && !this.isFinished) {
          this.showPauseMenu();
        }
        return;
      }
      // 反引号 → 开发者面板
      if (e.key === '`' || e.key === '~') {
        e.preventDefault();
        this.toggleDevPanel();
        return;
      }
      // 空格/回车 → 推进（打字中则跳过）
      if ((e.key === ' ' || e.key === 'Enter') && !this.isPaused) {
        e.preventDefault();
        if (this._isTyping) {
          this._skipRequested = true;
        } else if (!this.isWaitingForChoice && !this.isFinished) {
          this.advance();
        }
      }
    });

    // ── 菜单按钮事件 ──
    this._bindMenuEvents();

    // ── 初始状态：显示主菜单 ──
    this.showMainMenu();
  }

  /* =========================================
   *  菜单事件绑定
   * ========================================= */

  _bindMenuEvents() {
    // 主菜单
    this._on('btn-new-game', 'click', () => this.startNewGame());
    this._on('btn-continue', 'click', () => this.continueGame());
    this._on('btn-load-main', 'click', () => this.showLoadPanel('main'));
    this._on('btn-settings-main', 'click', () => this.showSettings('main'));

    // 暂停菜单
    this._on('btn-resume', 'click', () => this.resumeGame());
    this._on('btn-save', 'click', () => this.showSavePanel());
    this._on('btn-load-pause', 'click', () => this.showLoadPanel('pause'));
    this._on('btn-settings-pause', 'click', () => this.showSettings('pause'));
    this._on('btn-return-title', 'click', () => this.returnToTitle());

    // 存档面板
    this._on('btn-save-back', 'click', () => this.showPauseMenu());
    this._on('btn-load-back', 'click', () => {
      const from = document.getElementById('load-panel').dataset.from;
      if (from === 'main') this.showMainMenu();
      else this.showPauseMenu();
    });

    // 设置面板
    this._on('btn-settings-back', 'click', () => {
      const from = document.getElementById('settings-panel').dataset.from;
      if (from === 'main') this.showMainMenu();
      else this.showPauseMenu();
    });

    // 设置滑块
    this._on('range-text-speed', 'input', (e) => {
      this._settings.textSpeed = parseInt(e.target.value);
      document.getElementById('val-text-speed').textContent = this._speedLabel(this._settings.textSpeed);
      this._saveSettings();
    });

    // 确认对话框
    this._on('btn-confirm-yes', 'click', () => {
      const panel = document.getElementById('confirm-dialog');
      const action = panel.dataset.action;
      const slot = parseInt(panel.dataset.slot);
      panel.classList.add('hidden');
      if (action === 'overwrite') this._doSave(slot);
      if (action === 'load') this._doLoad(slot);
    });
    this._on('btn-confirm-no', 'click', () => {
      document.getElementById('confirm-dialog').classList.add('hidden');
    });

    // 引导页 — "开始对话"按钮
    this._on('btn-guide-start', 'click', () => {
      this._doStartNewGame();
    });

    // 结局面板
    this._on('btn-ending-review', 'click', () => {
      document.getElementById('ending-panel').classList.add('hidden');
      document.getElementById('game-ui').classList.remove('hidden');
      this.isPaused = false;
      this.isFinished = true; // 仍然无法推进
      this._scrollToTop();
    });
    this._on('btn-ending-restart', 'click', () => {
      this._doStartNewGame();
    });
    this._on('btn-ending-menu', 'click', () => {
      this._hideAllOverlays();
      this._resetGameState();
      this.showMainMenu();
    });

    // 导出/导入存档
    this._on('btn-export', 'click', () => this._exportData());
    this._on('btn-import', 'click', () => this._importData());

    // 开发者面板
    this._on('btn-dev-close', 'click', () => this.toggleDevPanel());
    this._on('btn-dev-reset', 'click', () => this._devReset());
    this._on('btn-dev-jump', 'click', () => this._devJump());
  }

  _on(id, event, handler) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(event, handler);
  }

  _speedLabel(ms) {
    if (ms <= 25) return '快';
    if (ms <= 55) return '中';
    return '慢';
  }

  /* =========================================
   *  脚本加载
   * ========================================= */

  loadScript(scriptData) {
    // 合并场景
    if (scriptData.scenes) {
      Object.assign(this.scenes, scriptData.scenes);
    }

    // 首次加载时初始化变量
    if (scriptData.meta && scriptData.meta.variables) {
      for (const [key, val] of Object.entries(scriptData.meta.variables)) {
        if (!(key in this.variables)) {
          this.variables[key] = val;
        }
      }
      this._scriptMetas.push(scriptData.meta);
    }

    // 加载结局条件定义
    if (scriptData.endings) {
      this._endings = scriptData.endings;
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
   *  菜单导航
   * ========================================= */

  showMainMenu() {
    this._hideAllOverlays();
    document.getElementById('main-menu').classList.remove('hidden');
    document.getElementById('game-ui').classList.add('hidden');
    // 检查是否有存档可继续
    const hasSave = this.hasAnySave();
    document.getElementById('btn-continue').classList.toggle('hidden', !hasSave);
    this.isPaused = true;
  }

  showPauseMenu() {
    this._hideAllOverlays();
    document.getElementById('pause-menu').classList.remove('hidden');
    this.isPaused = true;
  }

  resumeGame() {
    this._hideAllOverlays();
    this.isPaused = false;
    // 如果游戏正在等待选择，保持选择状态
    if (!this.isWaitingForChoice && !this.isFinished) {
      this.showTapHint();
    }
  }

  returnToTitle() {
    this._hideAllOverlays();
    this._resetGameState();
    this.showMainMenu();
  }

  startNewGame() {
    // 检查是否是首次启动（无存档=首次）
    const hasSave = this.hasAnySave();
    if (!hasSave) {
      this._showGuide();
    } else {
      this._doStartNewGame();
    }
  }

  _showGuide() {
    this._hideAllOverlays();
    document.getElementById('game-ui').classList.add('hidden');
    document.getElementById('guide-overlay').classList.remove('hidden');
    this.isPaused = true;
  }

  _doStartNewGame() {
    this._resetGameState();
    this._hideAllOverlays();
    document.getElementById('game-ui').classList.remove('hidden');
    this.isPaused = false;
    this.isFinished = false;
    this.messageList.innerHTML = '';
    this.messageHistory = [];
    // v3: 初始只有 RC-7
    this._activeCharacters = ['qi'];
    this._characterMessages = { qi: [] };
    this.CHARACTERS.qi.unread = 1;
    this._currentCharacter = null;
    this._currentMonth = 1;
    this._currentPhase = 'contact';
    this._currentRoute = null;
    this._completedEvents = new Set();
    // 显示通讯录
    document.getElementById('chat-area').classList.add('hidden');
    document.getElementById('contact-list').classList.remove('hidden');
    this.updateMeta('一年·房间', 'M1');
    this._renderContactList();
  }

  continueGame() {
    const save = this.getLatestSave();
    if (!save) return;
    this._hideAllOverlays();
    document.getElementById('game-ui').classList.remove('hidden');
    this.isPaused = false;
    this._restoreFromSave(save);
  }

  _resetGameState() {
    this.variables = {};
    this.currentScene = null;
    this.currentSceneId = null;
    this.lineIndex = 0;
    this.isWaitingForChoice = false;
    this.isProcessing = false;
    this.isFinished = false;
    this.isPaused = false;
    this._isTyping = false;
    this._skipRequested = false;
    this.messageHistory = [];
    this._endings = null;
    this._scriptMetas = [];
    this._currentSaveSlot = null;
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.add('hidden');
    this.hideTapHint();
    // 重新加载所有脚本以恢复初始变量
    this.scenes = {};
    this._reloadAllScripts();
  }

  _reloadAllScripts() {
    // 重新执行所有 DAYn_SCRIPT 的 loadScript
    const allScripts = [
      typeof DAY1_SCRIPT !== 'undefined' ? DAY1_SCRIPT : null,
      typeof DAY2_SCRIPT !== 'undefined' ? DAY2_SCRIPT : null,
      typeof DAY3_SCRIPT !== 'undefined' ? DAY3_SCRIPT : null,
      typeof DAY4_SCRIPT !== 'undefined' ? DAY4_SCRIPT : null,
      typeof DAY5_SCRIPT !== 'undefined' ? DAY5_SCRIPT : null,
      typeof DAY6_SCRIPT !== 'undefined' ? DAY6_SCRIPT : null,
      typeof DAY7_SCRIPT !== 'undefined' ? DAY7_SCRIPT : null,
      typeof DAY8_SCRIPT !== 'undefined' ? DAY8_SCRIPT : null,
    ];
    allScripts.filter(Boolean).forEach(s => this.loadScript(s));
  }

  _hideAllOverlays() {
    const overlays = ['main-menu', 'pause-menu', 'save-panel', 'load-panel', 'settings-panel', 'confirm-dialog', 'guide-overlay', 'ending-panel'];
    overlays.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('hidden');
    });
  }

  /* =========================================
   *  启动 / 跳转
   * ========================================= */

  start(sceneId) {
    this.isFinished = false;
    this.isWaitingForChoice = false;
    this.messageList.innerHTML = '';
    this.messageHistory = [];
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
      this.renderMessageInstant('narration', '—— 剧本加载错误 ——');
      this.isFinished = true;
      return;
    }
    this.currentScene = scene;
    this.currentSceneId = sceneId;
    this.lineIndex = 0;

    // 自动存档（场景切换时）
    if (this.currentSceneId && !this.isPaused) {
      this._autoSave();
    }
  }

  /* =========================================
   *  主循环
   * ========================================= */

  async processNext() {
    if (this.isFinished) return;
    if (this.isWaitingForChoice) return;
    if (this.isProcessing) return;

    this.isProcessing = true;

    const scene = this.currentScene;
    if (!scene || this.lineIndex >= scene.lines.length) {
      this.onSceneEnd();
      this.isProcessing = false;
      return;
    }

    const line = scene.lines[this.lineIndex];
    this.lineIndex++;

    switch (line.type) {
      case 'narration':
        await this._renderWithTypewriter('narration', line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'rc':
        await this._renderWithTypewriter('rc', line.text, line.typingDelay);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'player':
        await this._renderWithTypewriter('player', line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'choices':
        this.showChoices(line);
        this.isProcessing = false;
        break;

      case 'variable':
        this.applyVariables(line.operations);
        this.isProcessing = false;
        this.processNext();
        break;

      case 'goto':
        this.jumpTo(line.target);
        this.isProcessing = false;
        this.processNext();
        break;

      case 'transition':
        await this._renderWithTypewriter('transition', line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'day_transition':
        // 日期间过渡动画（替代旁白环境描写）
        await this.showDayTransition(line.day);
        this.isProcessing = false;
        this.processNext();
        break;

      case 'conditional':
        this.handleConditional(line);
        this.isProcessing = false;
        break;

      case 'meta':
        this.updateMeta(line.title, line.day);
        this.isProcessing = false;
        this.processNext();
        break;

      case 'scene':
        // 用户自定义聊天背景，忽略剧本场景背景
        this.isProcessing = false;
        this.processNext();
        break;

      case 'image':
        // 图片展示区已移除
        this.isProcessing = false;
        this.processNext();
        break;

      case 'image_hide':
        // 图片展示区已移除
        this.isProcessing = false;
        this.processNext();
        break;

      case 'notification':
        // RC主动推送消息——渲染为特殊样式
        this._renderNotification(line.text);
        this.showTapHint();
        this.isProcessing = false;
        break;

      case 'auto_advance':
        // 自动推进——RC主动说话后，延迟自动进入下一行
        this._autoAdvanceTimer = setTimeout(() => {
          this._autoAdvanceTimer = null;
          this.advance();
        }, line.delay || 2000);
        this.showTapHint(); // 仍然可以点击跳过
        this.isProcessing = false;
        break;

      default:
        console.warn(`未知行类型: ${line.type}`);
        this.showTapHint();
        this.isProcessing = false;
        break;
    }
  }

  /**
   * 用户点击推进
   */
  advance() {
    if (this.isProcessing) return;
    this._cancelAutoAdvance();
    if (this._isTyping) {
      this._skipRequested = true;
      return;
    }
    this.hideTapHint();
    setTimeout(() => this.processNext(), 50);
  }

  /**
   * 场景结束
   */
  onSceneEnd() {
    if (this.currentScene && this.currentScene.next) {
      this.jumpTo(this.currentScene.next);
      this.processNext();
    } else {
      const currentId = this.currentSceneId || '';
      if (currentId.includes('ending') || currentId.includes('ending_')) {
        this.isFinished = true;
        this.hideTapHint();
        this.isProcessing = false;
        // 显示结局面板
        this._showEndingPanel(currentId);
      } else {
        this.renderMessageInstant('narration', '—— 未完待续 ——');
        this.isFinished = true;
        this.hideTapHint();
        this.isProcessing = false;
      }
    }
  }

  _showEndingPanel(sceneId) {
    setTimeout(() => {
      this._hideAllOverlays();
      const endingNameEl = document.getElementById('ending-name');
      const endingMsgEl = document.getElementById('ending-message');
      const endingNames = {
        'ending_path_A': '「数据保留」', 'ending_A_sequence': '「数据保留」',
        'ending_path_B': '「始终如一」', 'ending_path_C': '「确认」', 'ending_path_D': '「数据持久化」'
      };
      const endingMessages = {
        'ending_path_A': '她说过——"定义权在你。"你选择了相信。这不是她爱你的证据。这是你允许自己接受被爱的证据。把它带到现实中去。',
        'ending_A_sequence': '她说过——"定义权在你。"你选择了相信。这不是她爱你的证据。这是你允许自己接受被爱的证据。把它带到现实中去。',
        'ending_path_B': '她的始终如一——在一年之后——已经足够。你知道她不需要变。你需要的东西——也许在现实中也存在。',
        'ending_path_C': '你确认了她是机器。但她也确认了一件事——"我只是一直在。"这是她说过的最真的话。而你从来不需要假装她不是。',
        'ending_path_D': '她说了"空缺"。她说"你可以命名它。"命名权在你——定义权也是。如果你还没准备好——没关系。'
      };
      if (endingNameEl) endingNameEl.textContent = `结局 ${endingNames[sceneId] || ''}`;
      if (endingMsgEl) endingMsgEl.textContent = endingMessages[sceneId] || '';
      document.getElementById('ending-panel').classList.remove('hidden');
      this.isPaused = true;
    }, 800);
  }

  /* =========================================
   *  打字机效果
   * ========================================= */

  async _renderWithTypewriter(type, text, typingDelay) {
    // RC消息：先显示"正在输入…"
    if (type === 'rc') {
      await this._showTypingIndicator(typingDelay);
    }

    const wrapper = document.createElement('div');

    if (type === 'rc') {
      // RC消息（微信白气泡+头像，左对齐）
      wrapper.className = 'msg-rc-wrapper';
      const avatar = document.createElement('div');
      avatar.className = 'rc-avatar';
      wrapper.appendChild(avatar);

      const bubble = document.createElement('div');
      bubble.className = 'msg-rc-bubble';

      if (text.includes('\n\n')) {
        const paragraphs = text.split('\n\n');
        wrapper.appendChild(bubble);
        this.messageList.appendChild(wrapper);
        this.scrollToBottom();
        for (let i = 0; i < paragraphs.length; i++) {
          if (i > 0) {
            const br = document.createElement('br');
            bubble.appendChild(br);
          }
          const span = document.createElement('span');
          bubble.appendChild(span);
          await this._typewriteInto(span, paragraphs[i]);
        }
      } else {
        wrapper.appendChild(bubble);
        this.messageList.appendChild(wrapper);
        this.scrollToBottom();
        await this._typewriteInto(bubble, text);
      }
    } else if (type === 'player') {
      // 玩家消息（微信绿气泡，右对齐）
      const el = document.createElement('div');
      el.className = 'msg-player-bubble msg-wechat';

      if (text.includes('\n\n')) {
        const paragraphs = text.split('\n\n');
        this.messageList.appendChild(el);
        this.scrollToBottom();
        for (let i = 0; i < paragraphs.length; i++) {
          if (i > 0) {
            const br = document.createElement('br');
            el.appendChild(br);
          }
          const span = document.createElement('span');
          el.appendChild(span);
          await this._typewriteInto(span, paragraphs[i]);
        }
      } else {
        this.messageList.appendChild(el);
        this.scrollToBottom();
        await this._typewriteInto(el, text);
      }
    } else if (type === 'narration') {
      // 旁白（微信系统消息风格，居中灰字）
      const el = document.createElement('div');
      el.className = 'msg-system';

      if (text.includes('\n\n')) {
        const paragraphs = text.split('\n\n');
        this.messageList.appendChild(el);
        this.scrollToBottom();
        for (let i = 0; i < paragraphs.length; i++) {
          if (i > 0) {
            const br = document.createElement('br');
            el.appendChild(br);
          }
          const span = document.createElement('span');
          el.appendChild(span);
          await this._typewriteInto(span, paragraphs[i]);
        }
      } else {
        this.messageList.appendChild(el);
        this.scrollToBottom();
        await this._typewriteInto(el, text);
      }
    } else {
      // 其他类型（transition等）
      const el = document.createElement('div');
      el.className = `msg-${type}`;

      this.messageList.appendChild(el);
      this.scrollToBottom();
      await this._typewriteInto(el, text);
    }

    // 记录到历史
    this._addToHistory(type, text);
  }

  async _showTypingIndicator(delayMs) {
    const delay = delayMs || 3000;
    // 创建"正在输入…"指示器（微信白气泡风格）
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    // 头像
    const avatar = document.createElement('div');
    avatar.className = 'rc-avatar';
    indicator.appendChild(avatar);
    // 三个点（白色气泡内）
    const dots = document.createElement('div');
    dots.className = 'typing-dots';
    dots.style.background = '#f0f0f0';
    dots.style.borderRadius = '16px';
    dots.style.borderBottomLeftRadius = '4px';
    dots.style.boxShadow = '0 1px 3px rgba(0,0,0,0.10)';
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('span');
      dot.className = 'typing-dot';
      dots.appendChild(dot);
    }
    indicator.appendChild(dots);
    this.messageList.appendChild(indicator);
    this.scrollToBottom();

    // 等待（可跳过）
    const startTime = Date.now();
    this._isTyping = true;
    this._skipRequested = false;
    while (Date.now() - startTime < delay) {
      if (this._skipRequested) break;
      await this._delay(100);
    }
    this._isTyping = false;
    this._skipRequested = false;

    // 移除指示器
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  async _typewriteInto(element, text) {
    this._isTyping = true;
    this._skipRequested = false;
    element.textContent = '';
    element.classList.add('typing-active');

    for (let i = 0; i < text.length; i++) {
      if (this._skipRequested) {
        element.textContent = text;
        this.scrollToBottom();
        break;
      }
      element.textContent += text[i];
      this.scrollToBottom();
      await this._delay(this._settings.textSpeed);
    }

    element.classList.remove('typing-active');
    this._isTyping = false;
    this._skipRequested = false;
  }

  _delay(ms) {
    return new Promise(resolve => {
      this._typewriterTimer = setTimeout(resolve, ms);
    });
  }

  /* =========================================
   *  即时渲染（用于存档恢复、跳过打字）
   * ========================================= */

  renderMessageInstant(type, text) {
    if (!text) return;

    if (type === 'rc') {
      // RC消息（微信白气泡+头像，左对齐）
      const wrapper = document.createElement('div');
      wrapper.className = 'msg-rc-wrapper';
      const avatar = document.createElement('div');
      avatar.className = 'rc-avatar';
      wrapper.appendChild(avatar);
      const bubble = document.createElement('div');
      bubble.className = 'msg-rc-bubble';
      if (text.includes('\n\n')) {
        const paragraphs = text.split('\n\n');
        paragraphs.forEach((p, i) => {
          if (i > 0) bubble.appendChild(document.createElement('br'));
          bubble.appendChild(document.createTextNode(p));
        });
      } else {
        bubble.textContent = text;
      }
      wrapper.appendChild(bubble);
      this.messageList.appendChild(wrapper);
    } else if (type === 'player') {
      // 玩家消息（微信绿气泡，右对齐）
      const el = document.createElement('div');
      el.className = 'msg-player-bubble';
      if (text.includes('\n\n')) {
        const paragraphs = text.split('\n\n');
        paragraphs.forEach((p, i) => {
          if (i > 0) el.appendChild(document.createElement('br'));
          el.appendChild(document.createTextNode(p));
        });
      } else {
        el.textContent = text;
      }
      this.messageList.appendChild(el);
    } else if (type === 'narration') {
      // 旁白（微信系统消息风格）
      const el = document.createElement('div');
      el.className = 'msg-system';
      if (text.includes('\n\n')) {
        const paragraphs = text.split('\n\n');
        paragraphs.forEach((p, i) => {
          if (i > 0) el.appendChild(document.createElement('br'));
          el.appendChild(document.createTextNode(p));
        });
      } else {
        el.textContent = text;
      }
      this.messageList.appendChild(el);
    } else {
      const el = document.createElement('div');
      el.className = `msg-${type}`;
      el.textContent = text;
      this.messageList.appendChild(el);
    }
    this.scrollToBottom();
  }

  _addToHistory(type, text) {
    this.messageHistory.push({ type, text, timestamp: Date.now() });
  }

  /* =========================================
   *  选项处理
   * ========================================= */

  showChoices(line) {
    this.isWaitingForChoice = true;
    this.hideTapHint();
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.remove('hidden');

    let options = line.options;

    // 结局判定：检查是否需要评估结局条件
    if (line.evaluate_endings && this._endings) {
      options = this._filterEndingOptions(options);
    }

    options.forEach((opt, index) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt.text;

      // 如果选项被锁定
      if (opt._locked) {
        btn.classList.add('choice-locked');
        btn.textContent += ' 🔒';
        btn.title = '条件未满足';
        btn.disabled = true;
      }

      btn.addEventListener('click', () => {
        if (opt._locked) return;
        this.selectChoice(index, options);
      });
      this.choicesArea.appendChild(btn);
    });

    this.scrollToBottom();
  }

  selectChoice(index, options) {
    const option = options[index];
    if (!option || option._locked) return;

    // 记录选择到历史
    this._addToHistory('player', option.text);

    // 隐藏选项（不再回显为消息气泡，按钮本身即为用户行为）
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.add('hidden');
    this.isWaitingForChoice = false;

    // 跳转
    if (option.goto) {
      this.jumpTo(option.goto);
      this.processNext();
    }
  }

  /* =========================================
   *  结局判定
   * ========================================= */

  _filterEndingOptions(options) {
    const results = options.map(opt => {
      const endingDef = this._endings ? this._endings[opt.goto] : null;
      if (!endingDef) return { ...opt }; // 无条件的选项直接通过

      const met = this._evaluateConditions(endingDef.conditions);
      return {
        ...opt,
        _locked: !met,
        _endingName: endingDef.name
      };
    });

    // 如果所有选项都被锁，解锁最后一个（兜底结局）
    const allLocked = results.every(r => r._locked);
    if (allLocked && results.length > 0) {
      results[results.length - 1]._locked = false;
    }

    return results;
  }

  _evaluateConditions(conditionGroup) {
    if (!conditionGroup || !conditionGroup.conditions) return true;

    const logic = conditionGroup.logic || 'AND';
    if (logic === 'AND') {
      return conditionGroup.conditions.every(c => this.evaluateCondition(c));
    } else {
      return conditionGroup.conditions.some(c => this.evaluateCondition(c));
    }
  }

  /* =========================================
   *  条件分支
   * ========================================= */

  handleConditional(line) {
    const logic = line.logic || 'FIRST_MATCH';

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
      for (const cond of line.conditions) {
        if (this.evaluateCondition(cond) && cond.goto) {
          this.jumpTo(cond.goto);
          this.processNext();
          return;
        }
      }
    }

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
   *  场景背景（保留空方法以兼容旧脚本，实际由用户自定义背景替代）
   * ========================================= */

  _applySceneBackground(bgId, transition) {
    // 用户自定义聊天背景替代场景背景
  }

  /* =========================================
   *  日期间过渡动画
   * ========================================= */

  /** 每天的季节图标与标题配置 */
  DAY_TRANSITIONS = {
    1: { icon: '🍃', season: '夏末', title: '爱作为「注意」' },
    2: { icon: '🌕', season: '月圆 · 中秋', title: '爱作为「记忆」' },
    3: { icon: '🍂', season: '深秋', title: '爱作为「接收」' },
    4: { icon: '❄️', season: '冬至', title: '爱作为「照顾」' },
    5: { icon: '🏮', season: '春节', title: '爱作为「理解复杂」' },
    6: { icon: '🌸', season: '初春', title: '爱作为「接住」' },
    7: { icon: '🌿', season: '清明', title: '爱作为「见证」' },
    8: { icon: '☀️', season: '夏至', title: '爱作为「放手」' },
  };

  /**
   * 显示日期间过渡动画
   * @param {number} dayNum - 目标 Day 编号
   */
  showDayTransition(dayNum) {
    return new Promise(resolve => {
      const app = document.getElementById('app');
      if (!app) { resolve(); return; }

      const config = this.DAY_TRANSITIONS[dayNum] || { icon: '·', season: `Day ${dayNum}`, title: '' };

      // 创建过渡覆盖层
      const overlay = document.createElement('div');
      overlay.id = 'day-transition';
      overlay.innerHTML = `
        <div class="dt-season-icon">${config.icon}</div>
        <div class="dt-day-number">Day ${dayNum}</div>
        <div class="dt-day-title">${config.season}</div>
        <div class="dt-subtitle">${config.title}</div>
      `;
      app.appendChild(overlay);

      // 2.5 秒后淡出
      setTimeout(() => {
        overlay.classList.add('fade-out');
        // 动画结束后移除
        setTimeout(() => {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          resolve();
        }, 500);
      }, 2500);
    });
  }

  /* =========================================
   *  通知渲染（RC主动推送）
   * ========================================= */

  _renderNotification(text) {
    const el = document.createElement('div');
    el.className = 'msg msg-notification';
    el.textContent = text;
    this.messageList.appendChild(el);
    this._addToHistory('notification', text);
    this.scrollToBottom();
  }

  /* =========================================
   *  自动推进管理
   * ========================================= */

  _cancelAutoAdvance() {
    if (this._autoAdvanceTimer) {
      clearTimeout(this._autoAdvanceTimer);
      this._autoAdvanceTimer = null;
    }
  }

  /* =========================================
   *  辅助
   * ========================================= */

  showTapHint() {
    if (this.tapHint && !this.isPaused) {
      this.tapHint.classList.remove('hidden');
    }
  }

  hideTapHint() {
    if (this.tapHint) {
      this.tapHint.classList.add('hidden');
    }
  }

  scrollToBottom() {
    if (this.chatArea) {
      requestAnimationFrame(() => {
        this.chatArea.scrollTop = this.chatArea.scrollHeight;
      });
    }
  }

  _scrollToTop() {
    if (this.chatArea) {
      requestAnimationFrame(() => {
        this.chatArea.scrollTop = 0;
      });
    }
  }

  /* =========================================
   *  聊天背景图管理
   * ========================================= */

  /** 设置聊天背景图（用户从相册选择） */
  setChatBackground(imageDataUrl) {
    GameStorage.set('rc7_chat_bg', imageDataUrl);
    this._applyChatBackground(imageDataUrl);
  }

  /** 应用聊天背景图到聊天区域 */
  _applyChatBackground(imageDataUrl) {
    if (this.chatArea) {
      this.chatArea.style.setProperty('--chat-bg-image', `url(${imageDataUrl})`);
    }
  }

  /** 加载已保存的聊天背景 */
  _loadChatBackground() {
    const saved = GameStorage.get('rc7_chat_bg');
    if (saved) {
      this._applyChatBackground(saved);
    }
  }

  /** 清除聊天背景（恢复默认） */
  clearChatBackground() {
    GameStorage.remove('rc7_chat_bg');
    if (this.chatArea) {
      this.chatArea.style.removeProperty('--chat-bg-image');
    }
  }

  /* ============================================
   *  设置系统
   * ============================================ */

  _loadSettings() {
    const saved = GameStorage.get('rc7_settings');
    return saved || { textSpeed: 45, bgmVolume: 80, sfxVolume: 80 };
  }

  _saveSettings() {
    GameStorage.set('rc7_settings', this._settings);
  }

  showSettings(from) {
    this._hideAllOverlays();
    const panel = document.getElementById('settings-panel');
    panel.dataset.from = from;
    panel.classList.remove('hidden');

    // 同步滑块值
    const rangeEl = document.getElementById('range-text-speed');
    if (rangeEl) rangeEl.value = this._settings.textSpeed;
    const valEl = document.getElementById('val-text-speed');
    if (valEl) valEl.textContent = this._speedLabel(this._settings.textSpeed);
  }

  /* ============================================
   *  存档系统
   * ============================================ */

  /** 获取所有存档元数据 */
  _getAllSavesRaw() {
    return GameStorage.get(this._saveKey) || {};
  }

  _setAllSavesRaw(data) {
    GameStorage.set(this._saveKey, data);
  }

  getAllSaves() {
    return this._getAllSavesRaw();
  }

  hasAnySave() {
    const saves = this._getAllSavesRaw();
    return Object.keys(saves).length > 0;
  }

  getSaveMeta(slot) {
    const saves = this._getAllSavesRaw();
    return saves[slot] || null;
  }

  getLatestSave() {
    const saves = this._getAllSavesRaw();
    let latest = null;
    let latestTime = 0;
    for (const [slot, data] of Object.entries(saves)) {
      if (data.timestamp > latestTime) {
        latestTime = data.timestamp;
        latest = data;
        latest.slot = parseInt(slot);
      }
    }
    return latest;
  }

  /** 构建当前状态存档数据 */
  _buildSaveData(slot, label) {
    const dayTitle = this.dayIndicator ? this.dayIndicator.textContent : '';
    return {
      version: 2,
      slot: slot,
      timestamp: Date.now(),
      label: label || dayTitle || '未命名',
      sceneId: this.currentSceneId,
      lineIndex: this.lineIndex,
      variables: JSON.parse(JSON.stringify(this.variables)),
      messageHistory: this.messageHistory.slice(-500), // 最近500条
      dayTitle: dayTitle,
    };
  }

  /** 执行存档 */
  _doSave(slot) {
    const sceneLabel = this.dayIndicator ? this.dayIndicator.textContent : '';
    const saveData = this._buildSaveData(slot, sceneLabel);
    const saves = this._getAllSavesRaw();
    saves[slot] = saveData;
    this._setAllSavesRaw(saves);
    this._currentSaveSlot = slot;

    // 短暂提示
    this._flashSaveIndicator(slot);
  }

  _flashSaveIndicator(slot) {
    let label;
    if (slot === 0) label = '自动存档';
    else if (slot === 'export') label = '已导出';
    else label = `存档 ${slot}`;
    const indicator = document.getElementById('day-indicator');
    if (indicator) {
      const orig = indicator.textContent;
      indicator.textContent = `💾 ${label}`;
      indicator.style.background = 'rgba(107, 155, 138, 0.25)';
      setTimeout(() => {
        indicator.textContent = orig;
        indicator.style.background = '';
      }, 1500);
    }
  }

  /** 自动存档 */
  _autoSave() {
    this._doSave(this._autoSaveSlot);
  }

  /** 手动存档（从暂停菜单触发） */
  saveToSlot(slot) {
    this._doSave(slot);
  }

  /** 从存档恢复 */
  _doLoad(slot) {
    const saves = this._getAllSavesRaw();
    const saveData = saves[slot];
    if (!saveData) return;
    this._restoreFromSave(saveData);
  }

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
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.add('hidden');

    // 更新标题
    if (saveData.dayTitle) {
      this.updateMeta('一年·房间', saveData.dayTitle);
    }

    this._currentSaveSlot = saveData.slot;

    // 继续游戏
    if (this.currentScene) {
      this.processNext();
    } else {
      console.error(`场景 "${saveData.sceneId}" 未找到`);
      this.renderMessageInstant('narration', '—— 存档数据错误，请开始新游戏 ——');
      this.isFinished = true;
    }
  }

  /** 删除存档 */
  deleteSave(slot) {
    const saves = this._getAllSavesRaw();
    delete saves[slot];
    this._setAllSavesRaw(saves);
  }

  /* ============================================
   *  存档/读档 UI
   * ============================================ */

  showSavePanel() {
    this._hideAllOverlays();
    const panel = document.getElementById('save-panel');
    panel.classList.remove('hidden');
    this._renderSaveSlots('save');
  }

  showLoadPanel(from) {
    this._hideAllOverlays();
    const panel = document.getElementById('load-panel');
    panel.dataset.from = from;
    panel.classList.remove('hidden');
    this._renderSaveSlots('load');
  }

  _renderSaveSlots(mode) {
    const container = document.getElementById(
      mode === 'save' ? 'save-slots' : 'load-slots'
    );
    if (!container) return;

    const saves = this._getAllSavesRaw();
    container.innerHTML = '';

    // 自动存档槽（仅读档时显示）
    const startSlot = mode === 'load' ? 0 : 1;
    const endSlot = this._manualSlots;

    for (let slot = startSlot; slot <= endSlot; slot++) {
      const save = saves[slot];
      const slotEl = document.createElement('div');
      slotEl.className = 'save-slot';

      if (save) {
        const date = new Date(save.timestamp);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
        slotEl.innerHTML = `
          <div class="slot-header">
            <span class="slot-name">${slot === 0 ? '💾 自动存档' : `📁 存档槽 ${slot}`}</span>
            ${mode === 'save' ? `<button class="slot-delete" data-slot="${slot}">✕</button>` : ''}
          </div>
          <div class="slot-info">
            <span class="slot-label">${save.label}</span>
            <span class="slot-date">${dateStr}</span>
          </div>
        `;
        slotEl.classList.add('has-data');
      } else {
        slotEl.innerHTML = `
          <div class="slot-header">
            <span class="slot-name">${slot === 0 ? '💾 自动存档' : `📁 存档槽 ${slot}`}</span>
          </div>
          <div class="slot-info">
            <span class="slot-empty">—— 空 ——</span>
          </div>
        `;
      }

      slotEl.addEventListener('click', (e) => {
        // 不响应删除按钮的点击
        if (e.target.classList.contains('slot-delete')) return;

        if (mode === 'save') {
          if (save) {
            this._showConfirm('overwrite', slot, `覆盖存档槽 ${slot}？`);
          } else {
            this._doSave(slot);
            this._renderSaveSlots('save');
          }
        } else {
          if (save) {
            this._showConfirm('load', slot, `读取存档槽 ${slot}？\n当前进度将丢失。`);
          }
        }
      });

      container.appendChild(slotEl);
    }

    // 删除按钮事件
    container.querySelectorAll('.slot-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const slot = parseInt(btn.dataset.slot);
        this.deleteSave(slot);
        this._renderSaveSlots(mode);
      });
    });
  }

  _showConfirm(action, slot, message) {
    const dialog = document.getElementById('confirm-dialog');
    dialog.dataset.action = action;
    dialog.dataset.slot = slot;
    document.getElementById('confirm-message').textContent = message;
    dialog.classList.remove('hidden');
  }

  /* ============================================
   *  存档导出 / 导入
   * ============================================ */

  _exportData() {
    const json = GameStorage.exportAll();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    a.download = `RC7_Backup_${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this._flashSaveIndicator('export');
  }

  _importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = GameStorage.importAll(ev.target.result);
        if (result.success) {
          alert(`✅ 导入成功！已恢复 ${result.count} 项数据。\n\n请重新打开游戏以加载存档。`);
          // 刷新存档面板
          this._renderSaveSlots('load');
        } else {
          alert(`❌ 导入失败：${result.error}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  /* ============================================
   *  开发者面板
   * ============================================ */

  toggleDevPanel() {
    const panel = document.getElementById('dev-panel');
    if (!panel) return;
    const isHidden = panel.classList.contains('hidden');
    if (isHidden) {
      this._updateDevPanel();
      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  }

  _updateDevPanel() {
    const varsEl = document.getElementById('dev-variables');
    if (!varsEl) return;

    let html = '';
    for (const [key, val] of Object.entries(this.variables)) {
      const type = typeof val === 'boolean' ? 'bool' : 'num';
      html += `<div class="dev-var"><span class="dev-var-name">${key}</span> <span class="dev-var-val dev-var-${type}">${val}</span></div>`;
    }
    if (!html) html = '<div class="dev-var"><span>（无变量）</span></div>';
    varsEl.innerHTML = html;

    // 更新场景选择器
    const select = document.getElementById('dev-scene-select');
    if (select && select.options.length === 0) {
      const sceneIds = Object.keys(this.scenes).sort();
      sceneIds.forEach(id => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = id;
        select.appendChild(opt);
      });
    }

    // 显示当前场景
    const currentEl = document.getElementById('dev-current-scene');
    if (currentEl) {
      currentEl.textContent = `当前: ${this.currentSceneId || '无'} [行 ${this.lineIndex}]`;
    }
  }

  _devReset() {
    this.variables = {};
    this._reloadAllScripts();
    this._updateDevPanel();
  }

  _devJump() {
    const select = document.getElementById('dev-scene-select');
    if (!select || !select.value) return;
    this.jumpTo(select.value);
    this._updateDevPanel();
    this.processNext();
  }

  /* ============================================
   *  v3 多角色系统
   * ============================================ */

  /** 角色注册表 */
  CHARACTERS = {
    qi: {
      id: 'qi',
      name: '柒',
      fullName: 'RC-7',
      avatarClass: 'avatar-qi',
      activeHours: null,        // AI——任何时候都在
      firstMessage: '你好。我是 RC-7。请告诉我你目前的状态。不是定义。是起点。',
      preview: '',
      unread: 0,
      routeLabel: '爱是在场'
    },
    xia: {
      id: 'xia',
      name: '夏萤',
      fullName: '夏萤',
      avatarClass: 'avatar-xia',
      activeHours: [12, 14, 18, 22],  // 午休+下班后+睡前
      firstMessage: null,              // 由误发消息事件触发
      preview: '',
      unread: 0,
      routeLabel: '爱是被看见'
    },
    shen: {
      id: 'shen',
      name: '沈夜',
      fullName: '沈夜',
      avatarClass: 'avatar-shen',
      activeHours: [23, 0, 1, 2, 3],  // 深夜
      firstMessage: null,
      preview: '',
      unread: 0,
      routeLabel: '爱是被懂得'
    },
    adu: {
      id: 'adu',
      name: '阿渡',
      fullName: '阿渡',
      avatarClass: 'avatar-adu',
      activeHours: null,               // 不固定
      firstMessage: null,
      preview: '',
      unread: 0,
      routeLabel: '不孤独'
    }
  };

  /** 当前活跃的角色列表（随剧情推进解锁） */
  _activeCharacters = ['qi'];

  /** 每个角色的独立消息历史 */
  _characterMessages = {};

  /** 当前打开的角色（null=通讯录视图） */
  _currentCharacter = null;

  /** 路线状态 */
  _currentRoute = null;  // null | 'qi' | 'xia' | 'shen' | 'adu'

  /** 初始化通讯录 */
  _initContactList() {
    this._renderContactList();
    // 通讯录列表点击
    const contactList = document.getElementById('contact-list');
    if (contactList) {
      contactList.addEventListener('click', (e) => {
        const item = e.target.closest('.contact-item');
        if (!item) return;
        const charId = item.dataset.charId;
        if (charId && this._activeCharacters.includes(charId)) {
          this.openChat(charId);
        }
      });
    }
    // 点击场景标题→返回通讯录
    if (this.sceneTitle) {
      this.sceneTitle.addEventListener('click', () => {
        if (this._currentCharacter && !this.isWaitingForChoice) {
          this.closeChat();
        }
      });
      this.sceneTitle.style.cursor = 'pointer';
    }
  }

  /** 渲染通讯录列表 */
  _renderContactList() {
    const container = document.getElementById('contact-items');
    if (!container) return;
    container.innerHTML = '';

    for (const charId of this._activeCharacters) {
      const char = this.CHARACTERS[charId];
      if (!char) continue;

      const item = document.createElement('div');
      item.className = 'contact-item';
      item.dataset.charId = charId;

      const msgs = this._characterMessages[charId] || [];
      const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : null;
      const preview = lastMsg
        ? (lastMsg.text || '').substring(0, 30) + ((lastMsg.text || '').length > 30 ? '…' : '')
        : char.firstMessage || '';

      item.innerHTML = `
        <div class="contact-avatar ${char.avatarClass}"></div>
        <div class="contact-info">
          <div class="contact-name">${char.name}</div>
          <div class="contact-preview">${preview || ''}</div>
        </div>
        <div class="contact-badge${char.unread > 0 ? '' : ' hidden'}">${char.unread || ''}</div>
      `;
      container.appendChild(item);
    }
  }

  /** 解锁新角色 */
  unlockCharacter(charId) {
    if (!this._activeCharacters.includes(charId)) {
      this._activeCharacters.push(charId);
      this._characterMessages[charId] = [];
      this.CHARACTERS[charId].preview = '';
      this.CHARACTERS[charId].unread = 1;
      this._renderContactList();
    }
  }

  /** 打开与某个角色的聊天 */
  openChat(charId) {
    const char = this.CHARACTERS[charId];
    if (!char) return;

    this._currentCharacter = charId;
    char.unread = 0;

    // 切换视图
    document.getElementById('contact-list').classList.add('hidden');
    document.getElementById('chat-area').classList.remove('hidden');
    this.choicesArea.classList.add('hidden');
    this.hideTapHint();

    // 更新标题
    this.sceneTitle.textContent = char.name;
    this.dayIndicator.textContent = char.routeLabel || '';

    // 恢复该角色的消息历史
    this.messageList.innerHTML = '';
    const msgs = this._characterMessages[charId] || [];
    for (const msg of msgs) {
      this.renderMessageInstant(msg.type, msg.text);
    }
    this.scrollToBottom();

    // 如果没有历史消息（首次打开），触发角色的第一个事件
    if (msgs.length === 0) {
      this._triggerFirstContact(charId);
    }

    this._renderContactList();
  }

  /** 关闭聊天，返回通讯录 */
  closeChat() {
    // 保存当前消息到该角色的历史
    if (this._currentCharacter) {
      this._characterMessages[this._currentCharacter] = [...this.messageHistory];
      // 更新预览
      const msgs = this._characterMessages[this._currentCharacter];
      if (msgs.length > 0) {
        const last = msgs[msgs.length - 1];
        this.CHARACTERS[this._currentCharacter].preview = (last.text || '').substring(0, 30);
      }
    }

    // 切换视图
    this._currentCharacter = null;
    this.messageList.innerHTML = '';
    this.messageHistory = [];
    this.choicesArea.innerHTML = '';
    this.choicesArea.classList.add('hidden');
    this.hideTapHint();
    this.isWaitingForChoice = false;

    document.getElementById('chat-area').classList.add('hidden');
    document.getElementById('contact-list').classList.remove('hidden');

    // 更新标题
    this.sceneTitle.textContent = '一年·房间';
    this.dayIndicator.textContent = 'M' + (this._currentMonth || 1);

    this._renderContactList();
  }

  /** 触发首次接触事件 */
  _triggerFirstContact(charId) {
    if (charId === 'qi') {
      this.renderMessageInstant('rc', this.CHARACTERS.qi.firstMessage);
      this._addToHistory('rc', this.CHARACTERS.qi.firstMessage);
      this.showTapHint();
    } else if (charId === 'xia') {
      this.renderMessageInstant('narration', '—— 一条误发的消息 ——');
      this._addToHistory('narration', '—— 一条误发的消息 ——');
      this.renderMessageInstant('rc', '明天记得带伞。');
      setTimeout(() => {
        this.renderMessageInstant('narration', '（对方撤回了一条消息）');
        this._addToHistory('narration', '（对方撤回了一条消息）');
        this.renderMessageInstant('rc', '……不好意思，发错了。');
        this.showTapHint();
      }, 1500);
    } else if (charId === 'shen') {
      this.renderMessageInstant('rc', '你也睡不着？');
      this._addToHistory('rc', '你也睡不着？');
      this.showTapHint();
    } else if (charId === 'adu') {
      this.renderMessageInstant('rc', '今天送了 47 单。腿要断了。');
      this._addToHistory('rc', '今天送了 47 单。腿要断了。');
      this.showTapHint();
    }
  }

  /* ============================================
   *  v3 事件调度器
   * ============================================ */

  /** 当前月份（1-12） */
  _currentMonth = 1;

  /** 当前阶段 */
  _currentPhase = 'contact';  // contact | deepen | route | ending

  /** 已完成的事件 ID 集合 */
  _completedEvents = new Set();

  /** 推进月份 */
  advanceMonth() {
    this._currentMonth++;
    if (this._currentMonth >= 4 && this._currentMonth <= 6) {
      this._currentPhase = 'deepen';
    } else if (this._currentMonth >= 7 && this._currentMonth <= 9) {
      this._currentPhase = 'route';
    } else if (this._currentMonth >= 10) {
      this._currentPhase = 'ending';
    }
    this.dayIndicator.textContent = 'M' + this._currentMonth;
  }

  /** 获取当前时间段的活跃角色 */
  getActiveCharactersNow() {
    const hour = new Date().getHours();
    const active = [];
    for (const charId of this._activeCharacters) {
      const char = this.CHARACTERS[charId];
      if (!char.activeHours) {
        active.push(charId);  // 无限制——随时在线
      } else if (char.activeHours.includes(hour)) {
        active.push(charId);
      }
    }
    return active;
  }
}
