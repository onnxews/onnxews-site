/* 2026 election dashboard. All numbers come from /election-data.json —
   nothing is hardcoded here. Polls the data file every 60 seconds so the
   page updates without a visitor refresh. To switch to a live API later,
   point DATA_URL at the API (or Cloudflare Worker) endpoint that returns
   the same JSON shape. */
(function () {
  var DATA_URL = '/election-data.json';
  var POLL_MS = 60000;
  var STALE_MS = 45 * 60 * 1000;

  var GRID = {
    AK: [1, 1], ME: [11, 1],
    WA: [1, 2], MT: [2, 2], ND: [3, 2], MN: [4, 2], WI: [5, 2], MI: [6, 2],
    NY: [7, 2], VT: [8, 2], NH: [9, 2], MA: [10, 2],
    OR: [1, 3], ID: [2, 3], SD: [3, 3], IA: [4, 3], IL: [5, 3], IN: [6, 3],
    OH: [7, 3], PA: [8, 3], NJ: [9, 3], CT: [10, 3], RI: [11, 3],
    CA: [1, 4], NV: [2, 4], WY: [3, 4], NE: [4, 4], MO: [5, 4], KY: [6, 4],
    WV: [7, 4], VA: [8, 4], MD: [9, 4], DE: [10, 4], DC: [11, 4],
    UT: [2, 5], CO: [3, 5], KS: [4, 5], AR: [5, 5], TN: [6, 5], NC: [7, 5], SC: [8, 5],
    AZ: [2, 6], NM: [3, 6], OK: [4, 6], LA: [5, 6], MS: [6, 6], AL: [7, 6], GA: [8, 6],
    TX: [4, 7], FL: [8, 7],
    HI: [1, 8]
  };

  var tab = 'senate';
  var data = null;
  var selected = null;

  function el(id) { return document.getElementById(id); }
  function fmt(n) { return n.toLocaleString('en-US'); }

  function statusText(code, office) {
    if (code === 'D') return 'Called: Democrat';
    if (code === 'R') return 'Called: Republican';
    if (code === 'notup') return office === 'senate'
      ? 'No Senate race this cycle'
      : 'No governor race this cycle';
    return 'Too early to call';
  }

  function tileClass(abbr) {
    var st = data.states[abbr];
    if (tab === 'house') return st.houseCalled ? 'p' : 'u';
    var v = tab === 'senate' ? st.senate : st.governor;
    if (v === 'D') return 'd';
    if (v === 'R') return 'r';
    if (v === 'notup') return 'n';
    return 'u';
  }

  function renderTracker() {
    var t = tab === 'senate' ? data.senate
      : tab === 'house' ? data.house : data.governors;
    var total = t.dem + t.rep + t.undecided;
    el('score-d').textContent = fmt(t.dem);
    el('score-r').textContent = fmt(t.rep);
    el('score-u').textContent = fmt(t.undecided);
    el('seg-d').style.width = (t.dem / total * 100) + '%';
    el('seg-r').style.width = (t.rep / total * 100) + '%';
    var marker = el('bar-marker');
    if (t.needed) {
      marker.style.display = 'block';
      marker.style.left = (t.needed / total * 100) + '%';
      marker.querySelector('span').textContent = t.needed + ' to control';
    } else {
      marker.style.display = 'none';
    }
    el('needed-line').textContent = tab === 'senate'
      ? '51 seats needed for a Senate majority.'
      : tab === 'house'
      ? '218 seats needed for a House majority.'
      : '36 governor offices on the ballot this year.';
    el('tracker-note').textContent = tab === 'senate' ? data.senate.note
      : tab === 'house'
      ? 'All 435 House seats are on the ballot. State-by-state House calls appear below as they are confirmed.'
      : 'Governors called so far are shown in the totals; the map colors only races with individually confirmed calls.';
    el('legend').innerHTML = tab === 'house'
      ? '<span class="sw-d"><i></i>Democrat called</span><span class="sw-r"><i></i>Republican called</span><span class="sw-u"><i></i>Too early / no call yet</span>'
      : '<span class="sw-d"><i></i>Democrat</span><span class="sw-r"><i></i>Republican</span><span class="sw-u"><i></i>Too early to call</span><span class="sw-n"><i></i>Not up this cycle</span>';
    var hl = el('house-list');
    if (tab === 'house') {
      var rows = [];
      Object.keys(data.states).sort().forEach(function (abbr) {
        var hc = data.states[abbr].houseCalled;
        if (hc) rows.push('<b>' + data.states[abbr].name + ':</b> ' + hc.dem + ' Democrat, ' + hc.rep + ' Republican of ' + hc.total + ' seats called so far.');
      });
      hl.innerHTML = rows.length
        ? '<b>House seats called by state (verified so far):</b><br>' + rows.join('<br>')
        : 'No state-level House calls confirmed yet.';
      hl.style.display = 'block';
    } else {
      hl.style.display = 'none';
    }
  }

  function renderMap() {
    var grid = el('map-grid');
    grid.innerHTML = '';
    Object.keys(GRID).forEach(function (abbr) {
      var pos = GRID[abbr];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'el-tile ' + tileClass(abbr) + (selected === abbr ? ' sel' : '');
      b.style.gridColumn = pos[0];
      b.style.gridRow = pos[1];
      b.textContent = abbr;
      b.setAttribute('aria-label', data.states[abbr].name);
      b.addEventListener('click', function () { selected = abbr; renderMap(); renderDetail(); });
      grid.appendChild(b);
    });
  }

  function renderDetail() {
    var box = el('state-detail');
    if (!selected) {
      box.innerHTML = 'Tap a state on the map to see its election results.';
      return;
    }
    var st = data.states[selected];
    var hc = st.houseCalled
      ? st.houseCalled.dem + ' Democrat, ' + st.houseCalled.rep + ' Republican of ' + st.houseCalled.total + ' seats called'
      : 'No House seats called yet';
    box.innerHTML = '<b>' + st.name + '</b><br>'
      + 'Senate: ' + statusText(st.senate, 'senate') + '<br>'
      + 'Governor: ' + statusText(st.governor, 'governor') + '<br>'
      + 'House: ' + hc
      + (st.note ? '<br>' + st.note : '');
  }

  function renderUpdates() {
    el('updates-list').innerHTML = data.updates.map(function (u) {
      return '<li><time>' + u.time + '</time><span>' + u.text + '</span></li>';
    }).join('');
  }

  function renderAll() {
    el('updated-label').textContent = data.lastUpdatedLabel + ' · Source: ' + data.source;
    renderTracker();
    renderMap();
    renderDetail();
    renderUpdates();
  }

  function setBanner(show, text) {
    var b = el('stale-banner');
    b.classList.toggle('show', !!show);
    if (text) b.textContent = text;
  }

  function fetchData() {
    fetch(DATA_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (res) { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
      .then(function (json) {
        data = json;
        renderAll();
        var age = Date.now() - new Date(json.lastUpdated).getTime();
        if (isNaN(age) || age > STALE_MS) {
          setBanner(true, 'The latest data is more than 45 minutes old — results may be delayed. This page keeps checking for updates.');
        } else {
          setBanner(false);
        }
      })
      .catch(function () {
        if (!data) {
          el('updated-label').textContent = 'Election data is temporarily unavailable.';
          el('map-grid').innerHTML = '';
          el('state-detail').innerHTML = 'Election data is temporarily unavailable. This page will keep trying — no refresh needed.';
        }
        setBanner(true, 'Live updates are delayed — showing the last available data. This page keeps checking.');
      });
  }

  document.querySelectorAll('.el-tabs button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      tab = btn.getAttribute('data-tab');
      document.querySelectorAll('.el-tabs button').forEach(function (b) {
        b.classList.toggle('on', b === btn);
      });
      if (data) { renderTracker(); renderMap(); }
    });
  });
  el('refresh-btn').addEventListener('click', fetchData);
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) fetchData();
  });

  fetchData();
  setInterval(fetchData, POLL_MS);
})();
