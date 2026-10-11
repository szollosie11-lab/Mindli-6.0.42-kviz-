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

test('DEV15 independent WebViews cannot downgrade an already activated release',async()=>{
  const name='mindli-dev15-shared-'+Date.now()+'-'+Math.random();
  const older=api.createIndexedDbStore({name,indexedDBImpl:indexedDB});
  const newer=api.createIndexedDbStore({name,indexedDBImpl:indexedDB});
  const v2={protocolVersion:1,bankVersion:version,releaseVersion:2,questionCount:1,languages:langs};
  const v3={...v2,bankVersion:'sha256:'+'b'.repeat(64),releaseVersion:3};
  const rows=Object.fromEntries(langs.map(lang=>[lang,[sample(lang)]]));
  await newer.commit(v3,rows);
  await assert.rejects(older.commit(v2,rows),/RACING_RELEASE/);
  assert.equal((await older.getActive()).bankVersion,v3.bankVersion);
  assert.equal((await older.load(v3.bankVersion,'ja'))[0].id,'stable01');
});
test('DEV15 racing same-database writers always finish with highest release',async()=>{
  const name='mindli-dev15-race-'+Date.now()+'-'+Math.random();
  const first=api.createIndexedDbStore({name,indexedDBImpl:indexedDB});
  const second=api.createIndexedDbStore({name,indexedDBImpl:indexedDB});
  const v2={protocolVersion:1,bankVersion:version,releaseVersion:2,questionCount:1,languages:langs};
  const v3={...v2,bankVersion:'sha256:'+'b'.repeat(64),releaseVersion:3};
  const rows=Object.fromEntries(langs.map(lang=>[lang,[sample(lang)]]));
  const results=await Promise.allSettled([first.commit(v2,rows),second.commit(v3,rows)]);
  assert.equal(results[1].status,'fulfilled');
  assert.equal((await first.getActive()).bankVersion,v3.bankVersion);
});
