/* =============================================================
   bohlae.com — Main JavaScript (Redesigned)
   ============================================================= */

/* ── Gallery auto-advance (single image, 6 s) ────────────── */
(function () {
  var slides  = document.querySelectorAll('.gallery-slide');
  var caption = document.getElementById('gallery-caption');
  if (!slides.length) return;

  var current = 0;
  var timer;

  function goTo(n) {
    slides[current].classList.remove('active');
    current = ((n % slides.length) + slides.length) % slides.length;
    slides[current].classList.add('active');
    if (caption) caption.textContent = slides[current].dataset.caption || '';
  }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(function () { goTo(current + 1); }, 6000);
  }

  if (caption && slides[0]) {
    caption.textContent = slides[0].dataset.caption || '';
  }

  startTimer();
})();


/* ── Masonry layout for thumbnails ────────────────────────── */
(function () {
  var grid = document.querySelector('.thumbnails-grid');
  if (!grid) return;

  var COL_COUNT = 4;
  var GAP = 32;
  var resizeTimer;
  // Pare thumbnails are CSS-fixed to 280px regardless of image load state
  var isPareGrid = grid.classList.contains('thumbnails-grid--pare');

  // Compute item height without waiting for the image to load.
  // Pare: CSS sets height:280px on every img — use that constant.
  // Other pages: derive from the intrinsic width/height attributes.
  function getItemHeight(item, colWidth) {
    if (isPareGrid) return 280;
    var img = item.querySelector('img');
    if (img) {
      var natW = parseInt(img.getAttribute('width'))  || img.naturalWidth  || 0;
      var natH = parseInt(img.getAttribute('height')) || img.naturalHeight || 0;
      if (natW && natH) return Math.round((natH / natW) * colWidth);
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
    var colWidth = (availableWidth - GAP * (cols - 1)) / cols;
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
      item.style.left  = (paddingLeft + minCol * (colWidth + GAP)) + 'px';
      item.style.top   = (paddingTop  + colHeights[minCol]) + 'px';
      item.style.width = colWidth + 'px';

      colHeights[minCol] += itemHeight + GAP;
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


/* ── View switching + dynamic sidebar alignment ───────────── */
(function () {
  var sidebar = document.querySelector('.project-sidebar');
  var links = document.querySelectorAll('[data-view]');
  var views = document.querySelectorAll('.view');
  if (!links.length || !sidebar) return;

  var currentView = 'view-gallery';

  // Align sidebar top to gallery image top after image loads
  function alignSidebarToGallery() {
    var galleryView = document.getElementById('view-gallery');
    if (!galleryView) return;

    var wasHidden = !galleryView.classList.contains('active');

    if (wasHidden) {
      galleryView.style.display = 'block';
      galleryView.style.visibility = 'hidden';
      galleryView.style.position = 'absolute';
    }

    var slide = galleryView.querySelector('.gallery-slide.active') || galleryView.querySelector('.gallery-slide');
    if (slide) {
      var img = slide.querySelector('img') || slide.querySelector('.img-placeholder');
      if (img && img.complete && img.naturalHeight > 0) {
        var imgTop = img.getBoundingClientRect().top;
        sidebar.style.top = imgTop + 'px';
      }
    }

    if (wasHidden) {
      galleryView.style.display = '';
      galleryView.style.visibility = '';
      galleryView.style.position = '';
    }
  }

  // Align sidebar top to about text block top after render
  function alignSidebarToAbout() {
    var el = document.querySelector('#view-about .about-column');
    if (!el) return;
    sidebar.style.top = el.getBoundingClientRect().top + 'px';
  }

  // Align sidebar top to music tracklist top after render
  function alignSidebarToMusic() {
    var el = document.querySelector('#view-music .music-tracklist');
    if (!el) return;
    sidebar.style.top = el.getBoundingClientRect().top + 'px';
  }

  function activateView(viewId, clickedLink) {
    views.forEach(function (v) { v.classList.remove('active'); });
    var view = document.getElementById(viewId);
    if (view) view.classList.add('active');

    links.forEach(function (l) { l.classList.remove('active'); });
    if (clickedLink) clickedLink.classList.add('active');

    currentView = viewId;

    // Re-layout masonry if switching to thumbnails.
    // Run synchronously — heights are computed from attributes, no image load needed.
    if (viewId === 'view-thumbs' && window._layoutMasonry) {
      window._layoutMasonry();
    }

    // Align sidebar for about and music views after layout settles
    if (viewId === 'view-about') {
      requestAnimationFrame(alignSidebarToAbout);
    } else if (viewId === 'view-music') {
      requestAnimationFrame(alignSidebarToMusic);
    }
  }

  links.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      activateView(link.dataset.view, link);
    });
  });

  // Initial alignment — wait for first gallery image to load
  var firstSlide = document.querySelector('.gallery-slide');
  if (firstSlide) {
    var firstImg = firstSlide.querySelector('img');
    if (firstImg) {
      if (firstImg.complete && firstImg.naturalHeight > 0) {
        alignSidebarToGallery();
      } else {
        firstImg.addEventListener('load', alignSidebarToGallery);
      }
    }
  }

  window.addEventListener('load', alignSidebarToGallery);
  window.addEventListener('resize', function () {
    setTimeout(function () {
      if (currentView === 'view-gallery') {
        alignSidebarToGallery();
      } else if (currentView === 'view-about') {
        alignSidebarToAbout();
      } else if (currentView === 'view-music') {
        alignSidebarToMusic();
      }
    }, 50);
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
