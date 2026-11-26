// Retires the old Hugo site's cache-first service worker. It deletes every cache,
// unregisters itself and reloads open tabs so they show the new site.
// There is deliberately no fetch handler, and the new site never registers this file.
// Do not delete before December 2027: visitors can return at any time.

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(retire());
});

async function retire() {
  const names = await caches.keys();
  await Promise.all(names.map((name) => caches.delete(name)));
  await self.registration.unregister();
  // The old worker always left caches behind. With none, there is nothing stale
  // to replace, and not reloading makes a reload loop impossible.
  if (names.length === 0) return;
  const tabs = await self.clients.matchAll({ type: "window" });
  // Not awaited: a navigation can wait for activation to finish.
  for (const tab of tabs) tab.navigate(tab.url).catch(() => {});
}
