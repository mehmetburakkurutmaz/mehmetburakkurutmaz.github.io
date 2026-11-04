/* The page's service worker (written by tool/build_web.dart). */
const COI = true;
if (typeof window === 'undefined') {
  // Every file of this build but the page: its content hash.
  const FILES = {"assets/AssetManifest.bin":"fbe87f36b09a81fc","assets/AssetManifest.bin.json":"1a9c18cdaf33d227","assets/FontManifest.json":"0da54d3b29ecf351","assets/NOTICES":"e1fa79a0af587324","assets/assets/anim/birthday_banner.json":"e5dd3e8d5cc6021c","assets/assets/anim/broken_heart.json":"b0a63ee5be112e31","assets/assets/anim/trophy.json":"4728721dc078b2ea","assets/assets/anim/word_garden_intro.json":"fe17eefb2b3d18b1","assets/assets/dev/daisy_lives_tilt.json":"d61a42deadc7d604","assets/assets/dev/wordle_intro.json":"451348acc4af39b5","assets/assets/fonts/Bangers/Bangers-Regular.ttf":"2124de4c12c9f385","assets/assets/fonts/Bangers/bangerscyrillic.otf":"8ef70316ea4d7577","assets/assets/fonts/Caveat_Brush/CaveatBrush-Regular.ttf":"97f75a31e8fb0397","assets/assets/fonts/Fraunces/Fraunces9pt-SemiBoldItalic.ttf":"766338466a1f5c8d","assets/assets/fonts/GameIcons/GameIcons.ttf":"acf938a67d2e70be","assets/assets/fonts/Marker_Felt/MarkerFelt-Regular.ttf":"8e925c188a1d700d","assets/assets/fonts/Marker_Felt/generated/MarkerFeltCap66.ttf":"3df7d76c8d92d114","assets/assets/fonts/Marker_Notes/MarkerNotes-Regular.ttf":"1aa637f529ba4f8d","assets/assets/fonts/Permanent_Marker/PermanentMarker-Regular.ttf":"7421092dc142bc16","assets/assets/fonts/Titan_One/TitanOne-Regular.ttf":"8878e0df81eadfaa","assets/assets/images/.DS_Store":"87e1fcea920c0116","assets/assets/images/menu-logo.png":"dffd2baa0cff7bb4","assets/assets/music/a_horse_with_no_name.ogg":"aa29748921941725","assets/assets/music/adem_ile_havva.ogg":"9c241f304ab4416b","assets/assets/music/alba.ogg":"fee2774bff228e79","assets/assets/music/all_of_me.ogg":"c4fb22ac783243b8","assets/assets/music/amelie.ogg":"6f4dea8c8ddcb957","assets/assets/music/bana_ellerini_ver.ogg":"ede35aee6bc49fa7","assets/assets/music/bella_ciao.ogg":"1d76dce731bbcc62","assets/assets/music/ben_seni_cok_sevdim.ogg":"b8908a1f00369f24","assets/assets/music/benimle_evlenir_misin.ogg":"d5a4fe91def40130","assets/assets/music/cennet.ogg":"12b80054d62a8566","assets/assets/music/chubina.ogg":"df216867e14c26af","assets/assets/music/colder_heavens.ogg":"26869a03598dcf03","assets/assets/music/drama_koprusu.ogg":"3c95991e9956ad2d","assets/assets/music/ebruli.ogg":"bc9cb247009704e0","assets/assets/music/etretat.ogg":"73c3901471affb17","assets/assets/music/experience.ogg":"cccf23ce65ab3c70","assets/assets/music/eylul.ogg":"6babe602198f4cba","assets/assets/music/fly.ogg":"454040f444706daf","assets/assets/music/lana.ogg":"5d9006558085ed37","assets/assets/music/love_her_for_we.ogg":"710571704fdccef4","assets/assets/music/qafe_khix.ogg":"c1521c56347b0d8e","assets/assets/music/sail_on_the_roof.ogg":"0266d577364e8e72","assets/assets/music/seco_geliyor.ogg":"b896c6807e5d9df3","assets/assets/music/sen_bilmezsin.ogg":"54441b2e154d0d53","assets/assets/music/serenade.ogg":"82a6af018bde6bfb","assets/assets/music/silasara.ogg":"55c346b90aeb9f61","assets/assets/music/soundwaves_of_gold.ogg":"d4e4cdbdbd6a9110","assets/assets/music/sunshine.ogg":"58edfbfcc483d73d","assets/assets/music/uara_uda.ogg":"ef643f334ecff7b4","assets/assets/music/una_mattina.ogg":"ead88672af210f20","assets/assets/music/valse.ogg":"ebfa84bb5ee1eeb8","assets/assets/sfx/button1.wav":"392879d9691f3a0b","assets/assets/sfx/button2.wav":"0e34b1af052497a9","assets/assets/sfx/clear.wav":"0f4d23ca814c29b5","assets/assets/sfx/click.wav":"29558d23c8b9fe39","assets/assets/sfx/delete.wav":"6cdc94ea33f4a1ec","assets/assets/sfx/erase.wav":"d96ff0386a1708c9","assets/assets/sfx/flip.wav":"c400b7b6a2e9addd","assets/assets/sfx/fresh_start.wav":"11dbe71600bf57b9","assets/assets/sfx/hint.wav":"5aaa2e670e22147a","assets/assets/sfx/keyboard1.wav":"592a23cf141c460c","assets/assets/sfx/keyboard2.wav":"91dcbdefa8f86946","assets/assets/sfx/lost.wav":"cc5c3c1db9742dcb","assets/assets/sfx/off.wav":"775dff0bae3df8c5","assets/assets/sfx/on.wav":"775dff0bae3df8c5","assets/assets/sfx/placement.wav":"97837b7dc1b24cd3","assets/assets/sfx/restore_1.wav":"e0566ce18f036cba","assets/assets/sfx/restore_2.wav":"e49a8631dbaa427b","assets/assets/sfx/restore_3.wav":"039fc83186dfe897","assets/assets/sfx/restore_4.wav":"349767d5e8bb00f9","assets/assets/sfx/restore_5.wav":"0424538a58d01135","assets/assets/sfx/revive.wav":"444d3badceecd615","assets/assets/sfx/select1.wav":"25c18cb6cec831a7","assets/assets/sfx/select2.wav":"a80174815960517d","assets/assets/sfx/spin.wav":"a6b0c1cfbfacd533","assets/assets/sfx/transition1.wav":"fccef08e5364032e","assets/assets/sfx/transition2.wav":"af07eb0f6ea82672","assets/assets/sfx/win1.wav":"06ada99a60dbefee","assets/assets/sfx/win2.wav":"b3268fb3b1c91f0e","assets/assets/sfx/wrong.wav":"39d378891544134f","assets/assets/video/.DS_Store":"441d5e2ef84a297d","assets/fonts/MaterialIcons-Regular.otf":"6944bf75d1c55a8f","assets/packages/media_kit/assets/web/hls1.4.10.js":"e123b76a9c67dc48","assets/packages/wakelock_plus/assets/no_sleep.js":"e1bf515c0b86df8e","assets/shaders/ink_sparkle.frag":"3430f38b1a5d3417","assets/shaders/stretch_effect.frag":"f64a027f8c91b486","canvaskit/canvaskit.js":"da29ab7502fb232f","canvaskit/canvaskit.wasm":"045b4d19c48b07b4","canvaskit/chromium/canvaskit.js":"2edfe8ac01266999","canvaskit/chromium/canvaskit.wasm":"9eb7cdb47aac0d6b","canvaskit/experimental_webparagraph/canvaskit.js":"65250e56d1f03a0f","canvaskit/experimental_webparagraph/canvaskit.wasm":"1c8bdcf40a769a65","canvaskit/skwasm.js":"d13a23b3d397165b","canvaskit/skwasm.wasm":"df1a1140ddec6726","canvaskit/skwasm_heavy.js":"70da9fb891f444e6","canvaskit/skwasm_heavy.wasm":"379f1bd2b46e4a2d","canvaskit/webparagraph/canvaskit.js":"bf3601a632236e8a","canvaskit/webparagraph/canvaskit.wasm":"faa6b14c751ff3af","canvaskit/wimp.js":"3da36f7911dca9eb","canvaskit/wimp.wasm":"baf705c886542a6a","favicon.png":"53fdd47a84b08168","flutter.js":"6022a54d22c52b35","flutter_bootstrap.js":"efa979ba889aea20","icons/Icon-192.png":"636da831b27fa74d","icons/Icon-512.png":"c05b21bce40e7a1e","icons/Icon-maskable-192.png":"636da831b27fa74d","icons/Icon-maskable-512.png":"c05b21bce40e7a1e","main.dart.js":"1799f94d1c151485","main.dart.mjs":"21fd64b1ca725552","main.dart.wasm":"03521c7f46ba6961","manifest.json":"da91b87d8c0ab114","splash/img/branding-1x.png":"44560c220872ccf8","splash/img/branding-2x.png":"47cb72b911ed0cc2","splash/img/branding-3x.png":"e0997b2cf2cbec58","splash/img/branding-4x.png":"28fdb4fc4e31d50e","splash/img/branding-dark-1x.png":"44560c220872ccf8","splash/img/branding-dark-2x.png":"47cb72b911ed0cc2","splash/img/branding-dark-3x.png":"e0997b2cf2cbec58","splash/img/branding-dark-4x.png":"28fdb4fc4e31d50e","splash/img/dark-1x.png":"41f33a1f7176792d","splash/img/dark-2x.png":"1e648962d82a8802","splash/img/dark-3x.png":"a9a792fe57e69cb5","splash/img/dark-4x.png":"f0eb11c5fb088777","splash/img/light-1x.png":"41f33a1f7176792d","splash/img/light-2x.png":"1e648962d82a8802","splash/img/light-3x.png":"a9a792fe57e69cb5","splash/img/light-4x.png":"f0eb11c5fb088777","version.json":"d3b2e9e45ea28635"};
  const CACHE = 'files';
  const scope = new URL(self.registration.scope);
  const keyOf = (path) => new URL(path + '?v=' + FILES[path], scope).href;

  self.addEventListener('install', () => self.skipWaiting());
  self.addEventListener('activate', (e) => e.waitUntil((async () => {
    await self.clients.claim();
    const current = new Set(Object.keys(FILES).map(keyOf));
    const cache = await caches.open(CACHE);
    for (const request of await cache.keys()) {
      if (!current.has(request.url)) await cache.delete(request);
    }
  })()));

  self.addEventListener('fetch', (e) => {
    const r = e.request;
    if (r.cache === 'only-if-cached' && r.mode !== 'same-origin') return;
    // Media goes straight to the network: re-making a no-cors request drops
    // its Range header, and Safari plays <video> only from 206 range
    // responses. Same-origin media needs no headers to load under COEP.
    if (r.destination === 'video' || r.destination === 'audio' ||
        r.headers.has('range')) return;
    const url = new URL(r.url);
    const path = r.method === 'GET' && url.origin === scope.origin &&
        url.pathname.startsWith(scope.pathname)
      ? decodeURIComponent(url.pathname.slice(scope.pathname.length))
      : null;
    const kept = path !== null && Object.hasOwn(FILES, path);
    if (!kept && !COI) return;
    const request = r.mode === 'no-cors'
      ? new Request(r, { credentials: 'omit' })
      : r;
    e.respondWith((kept ? fromCache(e, path, request) : fetch(request))
      .then(isolate)
      .catch((err) => {
        console.error(err);
        return Response.error();
      }));
  });

  async function fromCache(e, path, request) {
    const cache = await caches.open(CACHE);
    const key = keyOf(path);
    const hit = await cache.match(key);
    if (hit) return hit;
    const res = await fetch(request, { cache: 'no-cache' });
    if (res.status === 200) e.waitUntil(cache.put(key, res.clone()));
    return res;
  }

  function isolate(res) {
    if (!COI || res.status === 0) return res;
    const headers = new Headers(res.headers);
    headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    return new Response(res.body, {
      status: res.status, statusText: res.statusText, headers,
    });
  }
} else if (window.isSecureContext && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register(document.currentScript.src).then((reg) => {
    // Isolation needs the worker in control of the page: reload once it is.
    if (!COI || window.crossOriginIsolated) return;
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
