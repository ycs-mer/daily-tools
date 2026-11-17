const C='wtd-v4';
const A=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('wtd-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
  const html=q.mode==='navigate'||(q.headers.get('accept')||'').includes('text/html');
  if(html){e.respondWith((async()=>{try{const r=await Promise.race([fetch(q.url,{cache:'no-store'}),new Promise((_,j)=>setTimeout(j,4000))]);
      if(r&&r.ok){const cp=r.clone();caches.open(C).then(c=>c.put('index.html',cp))}return r}
    catch(x){return (await caches.match('index.html'))||(await caches.match('./'))||Response.error()}})());return}
  e.respondWith(caches.match(q,{ignoreSearch:true}).then(hit=>{
    const net=fetch(q).then(r=>{if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp))}return r}).catch(()=>hit);
    return hit||net}))});
