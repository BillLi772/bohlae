/* =============================================================
   bohlae.com — Main JavaScript (Redesigned)
   ============================================================= */

/* ── Mobile Projects dropdown toggle ─────────────────────── */
(function () {
  var dropdown = document.querySelector('.nav-dropdown');
  var label = document.querySelector('.nav-dropdown-label');
  if (!dropdown || !label) return;

  label.addEventListener('click', function (e) {
    if (window.innerWidth > 768) return;
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });

  document.addEventListener('click', function () {
    dropdown.classList.remove('open');
  });
})();

/* ── Gallery auto-advance (single image, 6 s) ────────────── */
(function () {
  var slides  = document.querySelectorAll('.gallery-slide');
  var caption = document.getElementById('gallery-caption');
  if (!slides.length) return;

  var current = 0;
  var timer;

  // Retry loading a failed image once after 1 second
  function retryOnError(img) {
    if (img._retried) return;
    img._retried = true;
    var src = img.src;
    setTimeout(function () {
      img.src = '';
      img.src = src;
    }, 1000);
  }

  // Preload the next image in sequence using an Image() object
  function preloadNext() {
    var nextIdx = ((current + 1) % slides.length + slides.length) % slides.length;
    var nextImg = slides[nextIdx].querySelector('img');
    if (nextImg && !nextImg._preloaded) {
      var loader = new Image();
      loader.src = nextImg.src;
      nextImg._preloaded = true;
    }
  }

  // Attach error handlers to all gallery images
  slides.forEach(function (slide) {
    var img = slide.querySelector('img');
    if (img) {
      img.addEventListener('error', function () { retryOnError(img); });
    }
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (caption) caption.textContent = slides[current].dataset.caption || '';
    preloadNext();
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 6000);
  }

  if (caption && slides[0]) {
    caption.textContent = slides[0].dataset.caption || '';
  }

  preloadNext();
  startTimer();
})();


/* ── Masonry layout for thumbnails ────────────────────────── */
(function () {
  var grid = document.querySelector('.thumbnails-grid');
  if (!grid) return;

  var COL_COUNT = 4;
  var GAP = window.innerWidth <= 768 ? 12 : 32;
  var resizeTimer;
  // Pare thumbnails are CSS-fixed to 280px regardless of image load state
  var isPareGrid = grid.classList.contains('thumbnails-grid--pare');

  // Compute item height from intrinsic width/height attributes.
  // Pare: cap portrait images at 280px; landscape uses natural ratio.
  function getItemHeight(item, colWidth) {
    var img = item.querySelector('img');
    if (img) {
      var natW = parseInt(img.getAttribute('width'))  || img.naturalWidth  || 0;
      var natH = parseInt(img.getAttribute('height')) || img.naturalHeight || 0;
      if (natW && natH) {
        var h = Math.round((natH / natW) * colWidth);
        if (isPareGrid && h > 280) h = 280;
        return h;
      }
    }
    return item.offsetHeight || 200;
  }

  function layoutMasonry() {
    // Skip if the grid is hidden (no width yet)
    if (!grid.clientWidth) return;

    var items = grid.querySelectorAll('.thumb-item');
    if (!items.length) return;

    var gridWidth = grid.clientWidth;
    var paddingLeft = parseFloat(getComputedStyle(grid).paddingLeft) || 0;
    var paddingRight = parseFloat(getComputedStyle(grid).paddingRight) || 0;
    var paddingTop  = parseFloat(getComputedStyle(grid).paddingTop)  || 0;
    var availableWidth = gridWidth - paddingLeft - paddingRight;

    var cols = window.innerWidth <= 768 ? 2 : COL_COUNT;
    var gap = window.innerWidth <= 768 ? 12 : 32;
    var colWidth = (availableWidth - gap * (cols - 1)) / cols;
    var colHeights = [];
    for (var c = 0; c < cols; c++) colHeights.push(0);

    items.forEach(function (item) {
      var itemHeight = getItemHeight(item, colWidth);

      var minH = colHeights[0];
      var minCol = 0;
      for (var c = 1; c < cols; c++) {
        if (colHeights[c] < minH) { minH = colHeights[c]; minCol = c; }
      }

      item.style.position = 'absolute';
      item.style.left  = (paddingLeft + minCol * (colWidth + gap)) + 'px';
      item.style.top   = (paddingTop  + colHeights[minCol]) + 'px';
      item.style.width = colWidth + 'px';

      colHeights[minCol] += itemHeight + gap;
    });

    var maxH = 0;
    for (var c = 0; c < cols; c++) {
      if (colHeights[c] > maxH) maxH = colHeights[c];
    }
    grid.style.height = (paddingTop + maxH) + 'px';
  }

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layoutMasonry, 150);
  });

  // Expose for view-switch activation
  window._layoutMasonry = layoutMasonry;
})();


/* ── View switching + fixed sidebar ─────────────────────────── */
(function () {
  var sidebar = document.querySelector('.project-sidebar');
  var links = document.querySelectorAll('[data-view]');
  var views = document.querySelectorAll('.view');
  if (!links.length || !sidebar) return;

  // Lock sidebar top once: align to the first gallery image's top edge,
  // then never recalculate regardless of view switches or content changes.
  function lockSidebar() {
    var slide = document.querySelector('.gallery-slide.active') || document.querySelector('.gallery-slide');
    if (slide) {
      var img = slide.querySelector('img');
      if (img && img.complete && img.naturalHeight > 0) {
        sidebar.style.top = img.getBoundingClientRect().top + 'px';
        return true;
      }
    }
    return false;
  }

  var firstImg = document.querySelector('.gallery-slide img');
  if (firstImg) {
    if (firstImg.complete && firstImg.naturalHeight > 0) {
      lockSidebar();
    } else {
      firstImg.addEventListener('load', function () { lockSidebar(); });
    }
  }
  window.addEventListener('load', lockSidebar);

  function activateView(viewId, clickedLink) {
    views.forEach(function (v) { v.classList.remove('active'); });
    var view = document.getElementById(viewId);
    if (view) view.classList.add('active');

    links.forEach(function (l) { l.classList.remove('active'); });
    if (clickedLink) clickedLink.classList.add('active');

    // Re-layout masonry if switching to thumbnails
    if (viewId === 'view-thumbs' && window._layoutMasonry) {
      window._layoutMasonry();
    }
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      activateView(link.dataset.view, link);
    });
  });
})();


/* ── Lightbox for thumbnails ──────────────────────────────── */
(function () {
  var thumbItems = document.querySelectorAll('.thumb-item img');
  if (!thumbItems.length) return;

  function openLightbox(src) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    var img = document.createElement('img');
    img.src = src;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        document.body.removeChild(overlay);
      }
    });

    function onKey(e) {
      if (e.key === 'Escape') {
        if (document.body.contains(overlay)) {
          document.body.removeChild(overlay);
        }
        document.removeEventListener('keydown', onKey);
      }
    }
    document.addEventListener('keydown', onKey);
  }

  thumbItems.forEach(function (img) {
    img.addEventListener('click', function () {
      openLightbox(img.getAttribute('data-full') || img.src);
    });
  });
})();
