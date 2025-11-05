// service-worker.js
const CACHE_NAME = 'calculator-v1';
const urlsToCache = [
  //'/', // ルートパス（index.html）
  './'
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  // アイコンファイルが用意できたら追加してください
   './icon-192.png', 
   './icon-512.png'
];

// インストール: アプリのファイルをキャッシュする
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      // キャッシュが完了したら、新しいService Workerをすぐにアクティブ化
      .then(() => self.skipWaiting())
  );
});

// アクティベート: 古いキャッシュを削除する
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // クライアントにService Workerが制御できるようにする
  return self.clients.claim();
});

// フェッチ: キャッシュからリソースを提供し、オフライン動作を可能にする
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // キャッシュにあればそれを使う
        if (response) {
          return response;
        }
        // なければネットワークから取得
        return fetch(event.request);
      })
  );

});
