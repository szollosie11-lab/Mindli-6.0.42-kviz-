import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {indexedDB} from 'fake-indexeddb';
const code=await readFile(fileURLToPath(new URL('../central-question-bank-preview.js',import.meta.url)),'utf8');
const runtime={URL,AbortController,Response,setTimeout,clearTimeout,console};
vm.runInNewContext(code,runtime);
const api=runtime.MindliCentralQuestionBankPreview;
const version='sha256:'+'a'.repeat(64);
const langs=api.languages;
function sample(lang){return {id:'stable01',text:lang+' sample',category:'science',
  difficulty:'easy',difficultyLevel:1,correctIndex:1,options:['A','B','C','D']};}
test('DEV15 IndexedDB commits the release pointer and all ten snapshots in one transaction',async()=>{
  const store=api.createIndexedDbStore({name:'mindli-dev15-idb-'+Date.now()+'-'+Math.random(),indexedDBImpl:indexedDB});
  const meta={protocolVersion:1,bankVersion:version,releaseVersion:2,questionCount:1,languages:langs};
  const banks=Object.fromEntries(langs.map(lang=>[lang,[sample(lang)]]));
  await store.commit(meta,banks);
  assert.equal((await store.getActive()).bankVersion,version);
  for(const lang of langs){const snapshot=await store.load(version,lang);assert.equal(snapshot[0].id,'stable01');}
});
test('DEV15 IndexedDB failed transaction never changes the active version pointer',async()=>{
  const store=api.createIndexedDbStore({name:'mindli-dev15-failed-'+Date.now()+'-'+Math.random(),indexedDBImpl:indexedDB});
  const meta={protocolVersion:1,bankVersion:version,releaseVersion:2,questionCount:1,languages:langs};
  const banks=Object.fromEntries(langs.map(lang=>[lang,[sample(lang)]]));
  await store.commit(meta,banks);
  const newVersion='sha256:'+'b'.repeat(64);
  const broken={...banks,ja:[()=>{}]};
  await assert.rejects(store.commit({...meta,bankVersion:newVersion,releaseVersion:3},broken));
  assert.equal((await store.getActive()).bankVersion,version);
});
