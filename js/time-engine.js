/* ===========================================================
   TIME ENGINE
   Pure functions that take a JS Date and derive every nested
   cycle described in the spec, plus stable string keys so the
   storage layer can key Plan/Record/Evaluate notes and Matter
   entries to the exact unit instance they belong to.
   =========================================================== */

const TE = (function(){

  const WEEKDAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const WEEKDAYS_SHORT = ['Su','Mo','Tu','We','Th','Fr','Sa'];
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  function pad(n,len){ return String(n).padStart(len||2,'0'); }
  function dkey(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function startOfDay(d){ const x=new Date(d); x.setHours(0,0,0,0); return x; }
  function addDays(d,n){ const x=new Date(d); x.setDate(x.getDate()+n); return x; }
  function daysInMonth(y,m){ return new Date(y,m+1,0).getDate(); }

  // ---- settings (anchors), persisted via Storage, read lazily ----
  function getAnchors(){
    try{
      const s = JSON.parse(localStorage.getItem('tms.settings')||'{}');
      return {
        fourYearMode: s.fourYearMode || 'calendar',
        fourYearAnchor: s.fourYearAnchor || 2024,
        sevenYearAnchor: s.sevenYearAnchor || 2004
      };
    }catch(e){ return {fourYearMode:'calendar', fourYearAnchor:2024, sevenYearAnchor:2004}; }
  }

  // ---------------- sub-day cycles ----------------

  function quadayIndex(hour){ return Math.floor(hour/3); } // 0..7
  const QUADAY_LABELS = ['0–3','3–6','6–9','9–12','12–15','15–18','18–21','21–24'];

  function quarterDayIndex(hour){ return Math.floor(hour/6); } // 0..3
  const QUARTERDAY_LABELS = ['0–6','6–12','12–18','18–24'];

  function isNoon(hour){ return hour>=6 && hour<18; }

  // ---------------- week (mountain layout) ----------------
  // Sunday..Saturday, Wednesday is peak.
  // Upper row: Su, Mo, Tu (ascending toward the peak)
  // Peak row:  We (elevated)
  // Lower row: Th, Fr, Sa (descending back down, Sa lands under Su)
  function weekOf(d){
    const dow = d.getDay(); // 0=Sun..6=Sat
    const sunday = addDays(d, -dow);
    const days = [];
    for(let i=0;i<7;i++) days.push(addDays(sunday,i));
    return { sunday, days, dow };
  }

  // ---------------- 10-day deciles ----------------
  function decileOf(d){
    const day = d.getDate();
    const y=d.getFullYear(), m=d.getMonth();
    const dim = daysInMonth(y,m);
    let idx, start, end;
    if(day<=10){ idx=0; start=1; end=10; }
    else if(day<=20){ idx=1; start=11; end=20; }
    else { idx=2; start=21; end=dim; }
    return { idx, start, end, dim };
  }

  // ---------------- month ----------------
  function monthWeeks(y,m){
    // returns array of weeks (each an array of 7 Date|null) Sun-start, spanning the calendar month
    const first = new Date(y,m,1);
    const dim = daysInMonth(y,m);
    const firstDow = first.getDay();
    const cells = [];
    for(let i=0;i<firstDow;i++) cells.push(null);
    for(let day=1; day<=dim; day++) cells.push(new Date(y,m,day));
    while(cells.length % 7 !== 0) cells.push(null);
    const weeks=[];
    for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
    return weeks;
  }

  // ---------------- quarter ----------------
  // Fasting months = 3,6,9,12 (last month of each quarter, index 2 within quarter).
  // The other two months together are walked as an 8-week mountain: 1,2,3,(4,5),6,7,8
  function quarterOf(d){
    const y = d.getFullYear();
    const q = Math.floor(d.getMonth()/3); // 0..3
    const monthsIdx = [q*3, q*3+1, q*3+2]; // 0-based month indices
    const fastingMonthIdx = monthsIdx[2]; // 3,6,9,12 (1-based == idx+1)
    const workingMonths = [monthsIdx[0], monthsIdx[1]];

    // Build sequential week list across the two working months (Sun-start weeks
    // that contain at least one day of either month), capped/labelled 1..8.
    const weeks = [];
    workingMonths.forEach(mi=>{
      const mw = monthWeeks(y, mi);
      mw.forEach(w=>{
        // only count a week once, keep the first date found for labelling
        const anyDate = w.find(x=>x);
        if(anyDate) weeks.push({ month: mi, cells: w });
      });
    });
    // de-duplicate weeks that straddle both months (share the same Sunday)
    const seen = new Set();
    const dedup = [];
    weeks.forEach(w=>{
      const sunday = dkey(addDays(w.cells.find(x=>x), -w.cells.find(x=>x).getDay()));
      if(!seen.has(sunday)){ seen.add(sunday); dedup.push(w); }
    });
    const numbered = dedup.slice(0,8).map((w,i)=>({
      n: i+1,
      peak: (i+1===4 || i+1===5),
      cells: w.cells
    }));

    return {
      q, // 0..3
      label: ['Q1','Q2','Q3','Q4'][q],
      range: MONTHS[monthsIdx[0]] + '–' + MONTHS[monthsIdx[2]],
      fastingMonth: { idx: fastingMonthIdx, name: MONTHS[fastingMonthIdx] },
      workingWeeks: numbered
    };
  }

  // ---------------- half year / year ----------------
  function halfYearOf(d){
    const h = d.getMonth()<6 ? 0 : 1;
    return { h, label: h===0?'H1 · Jan–Jun':'H2 · Jul–Dec' };
  }

  // ---------------- 4-year cycle ----------------
  function fourYearOf(d){
    const y = d.getFullYear();
    const a = getAnchors();
    let end;
    if(a.fourYearMode==='custom'){
      const anchor = a.fourYearAnchor;
      const diff = y - anchor;
      const k = Math.floor(diff/4);
      end = anchor + (k+1)*4 - 4 + 3; // recompute cleanly below
    }
    // simpler + robust calc, calendar-aligned to "end divisible by 4"
    end = y + ((4 - (y % 4)) % 4);
    if(end < y) end += 4;
    const start = end-3;
    return { start, end, label: start+'–'+end, posInCycle: y-start }; // posInCycle 0..3
  }

  // ---------------- 7-year cycle (and its "week-shaped" arrangement) ----------------
  function sevenYearOf(d){
    const y = d.getFullYear();
    const a = getAnchors();
    const anchor = a.sevenYearAnchor;
    const diff = y - anchor;
    const k = Math.floor(diff/7);
    const start = anchor + k*7;
    const end = start+6;
    const posInCycle = y-start; // 0..6, index 3 ("4th year") is the peak, mirroring Wednesday
    return { start, end, label: start+'–'+end, posInCycle, cycleIndex:k, anchor };
  }

  // ---------------- 49-year cycle: seven 7-year-cycles, arranged like a week ----------------
  function fortyNineYearOf(d){
    const sy = sevenYearOf(d);
    const bigK = Math.floor(sy.cycleIndex/7);
    const bigStartCycle = bigK*7;
    const start = sy.anchor + bigStartCycle*7;
    const end = start + 48;
    const posInBigCycle = sy.cycleIndex - bigStartCycle; // 0..6 -> which 7yr-cycle is "the week's day"
    return { start, end, label: start+'–'+end, posInBigCycle };
  }

  // ---------------- decade / century ----------------
  function decadeOf(d){
    const y=d.getFullYear();
    const start = Math.floor(y/10)*10;
    return { start, end:start+9, label:start+'–'+(start+9) };
  }
  // 1-indexed century convention: the 21st century runs 2001–2100
  // (matching the everyday convention, not the 2000–2099 block boundary).
  function centuryOf(d){
    const y=d.getFullYear();
    const idx = Math.ceil(y/100);      // e.g. 2026 -> 21
    const start = (idx-1)*100 + 1;     // 2001
    const end = idx*100;               // 2100
    return { start, end, label:start+'–'+end, ordinal: idx };
  }

  // ---------------- spirit / soul / body split of a quaday (3h block) ----------------
  // Spirit mark at the top of the block, Soul in the middle third, Body in the last third.
  function ssbSplit(hour){
    const blockStartHour = Math.floor(hour/3)*3;
    const minuteOfBlock = (hour-blockStartHour)*60; // 0..180
    let seg;
    if(minuteOfBlock < 60) seg='spirit';
    else if(minuteOfBlock < 120) seg='soul';
    else seg='body';
    return { blockStartHour, seg };
  }

  function snapshot(d){
    d = d || new Date();
    const hour = d.getHours();
    return {
      date: d,
      ms: d.getMilliseconds(),
      s: d.getSeconds(),
      min: d.getMinutes(),
      hour,
      quaday: { idx: quadayIndex(hour), label: QUADAY_LABELS[quadayIndex(hour)] },
      quarterDay: { idx: quarterDayIndex(hour), label: QUARTERDAY_LABELS[quarterDayIndex(hour)] },
      noon: isNoon(hour),
      ssb: ssbSplit(hour),
      day: { date: d.getDate(), weekday: WEEKDAYS[d.getDay()], key: dkey(d) },
      week: weekOf(d),
      decile: decileOf(d),
      month: { idx: d.getMonth(), name: MONTHS[d.getMonth()], year: d.getFullYear() },
      quarter: quarterOf(d),
      halfYear: halfYearOf(d),
      year: d.getFullYear(),
      fourYear: fourYearOf(d),
      sevenYear: sevenYearOf(d),
      fortyNine: fortyNineYearOf(d),
      decade: decadeOf(d),
      century: centuryOf(d)
    };
  }

  return {
    WEEKDAYS, WEEKDAYS_SHORT, MONTHS,
    pad, dkey, startOfDay, addDays, daysInMonth,
    quadayIndex, QUADAY_LABELS, quarterDayIndex, QUARTERDAY_LABELS, isNoon,
    weekOf, decileOf, monthWeeks, quarterOf, halfYearOf,
    fourYearOf, sevenYearOf, fortyNineYearOf, decadeOf, centuryOf,
    ssbSplit, snapshot, getAnchors
  };
})();
