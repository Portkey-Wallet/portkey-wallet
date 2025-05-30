(() => {
  const script = document.createElement('script');
  script.src = './js/popup.js';
  script.addEventListener('load', () => {
    const root = document.getElementById('root');
    if (root) {
      root.style.height = 'auto';
      root.style.width = 'auto';
    }
  });
  const timer = setTimeout(() => {
    clearTimeout(timer);
    document.body.appendChild(script);
  }, 10);
})();
