import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const code=await readFile(fileURLToPath(new URL('../central-question-bank-preview.js',import.meta.url)),'utf8');
function boot(){
  const runtime={URL,AbortController,Response,setTimeout,clearTimeout,console};
  vm.runInNewContext(code,runtime);
  return runtime.MindliCentralQuestionBankPreview;
}
const languages=['sk','cs','en','de','pl','fr','it','es','pt','ja'];
const digest=id=>'sha256:'+id.repeat(64);
const question=(lang,id)=>({id,text:lang+' question '+id,category:'science',
  difficulty:'easy',difficultyLevel:1,correctIndex:1,options:['A','B','C','D']});
const list=lang=>[question(lang,'zvá01'),question(lang,'test002')];
function memoryStore(){
  let active=null,banks={};
  return {
    getActive:async()=>active,
    load:async(v,l)=>banks[v+':'+l]||null,
    commit:async(meta,rows)=>{const next={...banks};for(const lang of languages)next[meta.bankVersion+':'+lang]=rows[lang];banks=next;active=meta;},
    version:()=>active?.bankVersion||null
  };
}
function endpoint({id='a',answerDrift=false,failLang=null,abortOnce=null}={}){
  let aborted=false,count=0;
  const tag=lang=>'"mindli-qb-'+id+'-'+lang+'"';
  const json=(data,extra={})=>new Response(JSON.stringify(data),{
    headers:{'content-type':'application/json',...extra}
  });
  return {count:()=>count,fetch:async uri=>{
    count++;
    const u=new URL(uri),path=u.pathname;
    if(path.endsWith('/manifest'))return json({protocolVersion:1,bankVersion:digest(id),
      releaseVersion:id==='a'?2:3,questionCount:2,languages});
    if(path.endsWith('/sync')){const lang=u.searchParams.get('language');
      return json({status:'update',currentVersion:digest(id),etag:tag(lang),
        snapshotPath:'/api/question-bank/v1/banks/'+lang});
    }
    if(path.includes('/banks/')){const lang=path.split('/').at(-1);
      if(abortOnce===lang&&!aborted){aborted=true;return {status:200,
        headers:new Headers({'content-type':'application/json'}),
        json:async()=>{const e=new Error('aborted');e.name='AbortError';throw e;}};
      }
      if(failLang===lang)throw Error('bad server response');
      const rows=list(lang);
      if(lang==='en'&&answerDrift)rows[0].correctIndex=3;
      return json(rows,{etag:tag(lang)});
    }
    throw Error('Unknown path: '+path);
  }};
}
test('DEV15 WebView preview does not fetch or mutate the game on load',()=>{
  const api=boot();
  assert.equal(typeof api.createSyncClient,'function');
  assert.equal(typeof api.createIndexedDbStore,'function');
  assert.equal(api.languages.length,10);
});
test('DEV15 WebView commits all ten languages atomically and restores offline cache',async()=>{
  const api=boot(),store=memoryStore(),backend=endpoint();
  const client=api.createSyncClient({store,fetchImpl:backend.fetch});
  const first=await client.sync();
  assert.equal(first.updated,true);
  assert.equal(store.version(),digest('a'));
  for(const lang of languages){
    const cached=await client.loadCached(lang);
    assert.equal(cached.rows.length,2);
    assert.equal(cached.releaseVersion,2);
  }
  const offline=api.createSyncClient({store,attempts:1,
    fetchImpl:async()=>{throw new TypeError('OFFLINE');}});
  const second=await offline.sync();
  assert.equal(second.source,'cache');
  assert.equal((await offline.loadCached('pt')).version,digest('a'));
});
test('DEV15 WebView rejects translation answer drift before cache commit',async()=>{
  const api=boot(),store=memoryStore();
  await api.createSyncClient({store,fetchImpl:endpoint().fetch}).sync();
  const old=store.version();
  const newer=api.createSyncClient({store,fetchImpl:endpoint({id:'b',answerDrift:true}).fetch});
  const r=await newer.sync();
  assert.equal(r.source,'cache');
  assert.match(r.error,/CROSS_LANGUAGE/);
  assert.equal(store.version(),old);
});
test('DEV15 WebView abort retry recovers complete snapshot',async()=>{
  const api=boot(),store=memoryStore(),retries=[];
  const r=await api.createSyncClient({store,fetchImpl:endpoint({abortOnce:'ja'}).fetch,
    onRetry:x=>retries.push(x)}).sync();
  assert.equal(r.updated,true);
  assert.equal(retries.length,1);
});
test('DEV15 WebView propagates failed atomic storage commit',async()=>{
  const api=boot(),store=memoryStore();
  store.commit=async()=>{throw Error('QUOTA_EXCEEDED');};
  await assert.rejects(api.createSyncClient({store,fetchImpl:endpoint().fetch}).sync(),/QUOTA_EXCEEDED/);
  assert.equal(store.version(),null);
});
