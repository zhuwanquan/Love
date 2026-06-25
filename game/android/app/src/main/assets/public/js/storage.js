/**
 * RC-7 存储适配层
 *
 * - WebView（Capacitor 打包后）：localStorage 天然持久化，不会丢
 * - 浏览器开发：localStorage + 手动导出/导入备份
 * - 预留 Capacitor Filesystem API 接口（Capacitor.isNative 时启用双写）
 *
 * 使用：
 *   GameStorage.get('rc7_saves')    // 替代 localStorage.getItem
 *   GameStorage.set('rc7_saves', d) // 替代 localStorage.setItem
 *   GameStorage.exportAll()          // 导出全部数据为 JSON 字符串
 *   GameStorage.importAll(json)      // 从 JSON 字符串导入全部数据
 */

const GameStorage = (() => {
  const PREFIX = 'rc7_';

  /** 检测是否在 Capacitor 原生环境中 */
  function _isCapacitorNative() {
    try {
      const C = window.Capacitor || window.capacitorExports;
      return !!(C && C.isNativePlatform && C.isNativePlatform());
    } catch (e) {
      return false;
    }
  }

  /** 获取 Capacitor Filesystem 插件引用 */
  function _getCapFS() {
    try {
      const C = window.Capacitor || window.capacitorExports;
      if (C && C.Plugins && C.Plugins.Filesystem) {
        return C.Plugins.Filesystem;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /** 异步写入 Capacitor Filesystem（备份用途，fire-and-forget） */
  async function _capWriteBackup(key, data) {
    try {
      const FS = _getCapFS();
      if (!FS) return;
      const Enc = window.capacitorFilesystem?.FilesystemEncoding;
      await FS.writeFile({
        path: `${key}.json`,
        data: JSON.stringify(data),
        directory: (window.capacitorFilesystem?.FilesystemDirectory || window.capacitorFilesystem?.Directory)?.Data || 'DATA',
        encoding: Enc?.UTF8,
        recursive: true,
      });
    } catch (e) {
      // 静默失败，localStorage 是主存储
      console.debug('Capacitor FS backup skipped:', e.message);
    }
  }

  // ── 公开 API ──

  return {
    /** 同步读取 */
    get(key) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    /** 同步写入，自动尝试 Capacitor FS 备份 */
    set(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
        // Capacitor 原生环境：异步备份到系统文件
        if (_isCapacitorNative()) {
          _capWriteBackup(key, data).catch(() => {});
        }
      } catch (e) {
        console.warn('存储写入失败:', e);
      }
    },

    /** 删除 */
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) { /* ignore */ }
    },

    /** 是否在 Capacitor 原生 APP 中运行 */
    isNativeApp() {
      return _isCapacitorNative();
    },

    /** 导出所有 RC-7 数据 */
    exportAll() {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX)) {
          try {
            data[key] = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            data[key] = localStorage.getItem(key);
          }
        }
      }
      return JSON.stringify({
        version: 1,
        exportedAt: Date.now(),
        app: '一年·房间 RC-7',
        data,
      }, null, 2);
    },

    /** 导入数据 */
    importAll(jsonStr) {
      let parsed;
      try {
        parsed = JSON.parse(jsonStr);
      } catch (e) {
        return { success: false, error: 'JSON 解析失败' };
      }
      if (!parsed.data || typeof parsed.data !== 'object') {
        return { success: false, error: '无效的存档文件格式' };
      }
      let count = 0;
      for (const [key, value] of Object.entries(parsed.data)) {
        if (key.startsWith(PREFIX)) {
          localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
          count++;
        }
      }
      return { success: true, count };
    },

    /** 估算已用存储大小 */
    getUsage() {
      let bytes = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(PREFIX)) {
          bytes += key.length * 2;
          bytes += (localStorage.getItem(key) || '').length * 2;
        }
      }
      const kb = (bytes / 1024).toFixed(1);
      const mb = (bytes / (1024 * 1024)).toFixed(1);
      return bytes > 1024 * 1024 ? `${mb} MB` : `${kb} KB`;
    },
  };
})();
