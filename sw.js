const CACHE_NAME = 'mahu-labour-manager-v3.0.1';
const APP_FILES = ['./', './index.html', './manifest.webmanifest', './mahu-logo.jpg'];
self.addEventListener('install', event => event.waitUntil((async()=>{const c=await caches.open(CACHE_NAME);await c.addAll(APP_FILES);await self.skipWaiting()})()));
self.addEventListener('activate', event => event.waitUntil((async()=>{const names=await caches.keys();await Promise.all(names.filter(n=>n!==CACHE_NAME).map(n=>caches.delete(n)));await self.clients.claim()})()));
self.addEventListener('fetch', event => {
 const req=event.request;if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'||new URL(req.url).pathname.endsWith('/index.html')){
  event.respondWith((async()=>{const c=await caches.open(CACHE_NAME);try{const r=await fetch(req,{cache:'no-store'});if(r.ok)await c.put('./index.html',r.clone());return r}catch(e){return (await c.match('./index.html'))||(await c.match('./'))}})());return;
 }
 event.respondWith((async()=>{const c=await caches.open(CACHE_NAME);const hit=await c.match(req);if(hit)return hit;try{const r=await fetch(req);if(r.ok)await c.put(req,r.clone());return r}catch(e){return Response.error()}})());
});
