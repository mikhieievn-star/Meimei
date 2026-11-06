// Офлайн-кэш Мей Мей Merge. Меняй версию, если хочешь принудительно сбросить кэш.
const CACHE='meimei-v16a';
const CORE=['./','./index.html','./manifest.webmanifest','./IMG_1078.png','./IMG_1079.png','./IMG_1080.png'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
// Сначала кэш (быстро и офлайн), в фоне обновляем — новая версия появится при следующем открытии.
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(res=>{ if(res&&res.ok) c.put(r,res.clone()); return res; }).catch(()=>null);
    return hit||(await net)||new Response('',{status:504});
  }));
});
