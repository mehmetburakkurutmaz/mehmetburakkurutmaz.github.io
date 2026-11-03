/* Cross-origin isolation for static hosting (written by tool/build_web.dart). */
if (typeof window === 'undefined') {
  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
  self.addEventListener('fetch', (e) => {
    const r = e.request;
    if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
    // Media goes straight to the network: re-making a no-cors request drops
    // its Range header, and Safari plays <video> only from 206 range
    // responses. Same-origin media needs no headers to load under COEP.
    if (r.destination === 'video' || r.destination === 'audio' ||
        r.headers.has('range')) return;
    const request = r.mode === 'no-cors'
      ? new Request(r, { credentials: 'omit' })
      : r;
    e.respondWith(fetch(request).then((res) => {
      if (res.status === 0) return res;
      const headers = new Headers(res.headers);
      headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
      headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
      return new Response(res.body, {
        status: res.status, statusText: res.statusText, headers,
      });
    }).catch((err) => console.error(err)));
  });
} else if (!window.crossOriginIsolated && window.isSecureContext &&
    'serviceWorker' in navigator) {
  navigator.serviceWorker.register(document.currentScript.src).then((reg) => {
    if (reg.active && !navigator.serviceWorker.controller) {
      window.location.reload();
    } else {
      reg.addEventListener('updatefound', () => {
        reg.installing.addEventListener('statechange', (ev) => {
          if (ev.target.state === 'activated') window.location.reload();
        });
      });
    }
  });
}
