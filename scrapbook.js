// Star rain for the scrapbook pages, after Jimena's main.js
// (the effect comes from https://codepen.io/StarKnightt/pen/eYxXxaR).
// Stars are removed once they have fallen, so the page never fills up.
(function () {
  var sky = document.getElementById('snow-container');
  if (!sky) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Mostly small stars, now and then a big one (her rule).
  function size() {
    var s = Math.random() * 96 + 4;
    return s > 12 && Math.random() < 0.997 ? size() : s;
  }
  function star() {
    var e = document.createElement('div');
    e.className = 'star';
    e.style.left = Math.random() * window.innerWidth + 'px';
    e.style.fontSize = size() + 'px';
    e.style.animationDuration = 3 + Math.random() * 3 + 's';
    sky.appendChild(e);
    setTimeout(function () { if (e.parentNode === sky) sky.removeChild(e); }, 6500);
  }
  setInterval(star, 200);
})();
