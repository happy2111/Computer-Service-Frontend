// public/service-worker.js
self.addEventListener('push', function(event) {
  const options = event.data.json();
  event.waitUntil(
    self.registration.showNotification(options.title, {
      body: options.body,
      icon: '/logo.PNG' // Путь к иконке уведомления
    })
  );
});