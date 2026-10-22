/* ===========================================================
   STORAGE
   All state lives in localStorage under a handful of keys so
   export/import/wipe are trivial. Nothing ever leaves the device.
   =========================================================== */

const Store = (function(){

  const KEYS = {
    notes: 'tms.notes',        // { [unitKey]: { plan, record, evaluate } }
    matter: 'tms.matter',      // [ {id, unitKey, cat, type, text, desc, media, placeId, ts} ]
    vocab: 'tms.vocab',        // { [text]: count }  -- the "selection list" of prior words
    places: 'tms.places',      // [ {id, name, lat, lon, radius} ]
    settings: 'tms.settings'   // { fourYearMode, fourYearAnchor, sevenYearAnchor }
  };

  function read(key, fallback){
    try{
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    }catch(e){ return fallback; }
  }
  function write(key, val){
    try{ localStorage.setItem(key, JSON.stringify(val)); return true; }
    catch(e){ console.error('Storage write failed', e); return false; }
  }

  // ---- notes (plan/record/evaluate per unit instance) ----
  function getNote(unitKey){
    const all = read(KEYS.notes, {});
    return all[unitKey] || { plan:'', record:'', evaluate:'' };
  }
  function setNote(unitKey, phase, text){
    const all = read(KEYS.notes, {});
    if(!all[unitKey]) all[unitKey] = { plan:'', record:'', evaluate:'' };
    all[unitKey][phase] = text;
    write(KEYS.notes, all);
  }

  // ---- matter entries ----
  function listMatter(unitKey){
    const all = read(KEYS.matter, []);
    return unitKey ? all.filter(e=>e.unitKey===unitKey) : all;
  }
  function addMatter(entry){
    const all = read(KEYS.matter, []);
    entry.id = 'm_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
    entry.ts = Date.now();
    all.unshift(entry);
    write(KEYS.matter, all);
    if(entry.text) bumpVocab(entry.text);
    return entry;
  }
  function deleteMatter(id){
    const all = read(KEYS.matter, []).filter(e=>e.id!==id);
    write(KEYS.matter, all);
  }

  // ---- vocabulary / selection list ----
  function bumpVocab(text){
    const v = read(KEYS.vocab, {});
    v[text] = (v[text]||0)+1;
    write(KEYS.vocab, v);
  }
  function searchVocab(query){
    const v = read(KEYS.vocab, {});
    const q = (query||'').toLowerCase().trim();
    return Object.keys(v)
      .filter(k=>!q || k.toLowerCase().includes(q))
      .sort((a,b)=> v[b]-v[a])
      .slice(0,8);
  }
  function vocabHas(text){
    const v = read(KEYS.vocab, {});
    return Object.prototype.hasOwnProperty.call(v, text);
  }

  // ---- places ----
  function listPlaces(){ return read(KEYS.places, []); }
  function addPlace(place){
    const all = read(KEYS.places, []);
    place.id = 'p_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
    all.push(place);
    write(KEYS.places, all);
    return place;
  }
  function deletePlace(id){
    write(KEYS.places, read(KEYS.places, []).filter(p=>p.id!==id));
  }
  function nearestPlace(lat, lon){
    const all = read(KEYS.places, []);
    let best=null, bestD=Infinity;
    all.forEach(p=>{
      const d = haversine(lat,lon,p.lat,p.lon);
      if(d<bestD){ bestD=d; best=p; }
    });
    if(best && bestD <= (best.radius||150)) return best;
    return null;
  }
  function haversine(lat1,lon1,lat2,lon2){
    const R=6371000, toRad=x=>x*Math.PI/180;
    const dLat=toRad(lat2-lat1), dLon=toRad(lon2-lon1);
    const a=Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
    return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }

  // ---- settings ----
  function getSettings(){ return read(KEYS.settings, { fourYearMode:'calendar', fourYearAnchor:2024, sevenYearAnchor:2004 }); }
  function setSettings(s){ write(KEYS.settings, s); }

  // ---- export / import / wipe ----
  function exportAll(){
    const dump = {};
    Object.values(KEYS).forEach(k=> dump[k] = read(k, null));
    dump._exportedAt = new Date().toISOString();
    dump._app = 'time-matter-space';
    return dump;
  }
  function importAll(dump){
    Object.values(KEYS).forEach(k=>{
      if(dump[k] !== undefined && dump[k] !== null) write(k, dump[k]);
    });
  }
  function wipeAll(){
    Object.values(KEYS).forEach(k=> localStorage.removeItem(k));
  }

  return {
    KEYS, getNote, setNote,
    listMatter, addMatter, deleteMatter,
    searchVocab, vocabHas,
    listPlaces, addPlace, deletePlace, nearestPlace, haversine,
    getSettings, setSettings,
    exportAll, importAll, wipeAll
  };
})();
