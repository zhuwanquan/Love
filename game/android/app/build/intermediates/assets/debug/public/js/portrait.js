/**
 * Portrait Manager — 画框状态管理器
 * 管理角色形象展示区的五种状态：静待/聆听/回应/关怀/深度
 */
const PortraitManager = {
  _base: null,
  _light: null,
  _bg: null,
  _currentState: 'portrait-state-idle',

  init() {
    this._base = document.getElementById('portrait-base');
    this._light = document.getElementById('amber-light');
    this._bg = document.getElementById('portrait-bg');
  },

  setState(stateClass) {
    if (!this._base) return;
    this._base.classList.remove(this._currentState);
    this._base.classList.add(stateClass);
    this._currentState = stateClass;
  },

  /** 玩家开始输入 → 聆听 */
  onPlayerTyping() { this.setState('portrait-state-listening'); },

  /** RC 开始生成回应 → 回应 */
  onRCGenerating() { this.setState('portrait-state-responding'); },

  /** 消息到达 → 回到静待 */
  onMessageArrived() { this.setState('portrait-state-idle'); },

  /** TCP 关怀触发 → 关怀（30s后回静待） */
  onCaring() {
    this.setState('portrait-state-caring');
    setTimeout(() => this.setState('portrait-state-idle'), 30000);
  },

  /** 重场戏 → 深度 */
  onDeepMoment() { this.setState('portrait-state-deep'); },

  /** 切换节点日背景 */
  setDayBackground(day) {
    if (!this._bg) return;
    this._bg.className = `portrait-bg bg-day${day}`;
  },

  /** 结局A灯光闪烁 */
  triggerEndingGlow() {
    if (!this._light) return;
    this._light.style.animation = 'none';
    void this._light.offsetHeight;
    this._light.style.boxShadow = '0 0 16px rgba(200,150,100,0.5), 0 0 40px rgba(200,150,100,0.2)';
    this._light.style.opacity = '1';
    setTimeout(() => {
      this._light.style.animation = 'amber-breathe 4.5s ease-in-out infinite';
      this._light.style.boxShadow = '';
      this._light.style.opacity = '';
    }, 7000);
  }
};
