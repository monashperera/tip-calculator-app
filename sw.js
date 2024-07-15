self.addEventListener("install", e => {
    e.waitUntil(
        caches.open("static").then(cache => {
            return cache.addAll(["./", 
                                "./index.html", 
                                "./assets/css/bootstrap-grid.min.css",
                                "./assets/css/style.css",
                                "./assets/js/app.js",
                                "./assets/images/favicon-32x32.png",
                                "./assets/images/logo.svg", 
                                "./assets/images/icon-person.svg",
                                "./assets/images/icon-dollar.svg"]);
        })
    );
});
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
})