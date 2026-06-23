/**
 * Service Worker — 「一年·房间」离线支持
 *
 * 策略：Cache-first（缓存优先）
 * - 首次加载后全部文件缓存到本地
 * - 之后完全离线可玩，秒开
 * - 有新版本时后台静默更新
 */

const CACHE_NAME = 'rc-7-v1';
const ASSETS = [
  './',
  'index.html',
  'css/style.css',
  'js/engine.js',
  'data/day1.js',
  'data/day2.js',
  'data/day3.js',
  'data/day4.js',
  'data/day5.js',
  'data/day6.js',
  'data/day7.js',
  'data/day8.js',
  'manifest.json'
];

// 安装：预缓存所有文件
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

// 请求：缓存优先，网络兜底
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      // 命中缓存 → 直接返回；同时在后台更新缓存
      const fetched = fetch(event.request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => null);

      return cached || fetched;
    })
  );
});
