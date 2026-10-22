/* ===========================================================
   APP
   Ties Time / Matter / Space / Log tabs together around one
   shared "focus date" so planning a future unit, recording the
   present one, and reviewing the past all use the same lens.
   =========================================================== */

(function(){

  const state = {
    tab: 'time',
    focusDate: new Date(),
    matterUnitKey: null,
    matterLabel: 'Today',
    matterCat: 'spirit'
  };

  const mainView = document.getElementById('mainView');
  const crumbBar = document.getElementById('crumbBar');
  const barClock = document.getElementById('barClock');

  // ---------------- top clock (always real "now", independent of focus) ----------------
  function tickBar(){
    const d = new Date();
    barClock.textContent = `${TE.pad(d.getHours())}:${TE.pad(d.getMinutes())}:${TE.pad(d.getSeconds())}.${TE.pad(d.getMilliseconds(),3)}`;
    Views.tickLive();
  }
  setInterval(tickBar, 47); // fast enough to feel live, cheap enough to leave running
  tickBar();

  // ---------------- tab switching ----------------
  document.querySelectorAll('.tab').forEach(btn=>{
    btn.addEventListener('click', ()=> switchTab(btn.dataset.tab));
  });
  function switchTab(tab){
    state.tab = tab;
    document.querySelectorAll('.tab').forEach(b=> {
      const on = b.dataset.tab===tab;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true':'false');
    });
    render();
  }

  // ---------------- focus date control ----------------
  function setFocus(date){
    state.focusDate = date;
    if(state.tab==='time') render();
  }

  function goLogHere(unitKey, cat){
    state.matterUnitKey = unitKey;
    state.matterCat = cat || 'spirit';
    state.matterLabel = unitKey;
    switchTab('matter');
  }

  // ---------------- render: TIME tab ----------------
  const CRUMB_DEFS = [
    ['live','Now'],['quaday','Quaday'],['qday','Qtr-day'],['noon','Noon/Night'],
    ['day','Day'],['week','Week'],['decile','10-Day'],['month','Month'],
    ['quarter','Quarter'],['half','Half-yr'],['year','Year'],['4y','4-Yr'],
    ['7y','7-Yr'],['49y','49-Yr'],['decade','Decade'],['century','Century']
  ];

  function renderTime(){
    crumbBar.innerHTML = CRUMB_DEFS.map(([id,label])=>
      `<button data-scroll="sec-${id}">${label}</button>`).join('');
    crumbBar.querySelectorAll('button').forEach(b=>{
      b.onclick = ()=>{
        const el = document.getElementById(b.dataset.scroll);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      };
    });

    const snap = TE.snapshot(state.focusDate);
    const parts = [
      { r: { html: Views.liveCard() } },
      Views.quadayCard(snap),
      Views.quarterDayCard(snap),
      Views.noonCard(snap),
      Views.dayCard(snap),
      Views.weekCard(snap, setFocus),
      Views.decileCard(snap, setFocus),
      Views.monthCard(snap, setFocus),
      Views.quarterCard(snap, setFocus),
      Views.halfYearCard(snap, setFocus),
      Views.yearCard(snap, setFocus),
      Views.fourYearCard(snap, setFocus),
      Views.sevenYearCard(snap, setFocus),
      Views.fortyNineCard(snap, setFocus),
      Views.decadeCard(snap, setFocus),
      Views.centuryCard(snap, setFocus)
    ];

    mainView.innerHTML = `
      <div class="card" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">
        <strong style="font-size:12.5px;color:var(--mist)">Focused on</strong>
        <input type="date" id="focusPicker" value="${TE.dkey(state.focusDate)}" style="background:var(--panel2);border:1px solid var(--line);color:var(--parchment);border-radius:7px;padding:6px 8px;">
        <button class="btn" id="todayBtn">Today</button>
      </div>
      ${parts.map(p=>p.html||p.r.html).join('')}
    `;

    document.getElementById('focusPicker').onchange = (e)=>{
      const [y,m,dd] = e.target.value.split('-').map(Number);
      setFocus(new Date(y, m-1, dd));
    };
    document.getElementById('todayBtn').onclick = ()=> setFocus(new Date());

    parts.forEach(p=>{
      if(p.wire) p.wire(mainView);
      if(p.unitKey) Views.wireNoteBlock(mainView, p.unitKey, guessCat(snap), goLogHere);
    });
    Views.tickLive();
  }

  function guessCat(snap){
    return snap.ssb ? snap.ssb.seg : 'spirit';
  }

  // ---------------- render: MATTER tab ----------------
  function renderMatter(){
    crumbBar.innerHTML = '';
    if(!state.matterUnitKey){
      const snap = TE.snapshot(state.focusDate);
      state.matterUnitKey = Views.keyDay(snap.date);
      state.matterLabel = `Day · ${TE.dkey(snap.date)}`;
      state.matterCat = snap.ssb.seg;
    }
    mainView.innerHTML = `<div class="card" style="font-size:12px;color:var(--mist)">Logging for unit: <strong style="color:var(--parchment)">${escapeHtml(state.matterLabel)}</strong>
      <button class="btn" style="float:right" id="switchUnitBtn">Change</button></div><div id="matterHost"></div>`;
    document.getElementById('switchUnitBtn').onclick = ()=> switchTab('time');
    Matter.render(document.getElementById('matterHost'), state.matterUnitKey, state.matterCat);
  }

  // ---------------- render: SPACE tab ----------------
  function renderSpace(){
    crumbBar.innerHTML = '';
    Space.render(mainView);
  }

  // ---------------- render: LOG tab (chronological review) ----------------
  function renderLog(){
    crumbBar.innerHTML = '';
    const all = Store.listMatter();
    mainView.innerHTML = `
      <div class="unit-head">
        <div class="unit-eyebrow">Log</div>
        <div class="unit-title">Everything recorded</div>
        <div class="unit-sub">${all.length} ${all.length===1?'entry':'entries'} across every unit.</div>
      </div>
      <div class="card">
        <input type="text" id="logSearch" placeholder="Search your log…" style="width:100%;background:var(--panel2);border:1px solid var(--line);color:var(--parchment);border-radius:8px;padding:9px;">
      </div>
      <div class="entry-list" id="logList"></div>
    `;
    function draw(filter){
      const list = document.getElementById('logList');
      const f = (filter||'').toLowerCase();
      const rows = all.filter(e=> !f || (e.text+e.desc+e.unitKey).toLowerCase().includes(f));
      if(!rows.length){ list.innerHTML = '<div class="empty">Nothing yet — log something from the Time or Matter tab.</div>'; return; }
      list.innerHTML = rows.map(e=>`
        <div class="entry">
          <div class="cat-bar ${e.cat}"></div>
          <div class="entry-main">
            <div class="entry-title">${e.type==='text' ? escapeHtml(e.text) : (e.type==='photo'?'📷 Photo':'🎥 Video')}</div>
            ${e.desc?`<div class="entry-desc">${escapeHtml(e.desc)}</div>`:''}
            ${e.media && e.type==='photo' ? `<img class="entry-thumb" src="${e.media}">` : ''}
            ${e.media && e.type==='video' ? `<video class="entry-thumb" src="${e.media}" controls></video>` : ''}
            <div class="entry-meta">${new Date(e.ts).toLocaleString()} · ${e.unitKey}</div>
          </div>
        </div>
      `).join('');
    }
    draw('');
    document.getElementById('logSearch').oninput = (e)=> draw(e.target.value);
  }

  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function render(){
    if(state.tab==='time') renderTime();
    else if(state.tab==='matter') renderMatter();
    else if(state.tab==='space') renderSpace();
    else if(state.tab==='log') renderLog();
  }

  // ---------------- settings drawer ----------------
  const drawer = document.getElementById('settingsDrawer');
  document.getElementById('settingsBtn').onclick = ()=>{
    const s = Store.getSettings();
    document.getElementById('fourYearMode').value = s.fourYearMode;
    document.getElementById('fourYearAnchor').value = s.fourYearAnchor;
    document.getElementById('sevenYearAnchor').value = s.sevenYearAnchor;
    document.getElementById('fourYearAnchorWrap').style.display = s.fourYearMode==='custom' ? 'block':'none';
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
  };
  document.getElementById('closeSettings').onclick = closeDrawer;
  drawer.addEventListener('click', e=>{ if(e.target===drawer) closeDrawer(); });
  function closeDrawer(){ drawer.classList.remove('open'); drawer.setAttribute('aria-hidden','true'); }

  document.getElementById('fourYearMode').onchange = (e)=>{
    document.getElementById('fourYearAnchorWrap').style.display = e.target.value==='custom' ? 'block':'none';
    saveSettingsFromDrawer();
  };
  document.getElementById('fourYearAnchor').onchange = saveSettingsFromDrawer;
  document.getElementById('sevenYearAnchor').onchange = saveSettingsFromDrawer;
  function saveSettingsFromDrawer(){
    Store.setSettings({
      fourYearMode: document.getElementById('fourYearMode').value,
      fourYearAnchor: parseInt(document.getElementById('fourYearAnchor').value,10)||2024,
      sevenYearAnchor: parseInt(document.getElementById('sevenYearAnchor').value,10)||2004
    });
    if(state.tab==='time') renderTime();
  }

  document.getElementById('exportBtn').onclick = ()=>{
    const dump = Store.exportAll();
    const blob = new Blob([JSON.stringify(dump,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `time-matter-space-backup-${TE.dkey(new Date())}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };
  document.getElementById('importBtn').onclick = ()=> document.getElementById('importFile').click();
  document.getElementById('importFile').onchange = (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const dump = JSON.parse(reader.result);
        Store.importAll(dump);
        alert('Backup imported.');
        render();
      }catch(err){ alert('That file could not be read as a backup.'); }
    };
    reader.readAsText(file);
  };
  document.getElementById('wipeBtn').onclick = ()=>{
    if(confirm('Erase everything stored on this device? This cannot be undone.')){
      Store.wipeAll();
      closeDrawer();
      render();
    }
  };

  // ---------------- PWA / offline ----------------
  if('serviceWorker' in navigator){
    window.addEventListener('load', ()=>{
      navigator.serviceWorker.register('sw.js').catch(()=>{ /* fine if it fails, app still works online */ });
    });
  }

  // ---------------- spirit verse banner (persists across every tab) ----------------
  VerseBanner.init(document.getElementById('verseBanner'));
  VerseBanner.start();

  // ---------------- boot ----------------
  render();
})();
