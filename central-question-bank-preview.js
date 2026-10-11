/* MINDli DEV15 – browser/WebView central question bank preview.
   Opt-in API only. Never mutates QuizCore, an existing round, or bundled questions. */
(function(root){
  'use strict';
  const LANGS=Object.freeze(['sk','cs','en','de','pl','fr','it','es','pt','ja']);
  const VERSION=/^sha256:[a-f0-9]{64}$/;
  const ID=/^[\p{L}\p{N}][\p{L}\p{N}._:-]{2,239}$/u;
  const BASE='https://mindli-question-bank-admin-v2-xrac6ffdpq-ey.a.run.app';
  function need(ok,message){if(!ok)throw new Error('MINDLI_CENTRAL_'+message);}
  function same(a,b){return a.length===b.length&&a.every((x,i)=>x===b[i]);}
  function questionCheck(rows,language,count){
    need(Array.isArray(rows)&&rows.length===count,'COUNT_'+language);
    const ids=new Set();
    for(const q of rows){
      need(q&&typeof q==='object'&&!Array.isArray(q),'OBJECT_'+language);
      need(typeof q.id==='string'&&ID.test(q.id)&&!ids.has(q.id),'ID_'+language);
      ids.add(q.id);
      need(typeof q.text==='string'&&q.text.trim().length>0,'TEXT_'+language);
      need(typeof q.category==='string'&&q.category.trim().length>0,'CATEGORY_'+language);
      need(typeof q.difficulty==='string'&&q.difficulty.trim().length>0,'DIFFICULTY_'+language);
      need(Number.isInteger(q.difficultyLevel)&&q.difficultyLevel>=1,'LEVEL_'+language);
      need(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4,'ANSWER_'+language);
      need(Array.isArray(q.options)&&q.options.length===4,'OPTIONS_'+language);
      const opts=q.options.map(x=>typeof x==='string'?x.trim():'');
      need(opts.every(Boolean)&&new Set(opts.map(x=>x.toLocaleLowerCase(language))).size===4,'OPTIONS_INVALID_'+language);
    }
    return rows;
  }
  function manifestCheck(m){
    need(m&&m.protocolVersion===1&&VERSION.test(m.bankVersion),'MANIFEST');
    need(Number.isSafeInteger(m.releaseVersion)&&m.releaseVersion>=1,'RELEASE');
    need(Number.isSafeInteger(m.questionCount)&&m.questionCount>0&&m.questionCount<=50000,'COUNT');
    need(Array.isArray(m.languages)&&same([...m.languages].sort(),[...LANGS].sort()),'LANGUAGES');
    return m;
  }
  function checkAll(banks,manifest){
    const baseline=new Map();
    LANGS.forEach((lang,n)=>{
      questionCheck(banks[lang],lang,manifest.questionCount);
      for(const q of banks[lang]){
        const invariant=[q.category,q.difficulty,q.difficultyLevel,q.correctIndex];
        if(n===0)baseline.set(q.id,invariant);
        else need(baseline.has(q.id)&&same(baseline.get(q.id),invariant),'CROSS_LANGUAGE_'+lang);
      }
    });
  }
  function createIndexedDbStore({name='mindli-central-preview-dev15',indexedDBImpl=root.indexedDB}={}){
    need(indexedDBImpl&&typeof indexedDBImpl.open==='function','INDEXEDDB_UNAVAILABLE');
    let opened;
    function db(){
      if(opened)return opened;
      opened=new Promise((resolve,reject)=>{
        const req=indexedDBImpl.open(name,1);
        req.onupgradeneeded=()=>{
          const db=req.result;
          if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta');
          if(!db.objectStoreNames.contains('banks'))db.createObjectStore('banks');
        };
        req.onsuccess=()=>resolve(req.result);
        req.onerror=()=>reject(req.error||new Error('IDB_OPEN'));
      });
      return opened;
    }
    async function read(store,key){
      const connection=await db();
      return new Promise((resolve,reject)=>{
        const tx=connection.transaction(store,'readonly');
        const req=tx.objectStore(store).get(key);
        req.onsuccess=()=>resolve(req.result||null);
        req.onerror=()=>reject(req.error||new Error('IDB_READ'));
      });
    }
    async function commit(manifest,banks){
      const connection=await db();
      return new Promise((resolve,reject)=>{
        const tx=connection.transaction(['meta','banks'],'readwrite');
        let conflict=null;
        tx.oncomplete=()=>resolve();
        tx.onerror=()=>reject(tx.error||new Error('IDB_COMMIT'));
        tx.onabort=()=>reject(conflict||tx.error||new Error('IDB_ABORT'));
        const meta=tx.objectStore('meta');
        // Check the pointer *inside* this read/write transaction. Separate
        // WebViews sharing one IndexedDB cannot overwrite a newer release.
        const current=meta.get('active');
        current.onsuccess=()=>{
          const previous=current.result;
          if(previous&&previous.releaseVersion>=manifest.releaseVersion){
            if(previous.releaseVersion===manifest.releaseVersion&&
               previous.bankVersion===manifest.bankVersion)return;
            conflict=new Error('MINDLI_CENTRAL_RACING_RELEASE');
            tx.abort();return;
          }
          const store=tx.objectStore('banks');
          for(const lang of LANGS)store.put(banks[lang],manifest.bankVersion+':'+lang);
          // The pointer and ten banks commit in the same IndexedDB transaction.
          meta.put(manifest,'active');
        };
        current.onerror=()=>tx.abort();
      });
    }
    return {getActive:()=>read('meta','active'),
      load:(version,language)=>read('banks',version+':'+language),commit};
  }
  function createSyncClient({store,fetchImpl=root.fetch?.bind(root),baseUrl=BASE,
    timeoutMs=30000,attempts=3,onRetry=()=>{}}={}){
    need(store&&typeof store.getActive==='function'&&typeof store.load==='function'&&
      typeof store.commit==='function','STORAGE_REQUIRED');
    need(typeof fetchImpl==='function','FETCH_REQUIRED');
    const base=new URL(baseUrl);
    need(base.protocol==='https:'&&!base.username&&!base.password&&!base.search&&!base.hash&&
      (base.pathname==='/'||base.pathname===''),'HTTPS_ORIGIN');
    let inflight=null;
    async function request(path){
      const endpoint=new URL(path,base);
      need(endpoint.origin===base.origin,'FOREIGN_ORIGIN');
      for(let i=1;i<=attempts;i++){
        const c=new AbortController(),timer=setTimeout(()=>c.abort(),timeoutMs);
        try{
          const response=await fetchImpl(endpoint.href,{method:'GET',redirect:'error',
            cache:'no-store',headers:{Accept:'application/json'},signal:c.signal});
          need(response.status===200,'HTTP_'+response.status);
          need((response.headers.get('content-type')||'').includes('application/json'),'CONTENT_TYPE');
          return {data:await response.json(),etag:response.headers.get('etag')};
        }catch(error){
          const transient=error?.name==='AbortError'||error?.name==='TimeoutError'||error instanceof TypeError;
          if(!transient||i===attempts)throw error;
          try{onRetry({path,attempt:i,message:String(error.message||error)});}catch(_){}
        }finally{clearTimeout(timer);}
        await new Promise(resolve=>setTimeout(resolve,200*i));
      }
    }
    async function loadCached(language){
      need(LANGS.includes(language),'LANGUAGE');
      const meta=await store.getActive();
      if(!meta)return null;
      try{
        manifestCheck(meta);
        const rows=await store.load(meta.bankVersion,language);
        return {version:meta.bankVersion,releaseVersion:meta.releaseVersion,
          language,rows:questionCheck(rows,language,meta.questionCount)};
      }catch(_){return null;}
    }
    async function refresh(){
      const old=await store.getActive();
      try{
        const start=manifestCheck((await request('/api/question-bank/v1/manifest')).data);
        if(old&&old.bankVersion===start.bankVersion&&old.releaseVersion===start.releaseVersion)
          return {updated:false,source:'cache',version:old.bankVersion};
        need(!old||start.releaseVersion>=old.releaseVersion,'DOWNGRADE');
        const banks={};
        for(const lang of LANGS){
          const sync=(await request('/api/question-bank/v1/sync?language='+lang)).data;
          need(sync?.status==='update'&&sync.currentVersion===start.bankVersion&&
            sync.snapshotPath==='/api/question-bank/v1/banks/'+lang,'SYNC_'+lang);
          need(typeof sync.etag==='string'&&sync.etag.length>2,'ETAG_'+lang);
          const bank=await request(sync.snapshotPath);
          need(bank.etag===sync.etag,'ETAG_MISMATCH_'+lang);
          banks[lang]=questionCheck(bank.data,lang,start.questionCount);
        }
        checkAll(banks,start);
        const end=manifestCheck((await request('/api/question-bank/v1/manifest')).data);
        need(start.bankVersion===end.bankVersion&&start.releaseVersion===end.releaseVersion&&
          start.questionCount===end.questionCount,'RELEASE_CHANGED');
        // Atomic IndexedDB transaction: either all 10 + pointer are visible, or none.
        await store.commit(start,banks);
        return {updated:true,source:'remote',version:start.bankVersion,
          questionCount:start.questionCount,languages:[...LANGS]};
      }catch(error){
        const recovered=await store.getActive().catch(()=>old);
        if(recovered)return {updated:false,source:'cache',version:recovered.bankVersion,error:String(error.message||error)};
        throw error;
      }
    }
    function sync(){if(inflight)return inflight;const task=refresh().finally(()=>{inflight=null;});inflight=task;return task;}
    return {sync,loadCached,languages:[...LANGS]};
  }
  const api={languages:[...LANGS],createSyncClient,createIndexedDbStore,
    createPreview:(opts={})=>createSyncClient({...opts,store:opts.store||createIndexedDbStore(opts)})};
  root.MindliCentralQuestionBankPreview=api;
})(typeof window!=='undefined'?window:globalThis);
