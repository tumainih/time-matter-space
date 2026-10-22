/* ===========================================================
   VIEWS
   Renders each cycle as a card: current position highlighted,
   siblings tappable (to move the shared focus date), and a
   Plan / Record / Evaluate note block keyed to that exact
   unit instance.
   =========================================================== */

const Views = (function(){

  const M = TE.MONTHS, WD = TE.WEEKDAYS, WDS = TE.WEEKDAYS_SHORT;

  // ---------- unit keys (stable identity per unit instance) ----------
  function keyQuaday(d, idx){ return `quaday:${TE.dkey(d)}:${idx}`; }
  function keyQuarterDay(d, idx){ return `qday:${TE.dkey(d)}:${idx}`; }
  function keyNoon(d, noon){ return `noon:${TE.dkey(d)}:${noon?1:0}`; }
  function keyDay(d){ return `day:${TE.dkey(d)}`; }
  function keyWeek(sunday){ return `week:${TE.dkey(sunday)}`; }
  function keyDecile(d, idx){ return `decile:${d.getFullYear()}-${TE.pad(d.getMonth()+1)}-${idx}`; }
  function keyMonth(y,m){ return `month:${y}-${TE.pad(m+1)}`; }
  function keyQuarter(y,q){ return `quarter:${y}-Q${q+1}`; }
  function keyHalf(y,h){ return `half:${y}-H${h+1}`; }
  function keyYear(y){ return `year:${y}`; }
  function keyFourYear(s,e){ return `4y:${s}-${e}`; }
  function keySevenYear(s,e){ return `7y:${s}-${e}`; }
  function keyFortyNine(s,e){ return `49y:${s}-${e}`; }
  function keyDecade(s){ return `decade:${s}`; }
  function keyCentury(s){ return `century:${s}`; }

  // ---------- shared bits ----------
  function section(id, eyebrow, title, sub, innerHtml){
    return `
      <section class="unit-section" id="sec-${id}">
        <div class="unit-head">
          <div class="unit-eyebrow">${eyebrow}</div>
          <div class="unit-title">${title}</div>
          ${sub ? `<div class="unit-sub">${sub}</div>` : ''}
        </div>
        ${innerHtml}
      </section>
    `;
  }

  function noteBlockHtml(unitKey){
    return `
      <div class="card note-card" data-unit-key="${unitKey}">
        <h4>Plan · Record · Evaluate</h4>
        <div class="note-tabs">
          <button class="note-tab active" data-phase="plan">Plan</button>
          <button class="note-tab" data-phase="record">Record</button>
          <button class="note-tab" data-phase="evaluate">Evaluate</button>
        </div>
        <textarea class="note-area" data-phase="plan"></textarea>
        <div class="note-saved"></div>
        <div class="btn-row">
          <button class="btn log-here-btn">＋ Log matter for this unit</button>
        </div>
      </div>
    `;
  }

  function wireNoteBlock(root, unitKey, defaultCat, onLogHere){
    const card = root.querySelector(`.note-card[data-unit-key="${CSS.escape(unitKey)}"]`);
    if(!card) return;
    const note = Store.getNote(unitKey);
    const area = card.querySelector('.note-area');
    let phase = 'plan';
    area.value = note.plan;
    const savedFlag = card.querySelector('.note-saved');
    let saveTimer=null;

    card.querySelectorAll('.note-tab').forEach(tab=>{
      tab.onclick = ()=>{
        card.querySelectorAll('.note-tab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        phase = tab.dataset.phase;
        area.dataset.phase = phase;
        area.value = note[phase] || '';
        area.placeholder = phase==='plan' ? 'Plan this unit before it begins…'
          : phase==='record' ? 'Record what actually happened…'
          : 'Evaluate: what worked, what to change…';
      };
    });
    area.placeholder = 'Plan this unit before it begins…';
    area.oninput = ()=>{
      note[phase] = area.value;
      Store.setNote(unitKey, phase, area.value);
      savedFlag.textContent = 'Saved';
      clearTimeout(saveTimer);
      saveTimer = setTimeout(()=> savedFlag.textContent='', 1200);
    };
    const logBtn = card.querySelector('.log-here-btn');
    if(logBtn) logBtn.onclick = ()=> onLogHere && onLogHere(unitKey, defaultCat);
  }

  // ---------- LIVE READOUT (ms / s / min / hour) ----------
  function liveCard(){
    return `
      <section class="unit-section" id="sec-live">
        <div class="unit-head">
          <div class="unit-eyebrow">Now</div>
          <div class="unit-title readout" id="liveBig">--:--:--</div>
          <div class="unit-sub readout" id="liveMs">.000</div>
        </div>
        <div class="tile-grid cols-4 card" style="padding:12px">
          <div class="tile"><span class="t-label">Hour</span><span class="t-value readout" id="lvHour">--</span></div>
          <div class="tile"><span class="t-label">Minute</span><span class="t-value readout" id="lvMin">--</span></div>
          <div class="tile"><span class="t-label">Second</span><span class="t-value readout" id="lvSec">--</span></div>
          <div class="tile"><span class="t-label">Millisecond</span><span class="t-value readout" id="lvMsTile">---</span></div>
        </div>
      </section>
    `;
  }
  function tickLive(){
    const d = new Date();
    const big = document.getElementById('liveBig');
    if(!big) return; // not on time tab
    const hh=TE.pad(d.getHours()), mm=TE.pad(d.getMinutes()), ss=TE.pad(d.getSeconds());
    big.textContent = `${hh}:${mm}:${ss}`;
    const ms = document.getElementById('liveMs'); if(ms) ms.textContent = '.'+TE.pad(d.getMilliseconds(),3);
    const set=(id,v)=>{ const el=document.getElementById(id); if(el) el.textContent=v; };
    set('lvHour', hh); set('lvMin', mm); set('lvSec', ss); set('lvMsTile', TE.pad(d.getMilliseconds(),3));
  }

  // ---------- QUADAY (3h blocks) ----------
  function quadayCard(snap){
    const d = snap.date;
    const tiles = TE.QUADAY_LABELS.map((lab,i)=>{
      const isNow = TE.dkey(d)===TE.dkey(new Date()) && i===snap.quaday.idx;
      return `<div class="tile ${isNow?'now':''}" data-idx="${i}"><span class="t-label">${lab}h</span><span class="t-value readout">Q${i+1}</span></div>`;
    }).join('');
    const ssb = snap.ssb;
    const inner = `
      <div class="card">
        <h4>Eight 3‑hour blocks</h4>
        <div class="tile-grid cols-4">${tiles}</div>
      </div>
      <div class="card">
        <h4>Inside this block — Spirit → Soul → Body</h4>
        <div class="ssb-strip">
          <div class="ssb-seg spirit ${ssb.seg==='spirit'?'':''}">Spirit<span class="n">${TE.pad(ssb.blockStartHour)}:00</span></div>
          <div class="ssb-seg soul">Soul<span class="n">${TE.pad(ssb.blockStartHour+1)}:00</span></div>
          <div class="ssb-seg body">Body<span class="n">${TE.pad(ssb.blockStartHour+2)}:00</span></div>
        </div>
        <div class="legend">
          <span><span class="sw" style="background:var(--spirit)"></span>pray · read · praise</span>
          <span><span class="sw" style="background:var(--soul)"></span>study · lead · relate</span>
          <span><span class="sw" style="background:var(--body)"></span>eat · clothe · reside</span>
        </div>
      </div>
      ${noteBlockHtml(keyQuaday(d, snap.quaday.idx))}
    `;
    return { html: section('quaday','Quaday',`Block ${snap.quaday.idx+1} of 8 · ${snap.quaday.label}h`, 'Every day repeats eight of these three-hour blocks.', inner),
      unitKey: keyQuaday(d, snap.quaday.idx) };
  }

  // ---------- QUARTER DAY (6h blocks) ----------
  function quarterDayCard(snap){
    const d = snap.date;
    const tiles = TE.QUARTERDAY_LABELS.map((lab,i)=>{
      const isNow = TE.dkey(d)===TE.dkey(new Date()) && i===snap.quarterDay.idx;
      return `<div class="tile ${isNow?'now':''}"><span class="t-label">${lab}h</span><span class="t-value readout">${i+1}</span></div>`;
    }).join('');
    const inner = `
      <div class="card"><div class="tile-grid cols-4">${tiles}</div></div>
      ${noteBlockHtml(keyQuarterDay(d, snap.quarterDay.idx))}
    `;
    return { html: section('qday','Quarter‑day', `${snap.quarterDay.label}h window`, 'Four six-hour windows across the day.', inner),
      unitKey: keyQuarterDay(d, snap.quarterDay.idx) };
  }

  // ---------- NOON / NIGHT ----------
  function noonCard(snap){
    const d = snap.date;
    const inner = `
      <div class="card">
        <div class="tile-grid cols-2">
          <div class="tile ${snap.noon?'now':''}"><span class="t-label">06:00–18:00</span><span class="t-value readout">Noon</span></div>
          <div class="tile ${!snap.noon?'now':''}"><span class="t-label">18:00–06:00</span><span class="t-value readout">Night</span></div>
        </div>
      </div>
      ${noteBlockHtml(keyNoon(d, snap.noon))}
    `;
    return { html: section('noon','Noon / Night', snap.noon?'Noon (day half)':'Night', '', inner), unitKey: keyNoon(d, snap.noon) };
  }

  // ---------- DAY ----------
  function dayCard(snap){
    const d = snap.date;
    const inner = `${noteBlockHtml(keyDay(d))}`;
    return { html: section('day','Day', `${snap.day.weekday}, ${M[snap.month.idx]} ${snap.day.date}, ${snap.year}`, '', inner), unitKey: keyDay(d) };
  }

  // ---------- WEEK (mountain: Su Mo Tu / We / Th Fr Sa) ----------
  function weekCard(snap, onFocus){
    const wk = snap.week;
    const todayKey = TE.dkey(snap.date);
    function node(i, extraClass){
      const day = wk.days[i];
      const isSel = TE.dkey(day)===todayKey;
      const cls = ['mnode'];
      if(i===3) cls.push('peak');
      if(isSel) cls.push('now');
      if(extraClass) cls.push(extraClass);
      return `<div class="${cls.join(' ')}" data-idx="${i}">${WDS[i]}<small>${day.getDate()}</small></div>`;
    }
    const inner = `
      <div class="card">
        <div class="mountain">
          <div class="mrow upper">${node(0)}${node(1)}${node(2)}</div>
          <div class="mrow peakrow">${node(3)}</div>
          <div class="mrow lower">${node(4)}${node(5)}${node(6)}</div>
        </div>
        <div class="legend"><span><span class="sw" style="background:var(--peak)"></span>Wednesday is the week's peak</span></div>
      </div>
      ${noteBlockHtml(keyWeek(wk.sunday))}
    `;
    const html = section('week','Week', `${TE.dkey(wk.sunday)} → ${TE.dkey(wk.days[6])}`, 'Sunday to Saturday, Wednesday at the summit.', inner);
    return { html, unitKey: keyWeek(wk.sunday), wire(root){
      root.querySelectorAll('#sec-week .mnode').forEach(n=>{
        n.onclick = ()=> onFocus(wk.days[parseInt(n.dataset.idx,10)]);
      });
    }};
  }

  // ---------- 10-DAY DECILES ----------
  function decileCard(snap, onFocus){
    const d = snap.date;
    const dec = snap.decile;
    const ranges = [[1,10],[11,20],[21,dec.dim]];
    const tiles = ranges.map(([s,e],i)=>`
      <div class="tile ${i===dec.idx?'now':''}" data-idx="${i}"><span class="t-label">Block ${i+1}</span><span class="t-value readout">${s}–${e}</span></div>
    `).join('');
    const inner = `
      <div class="card"><div class="tile-grid cols-3">${tiles}</div></div>
      ${noteBlockHtml(keyDecile(d, dec.idx))}
    `;
    const html = section('decile','10‑day block', `Days ${dec.start}–${dec.end}`, 'The month split into thirds of ten (or so) days.', inner);
    return { html, unitKey: keyDecile(d, dec.idx), wire(root){
      root.querySelectorAll('#sec-decile .tile').forEach(t=>{
        t.onclick = ()=>{
          const i = parseInt(t.dataset.idx,10);
          const newDay = new Date(d.getFullYear(), d.getMonth(), ranges[i][0]);
          onFocus(newDay);
        };
      });
    }};
  }

  // ---------- MONTH (weeks & dates grid) ----------
  function monthCard(snap, onFocus){
    const d = snap.date;
    const weeks = TE.monthWeeks(d.getFullYear(), d.getMonth());
    const todayKey = TE.dkey(d);
    const head = WDS.map(w=>`<div class="t-label" style="text-align:center">${w}</div>`).join('');
    const rows = weeks.map(week=>{
      return `<div class="tile-grid cols-7" style="margin-bottom:6px">` + week.map(cell=>{
        if(!cell) return `<div class="tile filler-cell" style="visibility:hidden">·</div>`;
        const isToday = TE.dkey(cell)===todayKey;
        const isWed = cell.getDay()===3;
        return `<div class="tile ${isToday?'now':''} ${isWed?'peak':''}" data-date="${TE.dkey(cell)}" style="padding:8px 2px"><span class="t-value readout">${cell.getDate()}</span></div>`;
      }).join('') + `</div>`;
    }).join('');
    const inner = `
      <div class="card">
        <div class="tile-grid cols-7" style="margin-bottom:4px">${head}</div>
        ${rows}
        <div class="legend"><span><span class="sw" style="background:var(--peak)"></span>Wednesdays</span></div>
      </div>
      ${noteBlockHtml(keyMonth(d.getFullYear(), d.getMonth()))}
    `;
    const html = section('month','Month', `${M[d.getMonth()]} ${d.getFullYear()}`, '', inner);
    return { html, unitKey: keyMonth(d.getFullYear(), d.getMonth()), wire(root){
      root.querySelectorAll('#sec-month [data-date]').forEach(t=>{
        t.onclick = ()=>{
          const [y,m,day] = t.dataset.date.split('-').map(Number);
          onFocus(new Date(y, m-1, day));
        };
      });
    }};
  }

  // ---------- QUARTER (8-week mountain of two months + fasting month as peak) ----------
  function quarterCard(snap, onFocus){
    const d = snap.date;
    const q = snap.quarter;
    const weeksHtml = q.workingWeeks.map(w=>{
      const anyDate = w.cells.find(x=>x);
      const label = anyDate ? anyDate.getDate()+' '+M[anyDate.getMonth()].slice(0,3) : '';
      return `<div class="mnode ${w.peak?'peak':''}" data-week="${w.n}">W${w.n}<small>${label}</small></div>`;
    });
    // lay out as two rows of 4 (weeks 1-4, 5-8) with the peak (4,5) meeting at centre
    const row1 = weeksHtml.slice(0,4).join('');
    const row2 = weeksHtml.slice(4,8).join('');
    const inner = `
      <div class="card">
        <h4>Two working months — eight weeks</h4>
        <div class="mountain">
          <div class="mrow upper">${row1}</div>
          <div class="mrow lower">${row2}</div>
        </div>
        <div class="legend"><span><span class="sw" style="background:var(--peak)"></span>Weeks 4–5 are the quarter's peak</span></div>
      </div>
      <div class="card">
        <h4>Fasting month · the quarter's summit</h4>
        <div class="tile now peak" style="max-width:220px" data-month="${q.fastingMonth.idx}">
          <span class="t-label">Month 3 of ${q.label}</span>
          <span class="t-value readout">${q.fastingMonth.name}</span>
        </div>
      </div>
      ${noteBlockHtml(keyQuarter(d.getFullYear(), q.q))}
    `;
    const html = section('quarter','Quarter', `${q.label} · ${q.range}`, 'Fasting falls in March, June, September, December.', inner);
    return { html, unitKey: keyQuarter(d.getFullYear(), q.q), wire(root){
      root.querySelectorAll('#sec-quarter [data-week]').forEach(n=>{
        n.onclick = ()=>{
          const w = q.workingWeeks.find(x=>x.n===parseInt(n.dataset.week,10));
          const anyDate = w.cells.find(x=>x);
          if(anyDate) onFocus(anyDate);
        };
      });
      const fm = root.querySelector('#sec-quarter [data-month]');
      if(fm) fm.onclick = ()=> onFocus(new Date(d.getFullYear(), q.fastingMonth.idx, 1));
    }};
  }

  // ---------- HALF YEAR ----------
  function halfYearCard(snap, onFocus){
    const d = snap.date;
    const h = snap.halfYear.h;
    const inner = `
      <div class="card">
        <div class="tile-grid cols-2">
          <div class="tile ${h===0?'now':''}" data-h="0"><span class="t-label">Jan–Jun</span><span class="t-value readout">H1</span></div>
          <div class="tile ${h===1?'now':''}" data-h="1"><span class="t-label">Jul–Dec</span><span class="t-value readout">H2</span></div>
        </div>
      </div>
      ${noteBlockHtml(keyHalf(d.getFullYear(), h))}
    `;
    const html = section('half','Half‑year', snap.halfYear.label, '', inner);
    return { html, unitKey: keyHalf(d.getFullYear(), h), wire(root){
      root.querySelectorAll('#sec-half [data-h]').forEach(t=>{
        t.onclick = ()=> onFocus(new Date(d.getFullYear(), parseInt(t.dataset.h,10)*6, 1));
      });
    }};
  }

  // ---------- YEAR (as 4 quarters) ----------
  function yearCard(snap, onFocus){
    const d = snap.date;
    const curQ = snap.quarter.q;
    const tiles = ['Q1\nJan–Mar','Q2\nApr–Jun','Q3\nJul–Sep','Q4\nOct–Dec'].map((lab,i)=>{
      const [t1,t2]=lab.split('\n');
      return `<div class="tile ${i===curQ?'now':''}" data-q="${i}"><span class="t-label">${t2}</span><span class="t-value readout">${t1}</span></div>`;
    }).join('');
    const inner = `
      <div class="card"><div class="tile-grid cols-4">${tiles}</div></div>
      ${noteBlockHtml(keyYear(snap.year))}
    `;
    const html = section('year','Year', String(snap.year), '', inner);
    return { html, unitKey: keyYear(snap.year), wire(root){
      root.querySelectorAll('#sec-year [data-q]').forEach(t=>{
        t.onclick = ()=> onFocus(new Date(snap.year, parseInt(t.dataset.q,10)*3, 1));
      });
    }};
  }

  // ---------- 4-YEAR CYCLE ----------
  function fourYearCard(snap, onFocus){
    const fy = snap.fourYear;
    const years=[];
    for(let y=fy.start;y<=fy.end;y++) years.push(y);
    const tiles = years.map(y=>`<div class="tile ${y===snap.year?'now':''}" data-y="${y}"><span class="t-value readout">${y}</span></div>`).join('');
    const inner = `
      <div class="card"><div class="tile-grid cols-4">${tiles}</div></div>
      ${noteBlockHtml(keyFourYear(fy.start, fy.end))}
    `;
    const html = section('4y','4‑year cycle', fy.label, '', inner);
    return { html, unitKey: keyFourYear(fy.start, fy.end), wire(root){
      root.querySelectorAll('#sec-4y [data-y]').forEach(t=>{
        t.onclick = ()=> onFocus(new Date(parseInt(t.dataset.y,10), snap.date.getMonth(), 1));
      });
    }};
  }

  // ---------- 7-YEAR CYCLE (mountain, year 4 = peak) ----------
  function sevenYearCard(snap, onFocus){
    const sy = snap.sevenYear;
    const years=[]; for(let y=sy.start;y<=sy.end;y++) years.push(y);
    // arrange like the week: 3 up, peak, 3 down
    function node(i){
      const y = years[i];
      const cls=['mnode']; if(i===3) cls.push('peak'); if(y===snap.year) cls.push('now');
      return `<div class="${cls.join(' ')}" data-y="${y}">${y}</div>`;
    }
    const inner = `
      <div class="card">
        <div class="mountain">
          <div class="mrow upper">${node(0)}${node(1)}${node(2)}</div>
          <div class="mrow peakrow">${node(3)}</div>
          <div class="mrow lower">${node(4)}${node(5)}${node(6)}</div>
        </div>
        <div class="legend"><span><span class="sw" style="background:var(--peak)"></span>Year 4 is this cycle's peak, like Wednesday in a week</span></div>
      </div>
      ${noteBlockHtml(keySevenYear(sy.start, sy.end))}
    `;
    const html = section('7y','7‑year cycle', sy.label, '', inner);
    return { html, unitKey: keySevenYear(sy.start, sy.end), wire(root){
      root.querySelectorAll('#sec-7y .mnode').forEach(t=>{
        t.onclick = ()=> onFocus(new Date(parseInt(t.dataset.y,10), snap.date.getMonth(), 1));
      });
    }};
  }

  // ---------- 49-YEAR ("product of seven" — seven 7-year-cycles, week-shaped) ----------
  function fortyNineCard(snap, onFocus){
    const fn = snap.fortyNine;
    const cycles=[];
    for(let i=0;i<7;i++){ const s=fn.start+i*7; cycles.push({s, e:s+6}); }
    function node(i){
      const c = cycles[i];
      const cls=['mnode']; if(i===3) cls.push('peak'); if(i===fn.posInBigCycle) cls.push('now');
      return `<div class="${cls.join(' ')}" data-i="${i}">${c.s}–${c.e}</div>`;
    }
    const inner = `
      <div class="card">
        <h4>Seven 7‑year cycles, arranged like a week</h4>
        <div class="mountain">
          <div class="mrow upper">${node(0)}${node(1)}${node(2)}</div>
          <div class="mrow peakrow">${node(3)}</div>
          <div class="mrow lower">${node(4)}${node(5)}${node(6)}</div>
        </div>
      </div>
      ${noteBlockHtml(keyFortyNine(fn.start, fn.end))}
    `;
    const html = section('49y','49‑year cycle', fn.label, 'The 7‑year cycle repeated seven times over.', inner);
    return { html, unitKey: keyFortyNine(fn.start, fn.end), wire(root){
      root.querySelectorAll('#sec-49y .mnode').forEach(t=>{
        const c = cycles[parseInt(t.dataset.i,10)];
        t.onclick = ()=> onFocus(new Date(c.s, snap.date.getMonth(), 1));
      });
    }};
  }

  // ---------- DECADE ----------
  function decadeCard(snap, onFocus){
    const dec = snap.decade;
    const years=[]; for(let y=dec.start;y<=dec.end;y++) years.push(y);
    const tiles = years.map(y=>`<div class="tile ${y===snap.year?'now':''}" data-y="${y}"><span class="t-value readout">${y}</span></div>`).join('');
    const inner = `
      <div class="card"><div class="tile-grid cols-2">${tiles}</div></div>
      ${noteBlockHtml(keyDecade(dec.start))}
    `;
    const html = section('decade','10‑year unit', dec.label, '', inner);
    return { html, unitKey: keyDecade(dec.start), wire(root){
      root.querySelectorAll('#sec-decade [data-y]').forEach(t=>{
        t.onclick = ()=> onFocus(new Date(parseInt(t.dataset.y,10), snap.date.getMonth(), 1));
      });
    }};
  }

  // ---------- CENTURY ----------
  function centuryCard(snap, onFocus){
    const cen = snap.century;
    const blocks=[]; for(let s=cen.start; s<cen.end; s+=10) blocks.push(s); // 2001,2011,...,2091
    const curBlock = blocks.find(s => snap.year>=s && snap.year<=s+9) ?? blocks[blocks.length-1];
    const tiles = blocks.map(s=>`<div class="tile ${s===curBlock?'now':''}" data-s="${s}"><span class="t-value readout">${s}–${s+9}</span></div>`).join('');
    const inner = `
      <div class="card"><div class="tile-grid cols-2">${tiles}</div></div>
      ${noteBlockHtml(keyCentury(cen.start))}
    `;
    const html = section('century','100‑year unit', cen.label, '', inner);
    return { html, unitKey: keyCentury(cen.start), wire(root){
      root.querySelectorAll('#sec-century [data-s]').forEach(t=>{
        t.onclick = ()=> onFocus(new Date(parseInt(t.dataset.s,10), snap.date.getMonth(), 1));
      });
    }};
  }

  return {
    keyQuaday, keyDay, keyWeek, keyMonth,
    noteBlockHtml, wireNoteBlock,
    liveCard, tickLive,
    quadayCard, quarterDayCard, noonCard, dayCard, weekCard, decileCard,
    monthCard, quarterCard, halfYearCard, yearCard, fourYearCard,
    sevenYearCard, fortyNineCard, decadeCard, centuryCard
  };
})();
