self.addEventListener('install', (event) => {
  console.log('Service worker installing...');
});

self.addEventListener('fetch', (event) => {
  // Cache logic bisa ditambah di sini
});