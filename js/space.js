/* ===========================================================
   SPACE
   Captures GPS coordinates automatically. If the coordinates
   land within a saved place's radius, that place's name is
   applied automatically (as on a map). Otherwise the raw
   coordinates are offered for naming and saving.
   =========================================================== */

const Space = (function(){

  let lastFix = null;     // {lat, lon, acc, ts}
  let lastPlace = null;   // matched or newly-created place id

  function currentPlaceId(){ return lastPlace; }

  function locate(onDone){
    if(!('geolocation' in navigator)){
      onDone && onDone({error:'Geolocation is not available on this device.'});
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos=>{
        lastFix = { lat:pos.coords.latitude, lon:pos.coords.longitude, acc:pos.coords.accuracy, ts:Date.now() };
        const match = Store.nearestPlace(lastFix.lat, lastFix.lon);
        lastPlace = match ? match.id : null;
        onDone && onDone({ fix:lastFix, match });
      },
      err=>{ onDone && onDone({ error: err.message || 'Could not get location.' }); },
      { enableHighAccuracy:true, timeout:12000, maximumAge:30000 }
    );
  }

  function render(container){
    container.innerHTML = `
      <div class="unit-head">
        <div class="unit-eyebrow">Space</div>
        <div class="unit-title">Where</div>
        <div class="unit-sub">Coordinates are captured automatically and matched to places you've already named.</div>
      </div>

      <div class="card">
        <button class="btn btn-primary" id="locateBtn">📍 Capture location now</button>
        <div class="geo-status" id="geoStatus">No fix yet this session.</div>
      </div>

      <div class="card" id="nameCard" style="display:none">
        <h4>Name this place</h4>
        <div class="entry-form">
          <input type="text" id="placeNameInput" placeholder="e.g. Dar es Salaam — home">
          <label class="hint" style="display:flex;gap:6px;align-items:center;">
            Match radius (m)
            <input type="number" id="placeRadius" value="150" style="width:80px;background:var(--panel2);border:1px solid var(--line);color:var(--parchment);border-radius:6px;padding:4px 6px;">
          </label>
          <button class="btn btn-primary" id="savePlaceBtn">Save place</button>
        </div>
      </div>

      <div class="card">
        <h4>Saved places</h4>
        <div class="place-list" id="placeList"></div>
      </div>
    `;

    container.querySelector('#locateBtn').onclick = ()=>{
      container.querySelector('#geoStatus').textContent = 'Locating…';
      locate(res=>{
        const status = container.querySelector('#geoStatus');
        const nameCard = container.querySelector('#nameCard');
        if(res.error){ status.textContent = res.error; nameCard.style.display='none'; return; }
        if(res.match){
          status.innerHTML = `Fix ±${Math.round(res.fix.acc)}m — matched <strong>${res.match.name}</strong>.`;
          nameCard.style.display='none';
        } else {
          status.innerHTML = `Fix ±${Math.round(res.fix.acc)}m at ${res.fix.lat.toFixed(5)}, ${res.fix.lon.toFixed(5)} — not yet named.`;
          nameCard.style.display='block';
        }
      });
    };

    container.querySelector('#savePlaceBtn').onclick = ()=>{
      if(!lastFix) return;
      const name = container.querySelector('#placeNameInput').value.trim();
      if(!name) return;
      const radius = parseInt(container.querySelector('#placeRadius').value,10) || 150;
      const place = Store.addPlace({ name, lat:lastFix.lat, lon:lastFix.lon, radius });
      lastPlace = place.id;
      container.querySelector('#nameCard').style.display='none';
      container.querySelector('#geoStatus').innerHTML = `Saved as <strong>${place.name}</strong>.`;
      renderPlaceList(container);
    };

    renderPlaceList(container);
  }

  function renderPlaceList(container){
    const list = container.querySelector('#placeList');
    const places = Store.listPlaces();
    if(!places.length){ list.innerHTML = '<div class="empty">No places saved yet.</div>'; return; }
    list.innerHTML = places.map(p=>`
      <div class="place">
        <div>
          <div class="place-name">${p.name}</div>
          <div class="place-coords">${p.lat.toFixed(4)}, ${p.lon.toFixed(4)} · r${p.radius}m</div>
        </div>
        <button class="entry-del" data-del="${p.id}">✕</button>
      </div>
    `).join('');
    list.querySelectorAll('[data-del]').forEach(b=>{
      b.onclick = ()=>{ Store.deletePlace(b.dataset.del); renderPlaceList(container); };
    });
  }

  return { render, locate, currentPlaceId };
})();
window.Space = Space;
