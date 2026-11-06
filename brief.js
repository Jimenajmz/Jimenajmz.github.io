// Two small behaviours. Both are optional: without them the pages still work.
// 1. Gallery tag filter: click tags to show the posts that carry ANY of the chosen tags.
//    A link like /art/?tag=illustration pre-selects a tag.
// 2. Media viewer: on a post with several pictures or videos, show one at a time with
//    previous and next buttons, the arrow keys, or a swipe on a phone. Also used for the About me photos.
(function () {
  var filters = document.querySelector('[data-filters]');
  if (filters) {
    var chips = Array.prototype.slice.call(filters.querySelectorAll('.chip'));
    var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));
    var empty = document.querySelector('[data-empty]');
    function apply() {
      var on = chips.filter(function (c) { return c.dataset.tag && c.classList.contains('is-on'); }).map(function (c) { return c.dataset.tag; });
      var shown = 0;
      tiles.forEach(function (t) {
        var tags = (t.dataset.tags || '').split('|');
        var show = on.length === 0 || on.some(function (tag) { return tags.indexOf(tag) !== -1; });
        t.classList.toggle('is-hidden', !show);
        if (show) shown += 1;
      });
      chips[0].classList.toggle('is-on', on.length === 0);
      if (empty) empty.hidden = shown !== 0;
    }
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (!chip.dataset.tag) { chips.forEach(function (c) { c.classList.remove('is-on'); }); }
        else { chip.classList.toggle('is-on'); }
        apply();
      });
    });
    var wanted = new URLSearchParams(window.location.search).get('tag');
    if (wanted) {
      chips.forEach(function (c) { if (c.dataset.tag === wanted.toLowerCase()) c.classList.add('is-on'); });
    }
    apply();
  }

  document.querySelectorAll('[data-viewer]').forEach(function (viewer) {
    var items = Array.prototype.slice.call(viewer.querySelectorAll('.viewer-item'));
    if (items.length < 2) return;
    var index = 0;
    var count = viewer.querySelector('[data-count]');
    function show(i) {
      index = (i + items.length) % items.length;
      items.forEach(function (el, n) { el.classList.toggle('is-current', n === index); });
      if (count) count.textContent = (index + 1) + ' / ' + items.length;
    }
    viewer.classList.add('is-js');
    viewer.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1); });
    viewer.querySelector('[data-next]').addEventListener('click', function () { show(index + 1); });
    var startX = null, startY = null;
    viewer.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { startX = null; return; }
      startX = e.touches[0].clientX; startY = e.touches[0].clientY;
    }, { passive: true });
    viewer.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX, dy = e.changedTouches[0].clientY - startY;
      startX = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) show(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });
    viewer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    show(0);
  });
})();
