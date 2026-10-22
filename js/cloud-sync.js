/* ===========================================================
   FIREBASE CLOUD SYNC
   localStorage remains the app's offline-first source of truth.
   Once configured and signed in, changes merge with a private
   Firestore collection and are retried when the device reconnects.
   =========================================================== */

const TmsCloudSync = (function(){
  const CONFIG_KEY = 'tms.firebaseConfig';
  const META_KEY = 'tms.syncMeta';
  const COLLECTION = 'records';
  const MAX_MEDIA_CHARS = 700 * 1024;
  const SDK_VERSION = '10.14.1';
  const KEYS = {
    notes: 'tms.notes',
    matter: 'tms.matter',
    vocab: 'tms.vocab',
    places: 'tms.places',
    settings: 'tms.settings',
    tombstones: 'tms.syncTombstones'
  };

  let app = null;
  let auth = null;
  let db = null;
  let syncing = false;
  let syncRequested = false;
  let scheduled = null;
  let listenersBound = false;
  let status = { state:'not-configured', message:'Cloud sync is not configured.' };
  const statusListeners = new Set();

  function notify(next){
    status = Object.assign({}, status, next);
    statusListeners.forEach(fn=>fn(status));
    document.dispatchEvent(new CustomEvent('tms:sync-status', { detail:status }));
  }

  function subscribe(fn){
    statusListeners.add(fn);
    fn(status);
    return ()=>statusListeners.delete(fn);
  }

  function getConfig(){
    try{ return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}'); }
    catch(_){ return {}; }
  }

  function saveConfig(config){
    const clean = {
      apiKey:String(config.apiKey||'').trim(),
      authDomain:String(config.authDomain||'').trim(),
      projectId:String(config.projectId||'').trim(),
      appId:String(config.appId||'').trim()
    };
    localStorage.setItem(CONFIG_KEY, JSON.stringify(clean));
    app = auth = db = null;
    notify({state:'configured', message:'Firebase settings saved. Sign in or create an account to sync.'});
    return clean;
  }

  function validConfig(c){ return !!(c.apiKey && c.authDomain && c.projectId && c.appId); }

  function loadScript(url){
    return new Promise((resolve,reject)=>{
      const existing = [...document.scripts].find(s=>s.src===url);
      if(existing){
        if(existing.dataset.loaded==='true'){ resolve(); return; }
        existing.addEventListener('load', resolve, {once:true});
        existing.addEventListener('error', ()=>reject(new Error('Could not load Firebase SDK. Check your internet connection.')), {once:true});
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.onload = ()=>{ script.dataset.loaded='true'; resolve(); };
      script.onerror = ()=>{ script.remove(); reject(new Error('Could not load Firebase SDK. Check your internet connection.')); };
      document.head.appendChild(script);
    });
  }

  async function initialize(){
    const config = getConfig();
    if(!validConfig(config)) throw new Error('Enter the Firebase web app settings first.');
    if(app && auth && db) return;

    notify({state:'connecting', message:'Connecting to Firebase…'});
    const base = `https://www.gstatic.com/firebasejs/${SDK_VERSION}`;
    await loadScript(`${base}/firebase-app-compat.js`);
    await loadScript(`${base}/firebase-auth-compat.js`);
    await loadScript(`${base}/firebase-firestore-compat.js`);

    if(!window.firebase) throw new Error('Firebase SDK did not load.');
    app = window.firebase.apps.length ? window.firebase.app() : window.firebase.initializeApp(config);
    auth = window.firebase.auth();
    db = window.firebase.firestore();
    try{ await db.enablePersistence({synchronizeTabs:true}); }catch(_){ /* localStorage is the offline source of truth */ }
    bindListeners();
    notify({state:auth.currentUser ? 'signed-in' : 'ready', message:auth.currentUser ? `Signed in as ${auth.currentUser.email}.` : 'Firebase ready. Sign in or create an account.'});
  }

  function bindListeners(){
    if(listenersBound) return;
    listenersBound = true;
    window.addEventListener('online', ()=>{ if(auth?.currentUser) syncNow(); });
    window.addEventListener('offline', ()=>notify({state:'offline', message:'Offline — changes stay on this device and will sync when internet returns.'}));
    window.addEventListener('storage', e=>{ if(Object.values(KEYS).includes(e.key)) scheduleSync(); });
    document.addEventListener('tms:local-change', e=>{
      if(Object.values(KEYS).includes(e.detail?.key)) scheduleSync();
    });
    auth.onAuthStateChanged(user=>{
      if(user){ notify({state:'signed-in', message:`Signed in as ${user.email || 'Firebase user'}. Syncing…`}); syncNow(); }
      else notify({state:'ready', message:'Firebase ready. Sign in or create an account.'});
    });
    setInterval(()=>{
      if(document.visibilityState==='visible' && auth?.currentUser) syncNow();
    },120000);
  }

  async function ensureInitialized(){
    await initialize();
    if(!auth.currentUser) throw new Error('Sign in or create a Firebase account first.');
  }

  async function createAccount(email,password){
    await initialize();
    const credential = await auth.createUserWithEmailAndPassword(email.trim(), password);
    notify({state:'signed-in', message:`Account created for ${credential.user.email}. Syncing…`});
    return credential.user;
  }

  async function signIn(email,password){
    await initialize();
    const credential = await auth.signInWithEmailAndPassword(email.trim(), password);
    notify({state:'signed-in', message:`Signed in as ${credential.user.email}. Syncing…`});
    return credential.user;
  }

  async function signOut(){
    if(auth) await auth.signOut();
  }

  function readMeta(){
    try{ return JSON.parse(localStorage.getItem(META_KEY)||'{}'); }
    catch(_){ return {}; }
  }

  function readLocal(key, fallback){
    try{
      const raw=localStorage.getItem(key);
      return raw===null ? {exists:false,value:fallback} : {exists:true,value:JSON.parse(raw)};
    }catch(_){ return {exists:false,value:fallback}; }
  }

  function cloudDocId(id){ return String(id).replaceAll('%','%25').replaceAll('/','%2F').slice(0,1400); }

  function recordDoc(id,data,updatedAt){
    return {id, data, updatedAt:Number(updatedAt)||Date.now()};
  }

  function buildLocalRecords(){
    const meta=readMeta();
    const records=[];
    const bucket=(name,fallback)=>{
      const local=readLocal(KEYS[name],fallback);
      if(local.exists) records.push(recordDoc(name,local.value,meta[KEYS[name]]));
      return local.value;
    };

    const notes=bucket('notes',{});
    const vocab=bucket('vocab',{});
    const settings=bucket('settings',null);
    const matter=bucket('matter',[]);
    const places=bucket('places',[]);
    const tombstones=bucket('tombstones',[]);

    records.length=0;
    if(readLocal(KEYS.notes,null).exists) records.push(recordDoc('bucket_notes',notes,meta[KEYS.notes]));
    if(readLocal(KEYS.vocab,null).exists) records.push(recordDoc('bucket_vocab',vocab,meta[KEYS.vocab]));
    if(readLocal(KEYS.settings,null).exists) records.push(recordDoc('bucket_settings',settings,meta[KEYS.settings]));

    (Array.isArray(matter)?matter:[]).forEach(entry=>{
      records.push(recordDoc(`matter_${cloudDocId(entry.id)}`,Object.assign({},entry),entry.ts || meta[KEYS.matter]));
    });
    (Array.isArray(places)?places:[]).forEach(place=>records.push(recordDoc(`place_${cloudDocId(place.id)}`,place,place._updatedAt || meta[KEYS.places])));
    (Array.isArray(tombstones)?tombstones:[]).forEach(item=>records.push(recordDoc(`deleted_${item.kind}_${cloudDocId(item.id)}`,item,item.deletedAt)));
    return records;
  }

  function meaningful(value){
    if(value===null || value===undefined) return false;
    if(Array.isArray(value)) return value.length>0;
    if(typeof value==='object') return Object.keys(value).length>0;
    return true;
  }

  function updated(record){ return Number(record?.updatedAt)||0; }

  function mergeRecords(localRecords,cloudRecords){
    const merged=new Map(cloudRecords.map(record=>[record.id,record]));
    const localById=new Map(localRecords.map(record=>[record.id,record]));
    const localNotes=localById.get('bucket_notes');
    const cloudNotes=merged.get('bucket_notes');
    if(localNotes && cloudNotes && localNotes.data && cloudNotes.data){
      const notes=Object.assign({},cloudNotes.data);
      Object.entries(localNotes.data).forEach(([key,value])=>{
        if(!notes[key] || (Number(value?._updatedAt)||updated(localNotes)) >= (Number(notes[key]?._updatedAt)||updated(cloudNotes))) notes[key]=value;
      });
      merged.set('bucket_notes',recordDoc('bucket_notes',notes,Math.max(updated(localNotes),updated(cloudNotes))));
      localById.delete('bucket_notes');
      merged.delete('bucket_notes');
    }
    const localVocab=localById.get('bucket_vocab');
    const cloudVocab=merged.get('bucket_vocab');
    if(localVocab && cloudVocab && localVocab.data && cloudVocab.data){
      const vocab=Object.assign({},cloudVocab.data);
      Object.entries(localVocab.data).forEach(([term,count])=>{
        vocab[term]=Math.max(Number(vocab[term])||0,Number(count)||0);
      });
      merged.set('bucket_vocab',recordDoc('bucket_vocab',vocab,Math.max(updated(localVocab),updated(cloudVocab))));
      localById.delete('bucket_vocab');
      merged.delete('bucket_vocab');
    }

    for(const [id,local] of localById){
      const remote=merged.get(id);
      if(!remote || updated(local)>=updated(remote)) merged.set(id,local);
      else if(id.startsWith('matter_') && remote.data && local.data?.media && !remote.data.media){
        const repaired=Object.assign({},remote.data,{media:local.data.media});
        merged.set(id,recordDoc(id,repaired,updated(remote)));
      }
    }

    const tombstones=[...merged.values()].filter(r=>r.id.startsWith('deleted_'));
    tombstones.forEach(t=>{
      const targetId=`${t.data.kind}_${cloudDocId(t.data.id)}`;
      const target=merged.get(targetId);
      if(target && updated(t)>=updated(target)) merged.delete(targetId);
    });

    const matter=[...merged.values()].filter(r=>r.id.startsWith('matter_') && r.data && !r.data._deleted).map(r=>r.data);
    const places=[...merged.values()].filter(r=>r.id.startsWith('place_') && r.data && !r.data._deleted).map(r=>r.data);
    const notesRecord=merged.get('bucket_notes');
    const vocabRecord=merged.get('bucket_vocab');
    const settingsRecord=merged.get('bucket_settings');
    const cloudData={
      [KEYS.matter]:matter.sort((a,b)=>(b.ts||0)-(a.ts||0)),
      [KEYS.places]:places,
      [KEYS.tombstones]:tombstones.map(r=>r.data)
    };
    if(notesRecord) cloudData[KEYS.notes]=notesRecord.data || {};
    if(vocabRecord) cloudData[KEYS.vocab]=vocabRecord.data || {};
    if(settingsRecord) cloudData[KEYS.settings]=settingsRecord.data;
    return {records:[...merged.values()],data:cloudData};
  }

  async function syncNow(){
    if(syncing){ syncRequested=true; return; }
    if(!auth?.currentUser || !db) return;
    if(!navigator.onLine){ notify({state:'offline',message:'Offline — changes stay on this device and will sync when internet returns.'}); return; }
    syncing=true;
    notify({state:'syncing',message:'Syncing local data with Firebase…'});
    try{
      const collection=db.collection('users').doc(auth.currentUser.uid).collection(COLLECTION);
      const snapshot=await collection.get();
      const remote=snapshot.docs.map(doc=>Object.assign({id:doc.id},doc.data()));
      const remoteById=new Map(remote.map(record=>[record.id,record]));
      const result=mergeRecords(buildLocalRecords(),remote);
      const batchLimit=400;
      const pending=result.records.filter(record=>{
        const {id,...data}=record;
        if(data.data && typeof data.data==='object') data.data=Object.assign({},data.data);
        if(typeof data.data?.media==='string' && data.data.media.length>MAX_MEDIA_CHARS) delete data.data.media;
        const old=remoteById.get(id);
        return !old || JSON.stringify({data:old.data,updatedAt:old.updatedAt})!==JSON.stringify(data);
      });
      for(let i=0;i<pending.length;i+=batchLimit){
        const batch=db.batch();
        pending.slice(i,i+batchLimit).forEach(record=>{
          const {id,...data}=record;
          if(data.data && typeof data.data==='object') data.data=Object.assign({},data.data);
          if(typeof data.data?.media==='string' && data.data.media.length>MAX_MEDIA_CHARS) delete data.data.media;
          batch.set(collection.doc(id),data);
        });
        await batch.commit();
      }
      if(window.Store) Store.importAll(result.data,{silent:true});
      const bigMedia=readLocal(KEYS.matter,[]).value.filter(e=>typeof e.media==='string' && e.media.length>MAX_MEDIA_CHARS).length;
      notify({state:'synced',message:bigMedia ? `Synced. ${bigMedia} large media file(s) remain only on this device.` : `Synced just now · ${auth.currentUser.email || 'Firebase account'}.`,lastSyncedAt:Date.now()});
    }catch(error){
      notify({state:navigator.onLine?'error':'offline',message:navigator.onLine ? `Sync failed: ${error.message || 'Check Firebase setup and Firestore rules.'}` : 'Offline — changes stay on this device and will sync when internet returns.'});
    }finally{
      syncing=false;
      if(syncRequested){ syncRequested=false; setTimeout(syncNow,0); }
    }
  }

  function scheduleSync(){
    if(!auth?.currentUser) return;
    clearTimeout(scheduled);
    scheduled=setTimeout(syncNow,1200);
  }

  function getStatus(){ return status; }

  return { saveConfig,getConfig,initialize,createAccount,signIn,signOut,syncNow,subscribe,getStatus };
})();
