(function () {
  var MARKER_TARGET_X = 0.5;
  var MARKER_TARGET_Y = 0.72;
  var LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
  var LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  var LEAFLET_INTEGRITY_CSS =
    'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
  var LEAFLET_INTEGRITY_JS =
    'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
  var CLUSTER_CSS =
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
  var CLUSTER_DEFAULT_CSS =
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
  var CLUSTER_JS =
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(str) {
    return escapeHtml(str).replace(/'/g, '&#39;');
  }

  function loadStylesheet(href, integrity, key) {
    return new Promise(function (resolve, reject) {
      var attr = key || href;
      if (document.querySelector('link[data-inspired-asset="' + attr + '"]')) {
        resolve();
        return;
      }
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      if (integrity) {
        link.integrity = integrity;
        link.crossOrigin = '';
      }
      link.setAttribute('data-inspired-asset', attr);
      link.onload = function () {
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadScript(src, integrity, key) {
    return new Promise(function (resolve, reject) {
      var attr = key || src;
      var existing = document.querySelector(
        'script[data-inspired-asset="' + attr + '"]'
      );
      if (existing) {
        if (existing.getAttribute('data-loaded') === '1') {
          resolve();
          return;
        }
        existing.addEventListener('load', function () {
          resolve();
        });
        existing.addEventListener('error', reject);
        return;
      }
      var script = document.createElement('script');
      script.src = src;
      if (integrity) {
        script.integrity = integrity;
        script.crossOrigin = '';
      }
      script.setAttribute('data-inspired-asset', attr);
      script.onload = function () {
        script.setAttribute('data-loaded', '1');
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  function dataUrl() {
    var canvas = document.getElementById('inspired-map-canvas');
    var fromAttr = canvas && canvas.getAttribute('data-institutions-url');
    if (fromAttr) {
      try {
        return new URL(fromAttr, window.location.href).href;
      } catch (e) {
        return fromAttr;
      }
    }
    var script = document.querySelector('script[src*="inspired-map"]');
    if (script && script.src) {
      return new URL('../data/data8-inspired.json', script.src).href;
    }
    return new URL('/data/data8-inspired.json', window.location.origin).href;
  }

  function logoUrl(path) {
    if (!path) return '';
    path = String(path).trim();
    if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0) {
      return path;
    }
    var script = document.querySelector('script[src*="inspired-map"]');
    if (script && script.src) {
      return new URL('../' + path.replace(/^\//, ''), script.src).href;
    }
    return '/' + path.replace(/^\//, '');
  }

  function initialsFor(name) {
    var parts = String(name)
      .replace(/\(.*?\)/g, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (!parts.length) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function popupHtml(institution) {
    var siteUrl = institution.url || '#';
    var imgSrc = logoUrl(institution.logo);
    var logoBlock = imgSrc
      ? '<div class="inspired-map-popup-logo-wrap">' +
        '<img class="inspired-map-popup-logo" src="' +
        escapeAttr(imgSrc) +
        '" alt="' +
        escapeAttr(institution.name) +
        '">' +
        '</div>'
      : '';
    var meta = institution.location
      ? '<p class="inspired-map-popup-meta">' +
        escapeHtml(institution.location) +
        '</p>'
      : '';
    return (
      '<div class="inspired-map-popup">' +
      logoBlock +
      '<p class="inspired-map-popup-name">' +
      escapeHtml(institution.name) +
      '</p>' +
      meta +
      '<a class="inspired-map-popup-link" href="' +
      escapeAttr(siteUrl) +
      '" target="_blank" rel="noopener" aria-label="Visit ' +
      escapeAttr(institution.name) +
      ' website (opens in a new tab)">Visit website</a>' +
      '</div>'
    );
  }

  function createDotIcon(active) {
    // Hit area must be ≥24×24 for WCAG 2.2 target-size; the visible dot stays smaller.
    var hit = 24;
    var dot = active ? 12 : 10;
    var fill = active ? '#FDB515' : '#003262';
    return L.divIcon({
      className:
        'inspired-map-dot-wrap' + (active ? ' inspired-map-dot-wrap--active' : ''),
      html:
        '<span class="inspired-map-dot" style="display:block;width:' +
        dot +
        'px;height:' +
        dot +
        'px;margin:auto;background:' +
        fill +
        ';border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35);" aria-hidden="true"></span>',
      iconSize: [hit, hit],
      iconAnchor: [hit / 2, hit / 2],
      popupAnchor: [0, -(hit / 2) - 4],
    });
  }

  function boot() {
    var canvas = document.getElementById('inspired-map-canvas');
    var listEl = document.getElementById('inspired-institution-list');
    if (!canvas || !listEl) return;

    Promise.all([
      loadStylesheet(LEAFLET_CSS, LEAFLET_INTEGRITY_CSS, 'leaflet-css'),
      loadScript(LEAFLET_JS, LEAFLET_INTEGRITY_JS, 'leaflet-js'),
      fetch(dataUrl()).then(function (response) {
        if (!response.ok) throw new Error('Failed to load institutions');
        return response.json();
      }),
    ])
      .then(function (results) {
        return Promise.all([
          loadStylesheet(CLUSTER_CSS, null, 'cluster-css'),
          loadStylesheet(CLUSTER_DEFAULT_CSS, null, 'cluster-default-css'),
          loadScript(CLUSTER_JS, null, 'cluster-js'),
        ]).then(function () {
          initExplorer(results[2]);
        });
      })
      .catch(function (err) {
        console.error(err);
        listEl.innerHTML =
          '<li class="inspired-map-error">Unable to load the institution map. Please refresh the page.</li>';
      });
  }

  function initExplorer(institutions) {
    var byId = {};
    var markersById = {};
    var activeId = null;
    var query = '';
    var map = null;
    var tileLayer = null;
    var clusterGroup = null;

    institutions
      .slice()
      .sort(function (a, b) {
        return a.name.localeCompare(b.name);
      })
      .forEach(function (institution) {
        byId[institution.id] = institution;
      });

    var sorted = institutions.slice().sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    function isDark() {
      return (
        document.body.getAttribute('data-md-color-scheme') === 'slate' ||
        document.documentElement.getAttribute('data-md-color-scheme') === 'slate'
      );
    }

    function tileUrl() {
      return isDark()
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    }

    function matchesQuery(institution) {
      if (!query) return true;
      var hay =
        (institution.name || '') +
        ' ' +
        (institution.location || '') +
        ' ' +
        (institution.type || '');
      return hay.toLowerCase().indexOf(query) !== -1;
    }

    function filtered() {
      return sorted.filter(matchesQuery);
    }

    function updateFooter(visibleCount) {
      var footer = document.getElementById('inspired-list-footer');
      var count = document.getElementById('inspired-count');
      if (count) count.textContent = String(institutions.length);
      if (!footer) return;
      if (query && visibleCount !== institutions.length) {
        footer.textContent =
          visibleCount + ' of ' + institutions.length + ' shown';
      } else {
        footer.textContent = visibleCount + ' partners · scroll for more';
      }
    }

    function scrollListItemIntoView(id) {
      var item = document.querySelector(
        '.inspired-partner-item[data-institution-id="' + id + '"]'
      );
      if (item) {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    function setActiveStyles(id) {
      document.querySelectorAll('.inspired-partner-item').forEach(function (el) {
        var on = el.getAttribute('data-institution-id') === id;
        el.classList.toggle('inspired-partner-item--active', on);
        if (on) {
          el.setAttribute('aria-current', 'true');
        } else {
          el.removeAttribute('aria-current');
        }
      });
      Object.keys(markersById).forEach(function (markerId) {
        markersById[markerId].setIcon(createDotIcon(markerId === id));
      });
    }

    function positionMarkerInMapFrame(marker, done) {
      map.invalidateSize();
      var latlng = marker.getLatLng();
      var mapSize = map.getSize();
      var markerPoint = map.latLngToContainerPoint(latlng);
      var targetPoint = L.point(
        mapSize.x * MARKER_TARGET_X,
        mapSize.y * MARKER_TARGET_Y
      );
      map.panBy(markerPoint.subtract(targetPoint), {
        animate: true,
        duration: 0.35,
      });
      if (done) {
        map.once('moveend', function onPanEnd() {
          map.off('moveend', onPanEnd);
          done();
        });
      }
    }

    function centerOnMarker(marker, thenOpenPopup) {
      function afterVisible() {
        if (!thenOpenPopup) return;
        positionMarkerInMapFrame(marker, function () {
          marker.openPopup();
        });
      }

      // Zoom/spiderfy through clusters so the marker is an unobscured 24×24 target.
      if (clusterGroup && typeof clusterGroup.zoomToShowLayer === 'function') {
        clusterGroup.zoomToShowLayer(marker, afterVisible);
        return;
      }

      var latlng = marker.getLatLng();
      var zoom = Math.max(map.getZoom(), 5);
      map.flyTo(latlng, zoom, { animate: true, duration: 0.55 });
      map.once('moveend', function onFlyEnd() {
        map.off('moveend', onFlyEnd);
        afterVisible();
      });
    }

    function openInstitution(id, options) {
      options = options || {};
      var institution = byId[id];
      var marker = markersById[id];
      if (!institution || !marker) return;

      if (activeId && markersById[activeId]) {
        markersById[activeId].closePopup();
      }

      activeId = id;
      setActiveStyles(id);
      marker.setPopupContent(popupHtml(institution));
      scrollListItemIntoView(id);

      if (options.fly !== false) {
        centerOnMarker(marker, true);
      } else if (
        clusterGroup &&
        typeof clusterGroup.zoomToShowLayer === 'function'
      ) {
        clusterGroup.zoomToShowLayer(marker, function () {
          positionMarkerInMapFrame(marker, function () {
            marker.openPopup();
          });
        });
      } else {
        positionMarkerInMapFrame(marker, function () {
          marker.openPopup();
        });
      }
    }

    function renderList() {
      var listEl = document.getElementById('inspired-institution-list');
      var visible = filtered();
      listEl.innerHTML = '';

      if (!visible.length) {
        listEl.innerHTML =
          '<li class="inspired-map-error">No institutions match your search.</li>';
        updateFooter(0);
        return;
      }

      visible.forEach(function (institution) {
        var item = document.createElement('li');
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'inspired-partner-item';
        button.setAttribute('data-institution-id', institution.id);
        button.title = institution.name + ' — show on map';

        var avatar = document.createElement('span');
        avatar.className = 'inspired-partner-avatar';
        avatar.setAttribute('aria-hidden', 'true');

        var imgSrc = logoUrl(institution.logo);
        if (imgSrc) {
          var img = document.createElement('img');
          img.src = imgSrc;
          img.alt = '';
          img.loading = 'lazy';
          img.onerror = function () {
            avatar.textContent = initialsFor(institution.name);
            avatar.classList.add('inspired-partner-avatar--initials');
          };
          avatar.appendChild(img);
        } else {
          avatar.textContent = initialsFor(institution.name);
          avatar.classList.add('inspired-partner-avatar--initials');
        }

        var body = document.createElement('span');
        body.className = 'inspired-partner-body';

        var name = document.createElement('span');
        name.className = 'inspired-partner-name';
        name.textContent = institution.name;

        var meta = document.createElement('span');
        meta.className = 'inspired-partner-meta';
        meta.textContent = [institution.location, institution.type]
          .filter(Boolean)
          .join(' · ');

        body.appendChild(name);
        body.appendChild(meta);
        button.appendChild(avatar);
        button.appendChild(body);

        button.addEventListener('click', function () {
          openInstitution(institution.id, { fly: true });
        });

        item.appendChild(button);
        listEl.appendChild(item);
      });

      if (activeId) setActiveStyles(activeId);
      updateFooter(visible.length);
    }

    var canvas = document.getElementById('inspired-map-canvas');
    map = L.map(canvas, {
      scrollWheelZoom: true,
      minZoom: 2,
      maxZoom: 12,
      worldCopyJump: true,
      attributionControl: false,
    });

    tileLayer = L.tileLayer(tileUrl(), {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    var bounds = L.latLngBounds(
      institutions.map(function (institution) {
        return [institution.lat, institution.lng];
      })
    );
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 4 });

    // Cluster overlapping pins so each visible target stays ≥24×24 (WCAG 2.2).
    clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
    });

    institutions.forEach(function (institution) {
      // `title` gives the keyboard-focusable marker an accessible name and
      // persists through setIcon() when the active dot style is swapped.
      var marker = L.marker([institution.lat, institution.lng], {
        icon: createDotIcon(false),
        title: institution.name,
      });

      marker.bindPopup(popupHtml(institution), {
        className: 'inspired-map-leaflet-popup',
        minWidth: 200,
        maxWidth: 240,
        autoPan: false,
      });

      marker.on('click', function (e) {
        L.DomEvent.stopPropagation(e);
        openInstitution(institution.id, { fly: false });
      });

      markersById[institution.id] = marker;
      clusterGroup.addLayer(marker);
    });

    map.addLayer(clusterGroup);

    var search = document.getElementById('inspired-search-input');
    if (search) {
      search.addEventListener('input', function () {
        query = String(search.value || '')
          .trim()
          .toLowerCase();
        renderList();
      });
    }

    var themeObserver = new MutationObserver(function () {
      tileLayer.setUrl(tileUrl());
    });
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-md-color-scheme'],
    });

    renderList();

    map.whenReady(function () {
      map.invalidateSize();
      window.setTimeout(function () {
        map.invalidateSize();
      }, 250);
    });

    window.addEventListener('resize', function () {
      map.invalidateSize();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
