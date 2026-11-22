/* Gentle-nudge service worker: shows the pushed note, opens the app on tap. */
self.addEventListener("push", (event) => {
  let data = { title: "Navigator", body: "A quiet note from your navigator.", url: "/" };
  try { data = { ...data, ...event.data.json() }; } catch (e) { /* default */ }
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: data.url },
    })
  );
});
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
});
