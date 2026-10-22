/* ===========================================================
   MATTER
   Data collection for the current time unit: camera / video / text.
   Text uses a "selection list": type, matching prior entries show
   as choices; if nothing matches, the typed phrase is offered as
   a new item to add. Every entry is tagged Spirit / Soul / Body.
   =========================================================== */

const Matter = (function(){

  let currentCat = 'spirit';
  let currentType = 'text';
  let pendingMedia = null; // {dataUrl, kind}

  function render(container, unitKey, suggestedCat){
    currentCat = suggestedCat || currentCat;
    container.innerHTML = `
      <div class="unit-head">
        <div class="unit-eyebrow">Matter · this unit</div>
        <div class="unit-title">Collect</div>
        <div class="unit-sub">Text, camera or video — filed under Spirit, Soul or Body.</div>
      </div>

      <div class="card">
        <h4>Category</h4>
        <div class="chip-row" id="catRow">
          <button class="chip" data-cat="spirit">Spirit</button>
          <button class="chip" data-cat="soul">Soul</button>
          <button class="chip" data-cat="body">Body</button>
        </div>

        <h4>Type</h4>
        <div class="type-row" id="typeRow">
          <button class="type-btn" data-type="text">✎ Text</button>
          <button class="type-btn" data-type="photo">📷 Photo</button>
          <button class="type-btn" data-type="video">🎥 Video</button>
        </div>
      </div>

      <div class="card">
        <h4>Entry</h4>
        <div class="entry-form" id="entryForm"></div>
      </div>

      <div class="card">
        <h4>Logged in this unit</h4>
        <div class="entry-list" id="entryList"></div>
      </div>
    `;

    container.querySelectorAll('#catRow .chip').forEach(b=>{
      b.classList.toggle('active', b.dataset.cat===currentCat);
      b.onclick = ()=>{ currentCat=b.dataset.cat; renderChips(container); };
    });
    container.querySelectorAll('#typeRow .type-btn').forEach(b=>{
      b.classList.toggle('active', b.dataset.type===currentType);
      b.onclick = ()=>{ currentType=b.dataset.type; pendingMedia=null; renderForm(container, unitKey); };
    });

    renderForm(container, unitKey);
    renderList(container, unitKey);
  }

  function renderChips(container){
    container.querySelectorAll('#catRow .chip').forEach(b=>{
      b.classList.toggle('active', b.dataset.cat===currentCat);
    });
  }

  function renderForm(container, unitKey){
    const form = container.querySelector('#entryForm');
    if(currentType==='text'){
      form.innerHTML = `
        <div class="autocomplete">
          <input type="text" id="matterText" placeholder="Write, or pick from your list…" autocomplete="off">
          <div class="ac-list" id="acList" style="display:none"></div>
        </div>
        <textarea class="note-area" id="matterDesc" placeholder="Further description (optional)" style="min-height:60px"></textarea>
        <button class="btn btn-primary" id="saveTextBtn">Add to unit</button>
      `;
      const input = form.querySelector('#matterText');
      const acList = form.querySelector('#acList');

      function showAc(){
        const q = input.value;
        const results = Store.searchVocab(q);
        acList.innerHTML='';
        if(q.trim() && !Store.vocabHas(q.trim())){
          const div = document.createElement('div');
          div.className='ac-item new';
          div.textContent = `+ Add “${q.trim()}” as new`;
          div.onclick = ()=>{ input.value=q.trim(); acList.style.display='none'; };
          acList.appendChild(div);
        }
        results.forEach(r=>{
          const div = document.createElement('div');
          div.className='ac-item';
          div.textContent = r;
          div.onclick = ()=>{ input.value=r; acList.style.display='none'; };
          acList.appendChild(div);
        });
        acList.style.display = (results.length || q.trim()) ? 'block' : 'none';
      }
      input.addEventListener('input', showAc);
      input.addEventListener('focus', showAc);
      document.addEventListener('click', (e)=>{
        if(!form.contains(e.target)) acList.style.display='none';
      });

      form.querySelector('#saveTextBtn').onclick = ()=>{
        const text = input.value.trim();
        if(!text){ input.focus(); return; }
        const desc = form.querySelector('#matterDesc').value.trim();
        Store.addMatter({ unitKey, cat: currentCat, type:'text', text, desc, placeId: window.Space?.currentPlaceId?.() || null });
        input.value=''; form.querySelector('#matterDesc').value='';
        renderList(container, unitKey);
      };
    } else {
      // photo / video
      const accept = currentType==='photo' ? 'image/*' : 'video/*';
      const capture = currentType==='photo' ? 'environment' : 'environment';
      form.innerHTML = `
        <input type="file" id="mediaInput" accept="${accept}" capture="${capture}">
        <div id="mediaPreview"></div>
        <textarea class="note-area" id="matterDesc2" placeholder="Description (optional)" style="min-height:60px"></textarea>
        <button class="btn btn-primary" id="saveMediaBtn" disabled>Add to unit</button>
      `;
      const fileInput = form.querySelector('#mediaInput');
      const preview = form.querySelector('#mediaPreview');
      const saveBtn = form.querySelector('#saveMediaBtn');
      fileInput.onchange = ()=>{
        const file = fileInput.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = ()=>{
          pendingMedia = { dataUrl: reader.result, kind: currentType, name:file.name };
          preview.innerHTML = currentType==='photo'
            ? `<img class="entry-thumb" src="${reader.result}">`
            : `<video class="entry-thumb" src="${reader.result}" controls></video>`;
          saveBtn.disabled=false;
        };
        reader.readAsDataURL(file);
      };
      saveBtn.onclick = ()=>{
        if(!pendingMedia) return;
        const desc = form.querySelector('#matterDesc2').value.trim();
        Store.addMatter({ unitKey, cat: currentCat, type: currentType, text:'', desc, media: pendingMedia.dataUrl, placeId: window.Space?.currentPlaceId?.() || null });
        pendingMedia=null;
        renderForm(container, unitKey);
        renderList(container, unitKey);
      };
    }
  }

  function renderList(container, unitKey){
    const list = container.querySelector('#entryList');
    const entries = Store.listMatter(unitKey);
    if(!entries.length){ list.innerHTML = '<div class="empty">Nothing logged in this unit yet.</div>'; return; }
    list.innerHTML = entries.map(e=>`
      <div class="entry" data-id="${e.id}">
        <div class="cat-bar ${e.cat}"></div>
        <div class="entry-main">
          <div class="entry-title">${e.type==='text' ? escapeHtml(e.text) : (e.type==='photo'?'📷 Photo':'🎥 Video')}</div>
          ${e.desc ? `<div class="entry-desc">${escapeHtml(e.desc)}</div>` : ''}
          ${e.media && e.type==='photo' ? `<img class="entry-thumb" src="${e.media}">` : ''}
          ${e.media && e.type==='video' ? `<video class="entry-thumb" src="${e.media}" controls></video>` : ''}
          <div class="entry-meta">${new Date(e.ts).toLocaleTimeString()} · ${cap(e.cat)}${placeName(e.placeId)}</div>
        </div>
        <button class="entry-del" data-del="${e.id}" title="Delete">✕</button>
      </div>
    `).join('');
    list.querySelectorAll('[data-del]').forEach(b=>{
      b.onclick = ()=>{ Store.deleteMatter(b.dataset.del); renderList(container, unitKey); };
    });
  }

  function placeName(placeId){
    if(!placeId) return '';
    const p = Store.listPlaces().find(x=>x.id===placeId);
    return p ? ' · '+p.name : '';
  }
  function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
  function escapeHtml(s){
    return s.replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  return { render };
})();
