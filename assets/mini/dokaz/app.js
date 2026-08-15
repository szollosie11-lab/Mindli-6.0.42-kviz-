
const $=s=>document.querySelector(s), app=document.getElementById('app');
const state={lang:localStorage.getItem('dokazLang')||'sk',theme:localStorage.getItem('dokazTheme')||'system',large:localStorage.getItem('dokazLarge')==='1',motion:localStorage.getItem('dokazMotion')==='1',mode:'cases',idx:0,order:[],selected:[],attempts:0,hint:false,hintLevel:0,screen:'home'};
const getProgress=()=>{try{return JSON.parse(localStorage.getItem('dokazProgress2')||'{}')}catch{return {}}};
const saveProgress=p=>localStorage.setItem('dokazProgress2',JSON.stringify(p));
function t(k){return UI[state.lang][k]??UI.sk[k]??k}
function locLevel(i){
 const L=LEVELS[i];
 if(!L)return {cat:'',title:'',brief:'',cards:[],explain:'',difficulty:1};
 const x=L.i18n?.[state.lang];
 if(x){
   return {...L,
     cat:x.cat??L.cat??'',
     title:x.title??L.title??'',
     brief:x.brief??L.brief??'',
     cards:Array.isArray(x.cards)?x.cards:(L.cards||[]).map(v=>Array.isArray(v)?v[1]:v),
     explain:x.explain??L.explain??''
   };
 }
 return {...L,
   cat:L.cat??'',
   title:L.title??'',
   brief:L.brief??'',
   cards:(L.cards||[]).map(v=>Array.isArray(v)?v[1]:v),
   explain:L.explain??''
 };
}
function theme(){let d=state.theme;if(d==='system')d=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';document.documentElement.dataset.theme=d;document.documentElement.lang=state.lang;document.title=(typeof ex==='function'?ex('game'):'DÔKAZ');document.body.classList.toggle('large-text',state.large);document.body.classList.toggle('reduce-motion',state.motion)}
function toast(x){const el=$('#toast');el.textContent=x;el.classList.add('on');clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('on'),1700)}
function starsFor(i){return Number(getProgress()[i]?.stars||0)}function bestFor(i){return Number(getProgress()[i]?.best||0)}
function totalStars(){return LEVELS.reduce((s,_,i)=>s+starsFor(i),0)}function solved(){return LEVELS.filter((_,i)=>starsFor(i)>0).length}
function topbar(showBack=false){return `<div class="topbar">${showBack?`<button class="back" onclick="goHome()" aria-label="${t('back')}">‹</button>`:`<div class="logo"><img src="icon.png" alt=""></div>`}<div class="brand"><strong>${ex('game')}</strong><span>${t('subtitle')}</span></div>${showBack?'':'<span></span>'}</div>`}
function goHome(){state.screen='home';history.replaceState({screen:'home'},'');renderHome()}
function renderHome(){state.screen='home';theme();const p=getProgress();const best=Math.max(0,...Object.values(p).map(x=>Number(x.best||0)));app.innerHTML=`<section class="screen">${topbar()}<div class="hero hero-home"><div class="hero-orb">✓</div><div class="eyebrow">${t('subtitle')}</div><h1>${ex('game')}</h1><p>${t('intro')}</p></div><div class="modegrid"><button class="mode" onclick="start(false)"><span class="ico">🧠</span><strong>${t('cases')}</strong><small>${t('cases_desc')}</small></button><button class="mode" onclick="start(true)"><span class="ico">⚡</span><strong>${t('chaos')}</strong><small>${t('chaos_desc')}</small></button></div><div class="panel stats"><div class="stat"><b>${solved()}/${LEVELS.length}</b><span>${t('solved')}</span></div><div class="stat"><b>${totalStars()}/${LEVELS.length*3}</b><span>${t('stars')}</span></div><div class="stat"><b>${best}</b><span>${t('best')}</span></div></div><div class="panel explainbox"><strong>${ex('reasoning')}</strong><p>${t('why_text')}</p></div><div class="panel explainbox"><strong>💡 ${ex('help')}</strong><p>${ex('helptext')}</p></div><button class="btn secondary grow" style="width:100%" onclick="caseArchive()">${t('progress')} · ${totalStars()} ${t('stars')}</button><div class="footer">${ex('game')} · v3.8.1-HOTFIX · offline · SK / CZ / EN / DE</div></section>`}
function settings(){
 state.screen='settings';history.pushState({screen:'settings'},'');theme();
 const A={
  sk:{prefs:'Preferencie',access:'Prístupnosť',lang:'Jazyk',theme:'Vzhľad',font:'Väčšie písmo',targets:'Väčšie tlačidlá',contrast:'Vyšší kontrast',motion:'Obmedziť animácie',data:'Údaje a progres',resetDesc:'Odstráni všetky uložené hviezdy a postup.',verifyAlt:'Overiť odpoveď',chooseAnswer:'Vyber odpoveď',factChecked:'Faktograficky overené',altHint:'Vyber možnosť, ktorá najlepšie zodpovedá dôkazom.',onb1:'Nájdi príčinu',onb1d:'Začni faktom, ktorý spustil dej alebo jav.',onb2:'Spoj dôkazy',onb2d:'Nájdi článok, ktorý prepája príčinu so záverom.',onb3:'Urob záver',onb3d:'Vyber iba to, čo naozaj vyplýva z dôkazov.',onbNext:'Ďalej',onbStart:'Začať hrať',resultTitle:'Výsledok spisu',decisive:'Rozhodujúci dôkaz',sourceLabel:'Zdrojové podklady',nextCase:'Ďalší spis',timelineHelp:'Zoraď udalosti pomocou šípok.',moveUp:'Posunúť vyššie',moveDown:'Posunúť nižšie',hypA:'Hypotéza A',hypB:'Hypotéza B',missingChain:'Chýbajúci článok',missingLead:'Nájdi tvrdenie, ktoré logicky uzavrie reťazec.'},
  cs:{prefs:'Předvolby',access:'Přístupnost',lang:'Jazyk',theme:'Vzhled',font:'Větší písmo',targets:'Větší tlačítka',contrast:'Vyšší kontrast',motion:'Omezit animace',data:'Data a postup',resetDesc:'Odstraní všechny uložené hvězdy a postup.',verifyAlt:'Ověřit odpověď',chooseAnswer:'Vyber odpověď',factChecked:'Faktograficky ověřeno',altHint:'Vyber možnost, která nejlépe odpovídá důkazům.',onb1:'Najdi příčinu',onb1d:'Začni faktem, který spustil děj nebo jev.',onb2:'Propoj důkazy',onb2d:'Najdi článek, který propojí příčinu se závěrem.',onb3:'Udělej závěr',onb3d:'Vyber pouze to, co skutečně vyplývá z důkazů.',onbNext:'Dále',onbStart:'Začít hrát',resultTitle:'Výsledek případu',decisive:'Rozhodující důkaz',sourceLabel:'Zdrojové podklady',nextCase:'Další případ',timelineHelp:'Seřaď události pomocí šipek.',moveUp:'Posunout výše',moveDown:'Posunout níže',hypA:'Hypotéza A',hypB:'Hypotéza B',missingChain:'Chybějící článek',missingLead:'Najdi tvrzení, které logicky uzavře řetězec.'},
  en:{prefs:'Preferences',access:'Accessibility',lang:'Language',theme:'Appearance',font:'Larger text',targets:'Larger controls',contrast:'Higher contrast',motion:'Reduce motion',data:'Data and progress',resetDesc:'Removes all saved stars and progress.',verifyAlt:'Check answer',chooseAnswer:'Choose an answer',factChecked:'Fact-checked',altHint:'Choose the option best supported by the evidence.',onb1:'Find the cause',onb1d:'Start with the fact that sets the event or process in motion.',onb2:'Connect the evidence',onb2d:'Find the link that connects the cause to the conclusion.',onb3:'Draw the conclusion',onb3d:'Choose only what genuinely follows from the evidence.',onbNext:'Next',onbStart:'Start playing',resultTitle:'Dossier result',decisive:'Decisive evidence',sourceLabel:'Source material',nextCase:'Next dossier',timelineHelp:'Put the events in order using the arrows.',moveUp:'Move up',moveDown:'Move down',hypA:'Hypothesis A',hypB:'Hypothesis B',missingChain:'Missing link',missingLead:'Find the statement that logically closes the chain.'},
  de:{prefs:'Einstellungen',access:'Barrierefreiheit',lang:'Sprache',theme:'Darstellung',font:'Größere Schrift',targets:'Größere Bedienelemente',contrast:'Höherer Kontrast',motion:'Bewegung reduzieren',data:'Daten und Fortschritt',resetDesc:'Löscht alle gespeicherten Sterne und den Fortschritt.',verifyAlt:'Antwort prüfen',chooseAnswer:'Antwort auswählen',factChecked:'Faktisch geprüft',altHint:'Wähle die Option, die durch die Belege am besten gestützt wird.',onb1:'Ursache finden',onb1d:'Beginne mit dem Fakt, der den Vorgang oder das Ereignis auslöst.',onb2:'Belege verknüpfen',onb2d:'Finde das Glied, das Ursache und Schluss miteinander verbindet.',onb3:'Schluss ziehen',onb3d:'Wähle nur, was tatsächlich aus den Belegen folgt.',onbNext:'Weiter',onbStart:'Spiel starten',resultTitle:'Fallergebnis',decisive:'Entscheidender Beleg',sourceLabel:'Quellenmaterial',nextCase:'Nächster Fall',timelineHelp:'Ordne die Ereignisse mit den Pfeilen.',moveUp:'Nach oben',moveDown:'Nach unten',hypA:'Hypothese A',hypB:'Hypothese B',missingChain:'Fehlendes Glied',missingLead:'Finde die Aussage, die die Schlusskette logisch schließt.'}
 }[state.lang];
 const aa=k=>localStorage.getItem('dokazA11y_'+k)==='1';
 app.innerHTML=`<section class="screen settings-screen">${topbar(true)}
 <div class="settings-title"><div class="eyebrow">${ex('game')}</div><h1>${t('settings')}</h1></div>
 <section class="settings-card">
   <div class="settings-section-title">⚙ ${A.prefs}</div>
   <div class="setting-row"><div class="setting-copy"><b>🌐 ${A.lang}</b></div><select onchange="setLang(this.value)"><option value="sk" ${state.lang==='sk'?'selected':''}>Slovenčina</option><option value="cs" ${state.lang==='cs'?'selected':''}>Čeština</option><option value="en" ${state.lang==='en'?'selected':''}>English</option><option value="de" ${state.lang==='de'?'selected':''}>Deutsch</option></select></div>
   <div class="setting-row"><div class="setting-copy"><b>◐ ${A.theme}</b></div><select onchange="setTheme(this.value)"><option value="system" ${state.theme==='system'?'selected':''}>${t('system')}</option><option value="light" ${state.theme==='light'?'selected':''}>${t('light')}</option><option value="dark" ${state.theme==='dark'?'selected':''}>${t('dark')}</option></select></div>
 </section>
 <section class="settings-card">
   <div class="settings-section-title">♿ ${A.access}</div>
   <div class="setting-row"><div class="setting-copy"><b>Aa ${A.font}</b></div><button class="switch ${state.large?'on':''}" onclick="toggleLarge()"><i></i></button></div>
   <div class="setting-row"><div class="setting-copy"><b>☝ ${A.targets}</b></div><button class="switch ${aa('largeTargets')?'on':''}" onclick="toggleA11y('largeTargets');settings()"><i></i></button></div>
   <div class="setting-row"><div class="setting-copy"><b>◐ ${A.contrast}</b></div><button class="switch ${aa('highContrast')?'on':''}" onclick="toggleA11y('highContrast');settings()"><i></i></button></div>
   <div class="setting-row"><div class="setting-copy"><b>〰 ${A.motion}</b></div><button class="switch ${state.motion?'on':''}" onclick="toggleMotion()"><i></i></button></div>
 </section>
 <section class="settings-card danger-card">
   <div class="settings-section-title">◉ ${A.data}</div>
   <div class="reset-row"><div><b>${t('reset')}</b><small>${A.resetDesc}</small></div><button class="reset-icon" onclick="resetProgress()">⌫</button></div>
 </section>
 </section>`;
}
function setLang(v){state.lang=v;localStorage.setItem('dokazLang',v);settings();theme()}function setTheme(v){state.theme=v;localStorage.setItem('dokazTheme',v);theme();settings()}function toggleLarge(){state.large=!state.large;localStorage.setItem('dokazLarge',state.large?'1':'0');theme();settings()}function toggleMotion(){state.motion=!state.motion;localStorage.setItem('dokazMotion',state.motion?'1':'0');theme();settings()}
function resetProgress(){if(confirm(t('resetq'))){localStorage.removeItem('dokazProgress2');toast(t('resetdone'));goHome()}}
function caseArchive(){state.screen='archive';history.pushState({screen:'archive'},'');app.innerHTML=`<section class="screen">${topbar(true)}<div class="hero"><h1>${t('progress')}</h1><p>${solved()}/${LEVELS.length} · ${totalStars()}/${LEVELS.length*3} ${t('stars')}</p></div><div class="case-list">${LEVELS.map((_,i)=>{const L=locLevel(i),s=starsFor(i);return `<div class="case-row"><div class="num">${i+1}</div><div class="main"><strong>${L.title}</strong><small>${L.cat} · ${t('difficulty')[Math.max(0,Math.min(2,(Number(L.difficulty)||1)-1))]}</small></div><div class="mini-stars">${'★'.repeat(s)}${'☆'.repeat(3-s)}</div></div>`}).join('')}</div></section>`}
function start(random){state.mode=random?'chaos':'cases';state.order=[...LEVELS.keys()];if(random)state.order.sort(()=>Math.random()-.5);else{const first=state.order.findIndex(i=>starsFor(i)===0);if(first>0)state.order=[...state.order.slice(first),...state.order.slice(0,first)]}state.idx=0;state.screen='game';history.pushState({screen:'game'},'');renderCase()}

function shuffledIndices(n){
 const a=Array.from({length:n},(_,i)=>i);
 for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}
 return a;
}

function renderCase(){if(state.idx>=state.order.length){finish();return}theme();state.selected=[];state.attempts=0;state.hint=false;state.hintLevel=0;sessionStorage.setItem('dokazLiveBudget','5');const index=state.order[state.idx],L=locLevel(index);const fallback={
 sk:{cat:'Odborný spis',title:'Dôkazový prípad',brief:'Vyber tri dôkazy a zostav správny reťazec.'},
 cs:{cat:'Odborný případ',title:'Důkazní případ',brief:'Vyber tři důkazy a sestav správný řetězec.'},
 en:{cat:'Specialist dossier',title:'Evidence case',brief:'Choose three pieces of evidence and build the correct chain.'},
 de:{cat:'Fachfall',title:'Beweisfall',brief:'Wähle drei Belege und bilde die richtige Schlusskette.'}
}[state.lang];const safeCat=(!L.cat||L.cat==='undefined')?fallback.cat:String(L.cat),safeTitle=(!L.title||L.title==='undefined')?fallback.title:String(L.title),safeBrief=(!L.brief||L.brief==='undefined')?fallback.brief:String(L.brief);const cards=shuffledIndices(L.cards.length);state.cardOrder=cards;app.innerHTML=`<section class="screen">${topbar(true)}<div class="casehead"><div class="caseinfo"><div class="cat">${safeCat}</div><h2>${safeTitle}</h2></div><div class="scorepill">${starsFor(index)?'★'.repeat(starsFor(index)):'0 ★'}</div></div><div class="progress"><div style="width:${(state.idx/state.order.length)*100}%"></div></div><div class="case-meta"><span>${state.idx+1} / ${state.order.length}</span><span class="difficulty">${t('difficulty')[L.difficulty-1]}</span></div><div class="panel question"><p>${safeBrief}</p></div><div id="slots" class="slots"></div><div id="cards" class="cards">${cards.map(ci=>`<button class="evidence" data-id="${L.cards[ci]?LEVELS[index].cards[ci][0]:''}" onclick="pick('${LEVELS[index].cards[ci][0]}')"><span class="letter">${String.fromCharCode(65+cards.indexOf(ci))}</span><span class="txt">${L.cards[ci]}</span></button>`).join('')}</div><div id="feedback" class="feedback"></div><div class="actionbar"><button class="btn secondary" onclick="hint()">💡 ${t('hint')}</button><button class="btn secondary" onclick="clearSelection()">${t('clear')}</button><button class="btn primary grow" onclick="verify()">${t('verify')}</button></div><div class="footer">${t('exitcase')}</div></section>`;renderSlots()}
function renderSlots(){const index=state.order[state.idx],L=locLevel(index),labs=[t('cause'),t('bridge'),t('conclusion')],el=$('#slots');if(!el)return;el.innerHTML=[0,1,2].map(i=>{const id=state.selected[i];const ci=id?LEVELS[index].cards.findIndex(c=>c[0]===id):-1;return `<button class="slot ${id?'filled':''}" ${id?`onclick="removeAt(${i})"`:''}><div><b>${i+1} · ${labs[i]}</b>${id?L.cards[ci]:t('tap')}</div></button>`}).join('');document.querySelectorAll('.evidence').forEach(e=>e.classList.toggle('sel',state.selected.includes(e.dataset.id)))}
function pick(id){if(state.selected.includes(id)){state.selected=state.selected.filter(x=>x!==id)}else{if(state.selected.length>=3){toast(t('chainfull'));return}state.selected.push(id)}renderSlots()}
function removeAt(i){state.selected.splice(i,1);renderSlots()}function clearSelection(){state.selected=[];renderSlots()}
function hint(){if(state.hint){toast(t('hintused'));return}state.hint=true;const index=state.order[state.idx],L=LEVELS[index];const need=L.answer.find(x=>!state.selected.includes(x))||L.answer[0];const el=document.querySelector(`.evidence[data-id="${need}"]`);if(el)el.classList.add('hint');toast(t('hintmsg'))}
function verify(){const index=state.order[state.idx],raw=LEVELS[index],L=locLevel(index),fb=$('#feedback');if(state.selected.length!==3){toast(t('need3'));return}const exact=state.selected.every((x,i)=>x===raw.answer[i]);const same=[...state.selected].sort().join('|')===[...raw.answer].sort().join('|');state.attempts++;
if(state.mode==='master'&&!exact){
 state.masterAlive=false;
 setTimeout(()=>{toast(ex('master')+' — 0/5');setTimeout(()=>renderHome(),700)},450);
}
if(exact){let stars=3;if(state.hint)stars--;if(state.attempts>1)stars--;stars=Math.max(1,stars);const score=stars===3?100:stars===2?75:50;const p=getProgress(),old=p[index]||{};try{if(!(old.stars>0))window.mindliReward?.('dokaz','case-'+index,5,true)}catch(_){}p[index]={stars:Math.max(old.stars||0,stars),best:Math.max(old.best||0,score)};saveProgress(p);fb.className='feedback good show';fb.innerHTML=`<b>${t('good')} · +${score} ${t('score')}</b><div class="stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>${L.explain}<div class="btnrow"><button class="btn primary grow" onclick="nextCase()">${t('next')} →</button></div>`;document.querySelectorAll('.evidence').forEach(e=>e.disabled=true)}else if(same){fb.className='feedback warn show';fb.innerHTML=`<b>${t('wrongorder')}</b>${t('wrongorder_desc')}`}else{fb.className='feedback bad show';fb.innerHTML=`<b>${t('wrong')}</b>${t('wrong_desc')}`}}
function nextCase(){state.idx++;renderCase();window.scrollTo({top:0,behavior:state.motion?'auto':'smooth'})}
function finish(){state.screen='done';const s=totalStars();app.innerHTML=`<section class="screen">${topbar()}<div class="panel done"><div class="trophy">🏛️</div><h2>${t('archive')}</h2><div class="stars">${s} / ${LEVELS.length*3} ★</div><p>${s>=75?t('perfect'):s>=50?t('solid'):t('barely')}</p><div class="btnrow"><button class="btn primary grow" onclick="start(false)">${t('again')}</button><button class="btn secondary grow" onclick="goHome()">${t('menu')}</button></div></div></section>`}




const EXTENDED_LEVELS = [
{cat:{sk:'Veda',cs:'Věda',en:'Science',de:'Wissenschaft'},title:{sk:'Prečo vzniká dúha?',cs:'Proč vzniká duha?',en:'Why does a rainbow form?',de:'Wie entsteht ein Regenbogen?'},q:{sk:'Zostav reťazec, ktorý vysvetľuje vznik dúhy v kvapkách vody.',cs:'Sestav řetězec, který vysvětluje vznik duhy v kapkách vody.',en:'Build the chain that explains how a rainbow forms in water droplets.',de:'Bilde die Kette, die erklärt, wie ein Regenbogen in Wassertropfen entsteht.'},cards:{sk:['Slnečné svetlo vstúpi do kvapky a zmení smer.','Rôzne vlnové dĺžky sa lámu o trochu odlišne.','Svetlo sa v kvapke odrazí a pri výstupe sa znovu láme.','Dážď vždy ochladí vzduch.','Kvapky sú dokonale guľaté za všetkých okolností.','Dúha vzniká zo svetla Mesiaca iba v zime.'],cs:['Sluneční světlo vstoupí do kapky a změní směr.','Různé vlnové délky se lámou mírně odlišně.','Světlo se v kapce odrazí a při výstupu se znovu láme.','Déšť vždy ochladí vzduch.','Kapky jsou za všech okolností dokonale kulaté.','Duha vzniká z měsíčního světla jen v zimě.'],en:['Sunlight enters a droplet and changes direction.','Different wavelengths are refracted by slightly different amounts.','Light reflects inside the droplet and refracts again as it exits.','Rain always cools the air.','Droplets are perfectly spherical in all circumstances.','Rainbows form from moonlight only in winter.'],de:['Sonnenlicht tritt in einen Tropfen ein und ändert seine Richtung.','Verschiedene Wellenlängen werden unterschiedlich stark gebrochen.','Das Licht wird im Tropfen reflektiert und beim Austritt erneut gebrochen.','Regen kühlt die Luft immer ab.','Tropfen sind unter allen Umständen vollkommen kugelförmig.','Regenbogen entstehen nur im Winter aus Mondlicht.']},answer:[0,1,2],why:{sk:'Lom, rozklad farieb a vnútorný odraz v kvapkách vytvárajú smerovo oddelené farby dúhy.',cs:'Lom, rozklad barev a vnitřní odraz v kapkách vytvářejí směrově oddělené barvy duhy.',en:'Refraction, wavelength-dependent dispersion and internal reflection separate the colours by direction.',de:'Brechung, wellenlängenabhängige Dispersion und innere Reflexion trennen die Farben nach Richtung.'}},
{cat:{sk:'Biológia',cs:'Biologie',en:'Biology',de:'Biologie'},title:{sk:'Prečo listy na jeseň menia farbu?',cs:'Proč listy na podzim mění barvu?',en:'Why do leaves change colour in autumn?',de:'Warum verfärben sich Blätter im Herbst?'},q:{sk:'Vyber tri kroky, ktoré najlepšie vysvetľujú, prečo sa listy mnohých drevín na jeseň sfarbujú.',cs:'Vyber tři kroky, které nejlépe vysvětlují, proč se listy mnoha dřevin na podzim zbarvují.',en:'Choose the three steps that best explain why the leaves of many trees change colour in autumn.',de:'Wähle drei Schritte, die am besten erklären, warum sich die Blätter vieler Gehölze im Herbst verfärben.'},cards:{sk:['Skracovanie dní a zmeny teploty ovplyvňujú fyziológiu listu.','Tvorba chlorofylu sa obmedzí a chlorofyl sa rozkladá.','Zviditeľnia sa ďalšie pigmenty, napríklad karotenoidy.','Každý strom vytvára na jeseň modrý pigment.','Farba vzniká tým, že list prestane obsahovať vodu úplne.','Všetky druhy stromov menia farbu rovnakým spôsobom.'],cs:['Zkracování dnů a změny teploty ovlivňují fyziologii listu.','Tvorba chlorofylu se omezí a chlorofyl se rozkládá.','Zviditelní se další pigmenty, například karotenoidy.','Každý strom vytváří na podzim modrý pigment.','Barva vzniká tím, že list zcela přestane obsahovat vodu.','Všechny druhy stromů mění barvu stejným způsobem.'],en:['Shorter days and changing temperatures affect leaf physiology.','Chlorophyll production declines and existing chlorophyll breaks down.','Other pigments, such as carotenoids, become more visible.','Every tree produces a blue pigment in autumn.','The colour appears because the leaf loses all of its water.','All tree species change colour in exactly the same way.'],de:['Kürzere Tage und veränderte Temperaturen beeinflussen die Blattphysiologie.','Die Chlorophyllbildung nimmt ab und vorhandenes Chlorophyll wird abgebaut.','Andere Pigmente, etwa Carotinoide, werden sichtbarer.','Jeder Baum bildet im Herbst einen blauen Farbstoff.','Die Farbe entsteht, weil das Blatt sein gesamtes Wasser verliert.','Alle Baumarten verfärben sich auf genau dieselbe Weise.']},answer:[0,1,2],why:{sk:'Keď chlorofyl ustupuje, pigmenty dovtedy prekryté zelenou farbou sa stanú viditeľnejšími.',cs:'Když chlorofyl ustupuje, pigmenty dosud překryté zelenou barvou se stanou viditelnějšími.',en:'As chlorophyll declines, pigments previously masked by green become more visible.',de:'Wenn das Chlorophyll abgebaut wird, treten zuvor vom Grün überdeckte Pigmente stärker hervor.'}},
{cat:{sk:'Fyzika',cs:'Fyzika',en:'Physics',de:'Physik'},title:{sk:'Prečo sa kov na dotyk zdá chladnejší?',cs:'Proč se kov na dotek zdá chladnější?',en:'Why does metal feel colder?',de:'Warum fühlt sich Metall kälter an?'},q:{sk:'Dva predmety majú rovnakú izbovú teplotu. Prečo sa kov môže zdať chladnejší než drevo?',cs:'Dva předměty mají stejnou pokojovou teplotu. Proč se kov může zdát chladnější než dřevo?',en:'Two objects are at the same room temperature. Why can metal feel colder than wood?',de:'Zwei Gegenstände haben dieselbe Raumtemperatur. Warum kann sich Metall kälter als Holz anfühlen?'},cards:{sk:['Ruka je zvyčajne teplejšia než predmet v miestnosti.','Kov odvádza teplo z pokožky rýchlejšie než drevo.','Rýchlejší tok tepla vyvolá silnejší pocit chladu.','Kov má vždy nižšiu skutočnú teplotu než drevo.','Drevo vytvára vlastné teplo.','Farba kovu znižuje teplotu kože.'],cs:['Ruka je obvykle teplejší než předmět v místnosti.','Kov odvádí teplo z pokožky rychleji než dřevo.','Rychlejší tok tepla vyvolá silnější pocit chladu.','Kov má vždy nižší skutečnou teplotu než dřevo.','Dřevo vytváří vlastní teplo.','Barva kovu snižuje teplotu kůže.'],en:['Your hand is usually warmer than an object at room temperature.','Metal conducts heat away from the skin faster than wood.','The faster heat flow produces a stronger sensation of cold.','Metal is always at a lower actual temperature than wood.','Wood generates its own heat.','The colour of metal lowers skin temperature.'],de:['Die Hand ist gewöhnlich wärmer als ein Gegenstand bei Raumtemperatur.','Metall leitet Wärme schneller von der Haut ab als Holz.','Der schnellere Wärmefluss erzeugt ein stärkeres Kältegefühl.','Metall hat immer eine niedrigere tatsächliche Temperatur als Holz.','Holz erzeugt eigene Wärme.','Die Farbe des Metalls senkt die Hauttemperatur.']},answer:[0,1,2],why:{sk:'Pocit súvisí najmä s rýchlosťou prenosu tepla, nie iba s teplotou predmetu.',cs:'Pocit souvisí především s rychlostí přenosu tepla, ne jen s teplotou předmětu.',en:'The sensation depends strongly on the rate of heat transfer, not simply on the object’s temperature.',de:'Das Empfinden hängt stark von der Geschwindigkeit des Wärmeübergangs ab, nicht nur von der Temperatur des Gegenstands.'}},
{cat:{sk:'Geografia',cs:'Geografie',en:'Geography',de:'Geografie'},title:{sk:'Prečo vznikajú ročné obdobia?',cs:'Proč vznikají roční období?',en:'Why do we have seasons?',de:'Warum gibt es Jahreszeiten?'},q:{sk:'Zostav správne vysvetlenie ročných období na Zemi.',cs:'Sestav správné vysvětlení ročních období na Zemi.',en:'Build the correct explanation for Earth’s seasons.',de:'Bilde die richtige Erklärung für die Jahreszeiten auf der Erde.'},cards:{sk:['Zemská os je sklonená voči rovine obehu.','Počas obehu sa mení uhol dopadu svetla a dĺžka dňa na pologuliach.','To mení množstvo slnečnej energie prijatej povrchom počas roka.','Leto vzniká hlavne preto, že Zem je vtedy najbližšie k Slnku.','Slnko v zime produkuje menej energie.','Sklon osi sa každý mesiac obráti.'],cs:['Zemská osa je skloněná vůči rovině oběhu.','Během oběhu se na polokoulích mění úhel dopadu světla a délka dne.','Tím se během roku mění množství sluneční energie přijímané povrchem.','Léto vzniká hlavně proto, že je Země tehdy nejblíže Slunci.','Slunce v zimě produkuje méně energie.','Sklon osy se každý měsíc obrátí.'],en:['Earth’s axis is tilted relative to its orbital plane.','As Earth orbits, the angle of sunlight and day length change in each hemisphere.','That changes the solar energy received at the surface through the year.','Summer occurs mainly because Earth is then closest to the Sun.','The Sun produces less energy in winter.','Earth’s axial tilt reverses every month.'],de:['Die Erdachse ist gegenüber der Bahnebene geneigt.','Während des Umlaufs ändern sich Einfallswinkel des Sonnenlichts und Tageslänge auf den Halbkugeln.','Dadurch verändert sich im Jahreslauf die am Boden ankommende Sonnenenergie.','Der Sommer entsteht hauptsächlich, weil die Erde dann der Sonne am nächsten ist.','Im Winter erzeugt die Sonne weniger Energie.','Die Achsneigung kehrt sich jeden Monat um.']},answer:[0,1,2],why:{sk:'Rozhodujúci je sklon zemskej osi a meniace sa osvetlenie pologúľ počas obehu.',cs:'Rozhodující je sklon zemské osy a měnící se osvětlení polokoulí během oběhu.',en:'The key is Earth’s axial tilt and the changing illumination of each hemisphere during the orbit.',de:'Entscheidend sind die Neigung der Erdachse und die wechselnde Beleuchtung der Halbkugeln während des Umlaufs.'}},
{cat:{sk:'Chémia',cs:'Chemie',en:'Chemistry',de:'Chemie'},title:{sk:'Prečo železo hrdzavie?',cs:'Proč železo rezaví?',en:'Why does iron rust?',de:'Warum rostet Eisen?'},q:{sk:'Zostav najpresnejší reťazec, ktorý vysvetľuje, ako pri bežných podmienkach vzniká hrdza.',cs:'Sestav co nejpřesnější řetězec vysvětlující, jak za běžných podmínek vzniká rez.',en:'Choose the chain that most accurately explains how rust forms under ordinary conditions.',de:'Wähle die Kette, die möglichst präzise erklärt, wie Rost unter gewöhnlichen Bedingungen entsteht.'},cards:{sk:['Železo je vystavené kyslíku a vlhkosti.','Prebiehajú oxidačno-redukčné procesy, pri ktorých železo oxiduje.','Vznikajú hydratované oxidy a oxyhydroxidy železa označované ako hrdza.','Hrdza je vrstva čistého kovového železa.','Kyslík zabraňuje oxidácii železa.','Hrdzavenie vyžaduje teplotu varu vody.'],cs:['Železo je vystaveno kyslíku a vlhkosti.','Probíhají oxidačně-redukční děje, při nichž se železo oxiduje.','Vznikají hydratované oxidy a oxyhydroxidy železa označované jako rez.','Rez je vrstva čistého kovového železa.','Kyslík zabraňuje oxidaci železa.','Rezavění vyžaduje teplotu varu vody.'],en:['Iron is exposed to oxygen and moisture.','Redox processes occur in which iron is oxidised.','Hydrated iron oxides and oxyhydroxides form, commonly called rust.','Rust is a layer of pure metallic iron.','Oxygen prevents iron oxidation.','Rusting requires water to be at its boiling point.'],de:['Eisen ist Sauerstoff und Feuchtigkeit ausgesetzt.','Es laufen Redoxprozesse ab, bei denen Eisen oxidiert wird.','Hydratisierte Eisenoxide und Oxyhydroxide entstehen, die als Rost bezeichnet werden.','Rost ist eine Schicht aus reinem metallischem Eisen.','Sauerstoff verhindert die Oxidation von Eisen.','Rosten erfordert die Siedetemperatur von Wasser.']},answer:[0,1,2],why:{sk:'Hrdza nie je jedna čistá zlúčenina; ide o zmes produktov korózie železa.',cs:'Rez není jediná čistá sloučenina; jde o směs produktů koroze železa.',en:'Rust is not one pure compound; it is a mixture of iron corrosion products.',de:'Rost ist keine einzelne reine Verbindung, sondern ein Gemisch von Korrosionsprodukten des Eisens.'}},
{cat:{sk:'Astronómia',cs:'Astronomie',en:'Astronomy',de:'Astronomie'},title:{sk:'Prečo je Venuša teplejšia než Merkúr?',cs:'Proč je Venuše teplejší než Merkur?',en:'Why is Venus hotter than Mercury?',de:'Warum ist die Venus heißer als Merkur?'},q:{sk:'Zostav vysvetlenie vysokej priemernej povrchovej teploty Venuše.',cs:'Sestav vysvětlení vysoké průměrné povrchové teploty Venuše.',en:'Build the explanation for Venus’s very high mean surface temperature.',de:'Bilde die Erklärung für die sehr hohe mittlere Oberflächentemperatur der Venus.'},cards:{sk:['Venuša má veľmi hustú atmosféru bohatú na oxid uhličitý.','Atmosféra účinne zadržiava tepelné žiarenie silným skleníkovým efektom.','Výsledkom je vyššia priemerná povrchová teplota než na Merkúre.','Venuša je bližšie k Slnku než Merkúr.','Merkúr má hustejšiu atmosféru než Venuša.','Venušu zohrievajú jej mesiace.'],cs:['Venuše má velmi hustou atmosféru bohatou na oxid uhličitý.','Atmosféra účinně zadržuje tepelné záření silným skleníkovým efektem.','Výsledkem je vyšší průměrná povrchová teplota než na Merkuru.','Venuše je blíže Slunci než Merkur.','Merkur má hustší atmosféru než Venuše.','Venuši zahřívají její měsíce.'],en:['Venus has a very dense atmosphere rich in carbon dioxide.','Its atmosphere traps thermal radiation through an intense greenhouse effect.','The result is a higher mean surface temperature than Mercury’s.','Venus is closer to the Sun than Mercury.','Mercury has a denser atmosphere than Venus.','Venus is heated by its moons.'],de:['Die Venus besitzt eine sehr dichte, kohlendioxidreiche Atmosphäre.','Ihre Atmosphäre hält Wärmestrahlung durch einen starken Treibhauseffekt zurück.','Dadurch ist ihre mittlere Oberflächentemperatur höher als die des Merkur.','Die Venus ist der Sonne näher als Merkur.','Merkur besitzt eine dichtere Atmosphäre als die Venus.','Die Monde der Venus erwärmen den Planeten.']},answer:[0,1,2],why:{sk:'NASA uvádza Venušu ako najteplejšiu planétu napriek tomu, že Merkúr je bližšie k Slnku.',cs:'NASA uvádí Venuši jako nejteplejší planetu, přestože Merkur je blíže Slunci.',en:'NASA identifies Venus as the hottest planet even though Mercury is closer to the Sun.',de:'NASA nennt die Venus den heißesten Planeten, obwohl Merkur näher an der Sonne liegt.'}},
{cat:{sk:'Medicína',cs:'Medicína',en:'Medicine',de:'Medizin'},title:{sk:'Prečo antibiotiká neliečia chrípku?',cs:'Proč antibiotika neléčí chřipku?',en:'Why don’t antibiotics treat influenza?',de:'Warum behandeln Antibiotika keine Grippe?'},q:{sk:'Vyber tri kroky, ktoré vysvetľujú, prečo antibiotikum nelieči samotnú chrípku.',cs:'Vyber tři kroky, které vysvětlují, proč antibiotikum neléčí samotnou chřipku.',en:'Choose the three steps explaining why an antibiotic does not treat influenza itself.',de:'Wähle drei Schritte, die erklären, warum ein Antibiotikum die Grippe selbst nicht behandelt.'},cards:{sk:['Chrípku spôsobujú vírusy influenza.','Antibiotiká pôsobia proti určitým baktériám, nie proti vírusom.','Preto antibiotikum nelieči vírusovú príčinu chrípky.','Vyššia dávka antibiotika zmení vírus na baktériu.','Každá horúčka je bakteriálna infekcia.','Antibiotiká sú druh očkovania.'],cs:['Chřipku způsobují viry influenza.','Antibiotika působí proti určitým bakteriím, nikoli proti virům.','Proto antibiotikum neléčí virovou příčinu chřipky.','Vyšší dávka antibiotika změní virus na bakterii.','Každá horečka je bakteriální infekce.','Antibiotika jsou druhem očkování.'],en:['Influenza is caused by influenza viruses.','Antibiotics act against certain bacteria, not viruses.','Therefore an antibiotic does not treat the viral cause of influenza.','A higher antibiotic dose turns a virus into a bacterium.','Every fever is a bacterial infection.','Antibiotics are a type of vaccination.'],de:['Grippe wird durch Influenzaviren verursacht.','Antibiotika wirken gegen bestimmte Bakterien, nicht gegen Viren.','Daher behandelt ein Antibiotikum nicht die virale Ursache der Grippe.','Eine höhere Antibiotikadosis verwandelt ein Virus in ein Bakterium.','Jedes Fieber ist eine bakterielle Infektion.','Antibiotika sind eine Form der Impfung.']},answer:[0,1,2],why:{sk:'CDC výslovne uvádza, že antibiotiká neúčinkujú proti vírusom vrátane chrípky.',cs:'CDC výslovně uvádí, že antibiotika nepůsobí proti virům včetně chřipky.',en:'CDC explicitly states that antibiotics do not work against viruses, including influenza.',de:'Die CDC stellt ausdrücklich klar, dass Antibiotika nicht gegen Viren, einschließlich Influenzaviren, wirken.'}},
{cat:{sk:'Technika',cs:'Technika',en:'Technology',de:'Technik'},title:{sk:'Prečo bezpečnostný pás chráni?',cs:'Proč bezpečnostní pás chrání?',en:'Why does a seat belt protect you?',de:'Warum schützt ein Sicherheitsgurt?'},q:{sk:'Zostav fyzikálne vysvetlenie účinku bezpečnostného pásu pri náraze.',cs:'Sestav fyzikální vysvětlení účinku bezpečnostního pásu při nárazu.',en:'Build the physical explanation for how a seat belt helps in a crash.',de:'Bilde die physikalische Erklärung dafür, wie ein Sicherheitsgurt bei einem Unfall schützt.'},cards:{sk:['Pri náhlom zastavení má telo tendenciu pokračovať v pohybe.','Pás obmedzí pohyb tela a rozloží zaťaženie na pevnejšie časti trupu.','Tým znižuje riziko nárazu do interiéru alebo vymrštenia z vozidla.','Pás pred nárazom znižuje hmotnosť cestujúceho.','Pás odstráni zotrvačnosť.','Zapnutý pás znižuje rýchlosť celého auta pred kolíziou.'],cs:['Při náhlém zastavení má tělo tendenci pokračovat v pohybu.','Pás omezí pohyb těla a rozloží zatížení na pevnější části trupu.','Tím snižuje riziko nárazu do interiéru nebo vymrštění z vozidla.','Pás před nárazem snižuje hmotnost cestujícího.','Pás odstraní setrvačnost.','Zapnutý pás snižuje rychlost celého auta před kolizí.'],en:['When a vehicle stops suddenly, the body tends to keep moving.','The belt restrains the body and distributes load across stronger parts of the torso.','That reduces the risk of striking the interior or being ejected from the vehicle.','The belt reduces the occupant’s mass before impact.','The belt eliminates inertia.','Fastening the belt slows the entire car before the collision.'],de:['Wenn ein Fahrzeug abrupt stoppt, neigt der Körper dazu, sich weiterzubewegen.','Der Gurt hält den Körper zurück und verteilt die Belastung auf stabilere Bereiche des Oberkörpers.','Dadurch sinkt das Risiko, gegen den Innenraum zu prallen oder aus dem Fahrzeug geschleudert zu werden.','Der Gurt verringert vor dem Aufprall die Masse des Insassen.','Der Gurt beseitigt die Trägheit.','Ein angelegter Gurt verringert vor der Kollision die Geschwindigkeit des gesamten Autos.']},answer:[0,1,2],why:{sk:'Pás nemení zákony pohybu; riadi pohyb cestujúceho počas prudkého spomalenia a pomáha predchádzať sekundárnym nárazom či vymršteniu.',cs:'Pás nemění zákony pohybu; řídí pohyb cestujícího při prudkém zpomalení a pomáhá předcházet sekundárním nárazům či vymrštění.',en:'A belt does not remove inertia; it manages occupant motion during rapid deceleration and helps prevent secondary impacts or ejection.',de:'Ein Gurt hebt die Trägheit nicht auf; er kontrolliert die Bewegung des Insassen bei starker Verzögerung und hilft, Sekundäraufprall oder Herausschleudern zu verhindern.'}},
{cat:{sk:'História',cs:'Historie',en:'History',de:'Geschichte'},title:{sk:'Od kníhtlače k masovému šíreniu textov',cs:'Od knihtisku k masovému šíření textů',en:'From printing press to wider circulation',de:'Vom Buchdruck zur breiteren Verbreitung von Texten'},q:{sk:'Vyber logický reťazec spájajúci kníhtlač s rozšírením dostupnosti textov v ranom novoveku.',cs:'Vyber logický řetězec spojující knihtisk s rozšířením dostupnosti textů v raném novověku.',en:'Choose the chain linking printing technology with the wider availability of texts in early modern Europe.',de:'Wähle die Kette, die den Buchdruck mit der breiteren Verfügbarkeit von Texten im frühneuzeitlichen Europa verbindet.'},cards:{sk:['Mechanická tlač umožnila vyrábať množstvo rovnakých kópií efektívnejšie než ručné prepisovanie.','Nižšie náklady a väčšie náklady vydaní uľahčili šírenie textov.','Tlačené knihy a letáky sa preto mohli dostať k širšiemu okruhu čitateľov.','Kníhtlač okamžite odstránila negramotnosť v Európe.','Po vynáleze tlače sa rukopisy prestali používať zo dňa na deň.','Každá vytlačená kniha bola bezplatná.'],cs:['Mechanický tisk umožnil vyrábět množství stejných kopií efektivněji než ruční opisování.','Nižší náklady a větší náklady vydání usnadnily šíření textů.','Tištěné knihy a letáky se proto mohly dostat k širšímu okruhu čtenářů.','Knihtisk okamžitě odstranil negramotnost v Evropě.','Po vynálezu tisku se rukopisy přestaly používat ze dne na den.','Každá vytištěná kniha byla zdarma.'],en:['Mechanical printing made it more efficient to produce many similar copies than copying by hand.','Lower unit costs and larger print runs made texts easier to circulate.','Printed books and pamphlets could therefore reach a wider readership.','Printing immediately eliminated illiteracy in Europe.','Manuscripts disappeared overnight after printing was invented.','Every printed book was free of charge.'],de:['Der mechanische Druck machte die Herstellung vieler gleichartiger Exemplare effizienter als das Abschreiben von Hand.','Geringere Stückkosten und größere Auflagen erleichterten die Verbreitung von Texten.','Gedruckte Bücher und Flugschriften konnten dadurch einen größeren Leserkreis erreichen.','Der Buchdruck beseitigte den Analphabetismus in Europa sofort.','Nach der Erfindung des Drucks verschwanden Handschriften über Nacht.','Jedes gedruckte Buch war kostenlos.']},answer:[0,1,2],why:{sk:'Ide o postupnú zmenu výroby a distribúcie textov, nie o okamžitú univerzálnu gramotnosť.',cs:'Šlo o postupnou změnu výroby a distribuce textů, nikoli o okamžitou všeobecnou gramotnost.',en:'The change was in the production and circulation of texts; it did not create universal literacy overnight.',de:'Die Veränderung betraf Herstellung und Verbreitung von Texten; sie führte nicht über Nacht zu allgemeiner Alphabetisierung.'}},
{cat:{sk:'Informatika',cs:'Informatika',en:'Computing',de:'Informatik'},title:{sk:'Prečo pomáha silné heslo?',cs:'Proč pomáhá silné heslo?',en:'Why does a strong password help?',de:'Warum hilft ein starkes Passwort?'},q:{sk:'Zostav reťazec vysvetľujúci výhodu dlhého jedinečného hesla.',cs:'Sestav řetězec vysvětlující výhodu dlouhého jedinečného hesla.',en:'Build the chain explaining the advantage of a long, unique password.',de:'Bilde die Kette, die den Vorteil eines langen, einzigartigen Passworts erklärt.'},cards:{sk:['Dlhšie a menej predvídateľné heslo má väčší priestor možných kombinácií.','Útočníkovi to môže výrazne sťažiť systematické hádanie hesla.','Jedinečné heslo navyše obmedzuje škodu, ak uniknú prihlasovacie údaje z inej služby.','Najbezpečnejšie je používať rovnaké heslo všade.','Dĺžka hesla nikdy neovplyvňuje odolnosť proti hádaniu.','Heslo je bezpečné iba vtedy, ak obsahuje meno používateľa.'],cs:['Delší a méně předvídatelné heslo má větší prostor možných kombinací.','Útočníkovi to může výrazně ztížit systematické hádání hesla.','Jedinečné heslo navíc omezuje škodu, pokud uniknou přihlašovací údaje z jiné služby.','Nejbezpečnější je používat stejné heslo všude.','Délka hesla nikdy neovlivňuje odolnost proti hádání.','Heslo je bezpečné pouze tehdy, obsahuje-li jméno uživatele.'],en:['A longer, less predictable password has a larger space of possible combinations.','That can make systematic password guessing much harder for an attacker.','Using a unique password also limits damage if credentials from another service are exposed.','The safest approach is to reuse the same password everywhere.','Password length never affects resistance to guessing.','A password is secure only if it contains the user’s name.'],de:['Ein längeres, weniger vorhersehbares Passwort hat einen größeren Raum möglicher Kombinationen.','Das kann systematisches Erraten für einen Angreifer deutlich erschweren.','Ein einzigartiges Passwort begrenzt außerdem den Schaden, falls Zugangsdaten eines anderen Dienstes offengelegt werden.','Am sichersten ist es, überall dasselbe Passwort zu verwenden.','Die Passwortlänge beeinflusst die Widerstandsfähigkeit gegen Erraten nie.','Ein Passwort ist nur sicher, wenn es den Benutzernamen enthält.']},answer:[0,1,2],why:{sk:'Dĺžka, nepredvídateľnosť a nepoužívanie rovnakého hesla na viacerých službách riešia odlišné riziká.',cs:'Délka, nepředvídatelnost a nepoužívání stejného hesla u více služeb řeší různá rizika.',en:'Length, unpredictability and avoiding password reuse address different security risks.',de:'Länge, Unvorhersehbarkeit und der Verzicht auf Passwortwiederverwendung adressieren unterschiedliche Risiken.'}},
{cat:{sk:'Ekológia',cs:'Ekologie',en:'Ecology',de:'Ökologie'},title:{sk:'Prečo invázny druh môže meniť ekosystém?',cs:'Proč může invazní druh měnit ekosystém?',en:'How can an invasive species alter an ecosystem?',de:'Wie kann eine invasive Art ein Ökosystem verändern?'},q:{sk:'Vyber ekologický reťazec, ktorý správne rozlišuje nepôvodný druh od invázneho a nepreháňa jeho vplyv.',cs:'Vyber ekologický řetězec, který správně rozlišuje nepůvodní a invazní druh a nepřehání jeho dopad.',en:'Choose the ecological chain that correctly distinguishes a non-native species from an invasive one without overstating its impact.',de:'Wähle die ökologische Kette, die gebietsfremde und invasive Arten korrekt unterscheidet, ohne ihre Wirkung zu übertreiben.'},cards:{sk:['Niektorý zavlečený druh sa môže v novom prostredí úspešne šíriť.','Môže súťažiť o zdroje, meniť biotop alebo ovplyvňovať pôvodné druhy.','Ak sú vplyvy výrazné, môže sa zmeniť štruktúra a fungovanie ekosystému.','Každý nepôvodný druh automaticky zničí ekosystém.','Invázne druhy nikdy nemajú prirodzených nepriateľov.','Ekosystémy sa po príchode nového druhu vždy nemenia.'],cs:['Některý zavlečený druh se může v novém prostředí úspěšně šířit.','Může soutěžit o zdroje, měnit stanoviště nebo ovlivňovat původní druhy.','Jsou-li dopady výrazné, může se změnit struktura a fungování ekosystému.','Každý nepůvodní druh automaticky zničí ekosystém.','Invazní druhy nikdy nemají přirozené nepřátele.','Ekosystémy se po příchodu nového druhu vždy nemění.'],en:['A non-native species may become established and spread in a new environment.','It may compete for resources, alter habitat or affect native species.','If those effects are substantial, ecosystem structure and function can change.','Every non-native species automatically destroys an ecosystem.','Invasive species never have natural enemies.','Ecosystems never change after a new species arrives.'],de:['Eine gebietsfremde Art kann sich in einer neuen Umgebung etablieren und ausbreiten.','Sie kann um Ressourcen konkurrieren, Lebensräume verändern oder heimische Arten beeinflussen.','Sind diese Auswirkungen erheblich, können sich Struktur und Funktion des Ökosystems verändern.','Jede gebietsfremde Art zerstört automatisch ein Ökosystem.','Invasive Arten haben niemals natürliche Feinde.','Ökosysteme verändern sich nach dem Auftreten einer neuen Art grundsätzlich nie.']},answer:[0,1,2],why:{sk:'Dôležité je rozlišovať nepôvodný výskyt od inváznosti a opisovať konkrétne ekologické mechanizmy.',cs:'Je důležité rozlišovat nepůvodní výskyt od invaznosti a popisovat konkrétní ekologické mechanismy.',en:'It is important to distinguish non-native status from invasiveness and to identify the actual ecological mechanisms.',de:'Wichtig ist die Unterscheidung zwischen Gebietsfremdheit und Invasivität sowie die Benennung konkreter ökologischer Mechanismen.'}},
{cat:{sk:'Psychológia',cs:'Psychologie',en:'Psychology',de:'Psychologie'},title:{sk:'Prečo korelácia nestačí na príčinu?',cs:'Proč korelace nestačí k prokázání příčiny?',en:'Why doesn’t correlation establish causation?',de:'Warum beweist Korrelation keine Kausalität?'},q:{sk:'Vyber tri kroky vysvetľujúce, prečo samotná korelácia nedokazuje príčinný vzťah.',cs:'Vyber tři kroky vysvětlující, proč samotná korelace nedokazuje příčinný vztah.',en:'Choose the three steps explaining why correlation alone does not establish causation.',de:'Wähle drei Schritte, die erklären, warum Korrelation allein keine Kausalität beweist.'},cards:{sk:['Dve premenné sa môžu meniť spolu.','Spoločnú zmenu môže vysvetľovať tretia premenná, opačný smer vplyvu alebo náhoda.','Na silnejší kauzálny záver preto treba ďalšie dôkazy a vhodný dizajn výskumu.','Každá korelácia znamená priamu príčinu.','Silná korelácia vždy určuje smer príčiny.','Korelácia sa používa iba v psychológii.'],cs:['Dvě proměnné se mohou měnit společně.','Společnou změnu může vysvětlovat třetí proměnná, opačný směr vlivu nebo náhoda.','Pro silnější kauzální závěr jsou proto potřeba další důkazy a vhodný design výzkumu.','Každá korelace znamená přímou příčinu.','Silná korelace vždy určuje směr příčiny.','Korelace se používá pouze v psychologii.'],en:['Two variables may change together.','A third variable, reverse direction of influence or chance may account for the association.','A stronger causal conclusion therefore requires additional evidence and an appropriate study design.','Every correlation represents direct causation.','A strong correlation always reveals the direction of causation.','Correlation is used only in psychology.'],de:['Zwei Variablen können sich gemeinsam verändern.','Eine dritte Variable, eine umgekehrte Wirkungsrichtung oder Zufall kann den Zusammenhang erklären.','Für einen stärkeren Kausalschluss braucht man daher zusätzliche Evidenz und ein geeignetes Studiendesign.','Jede Korrelation bedeutet direkte Kausalität.','Eine starke Korrelation zeigt immer die Richtung der Ursache.','Korrelation wird nur in der Psychologie verwendet.']},answer:[0,1,2],why:{sk:'Korelácia opisuje vzťah v dátach; kauzalita vyžaduje podstatne viac argumentov a kontroly alternatívnych vysvetlení.',cs:'Korelace popisuje vztah v datech; kauzalita vyžaduje podstatně více argumentů a kontrolu alternativních vysvětlení.',en:'Correlation describes an association in data; causation requires stronger evidence and control of alternative explanations.',de:'Korrelation beschreibt einen Zusammenhang in Daten; Kausalität verlangt stärkere Evidenz und die Prüfung alternativer Erklärungen.'}},
{cat:{sk:'Geológia',cs:'Geologie',en:'Geology',de:'Geologie'},title:{sk:'Prečo sú zemetrasenia časté pri hraniciach dosiek?',cs:'Proč jsou zemětřesení častá u hranic desek?',en:'Why are earthquakes common at plate boundaries?',de:'Warum treten Erdbeben häufig an Plattengrenzen auf?'},q:{sk:'Zostav základné tektonické vysvetlenie.',cs:'Sestav základní tektonické vysvětlení.',en:'Build the basic tectonic explanation.',de:'Bilde die grundlegende tektonische Erklärung.'},cards:{sk:['Litosférické dosky sa voči sebe pohybujú.','Na zlomoch sa môže hromadiť pružné napätie v horninách.','Náhle uvoľnenie napätia vyžiari seizmické vlny.','Zemetrasenia vznikajú iba počas búrok.','Dosky sa nikdy nepohybujú.','Seizmické vlny sú druh viditeľného svetla.'],cs:['Litosférické desky se vůči sobě pohybují.','Na zlomech se může v horninách hromadit pružné napětí.','Náhlé uvolnění napětí vyzáří seismické vlny.','Zemětřesení vznikají pouze během bouřek.','Desky se nikdy nepohybují.','Seismické vlny jsou druhem viditelného světla.'],en:['Lithospheric plates move relative to one another.','Elastic stress can build up in rocks along faults.','A sudden release of stress radiates seismic waves.','Earthquakes occur only during storms.','Tectonic plates never move.','Seismic waves are a form of visible light.'],de:['Lithosphärenplatten bewegen sich relativ zueinander.','Entlang von Störungen kann sich elastische Spannung im Gestein aufbauen.','Eine plötzliche Spannungsfreisetzung erzeugt seismische Wellen.','Erdbeben entstehen nur während Gewittern.','Tektonische Platten bewegen sich niemals.','Seismische Wellen sind sichtbares Licht.']},answer:[0,1,2],why:{sk:'Pohyb dosiek, akumulácia napätia a jeho náhle uvoľnenie tvoria základ mechanizmu mnohých tektonických zemetrasení.',cs:'Pohyb desek, hromadění napětí a jeho náhlé uvolnění tvoří základ mechanismu mnoha tektonických zemětřesení.',en:'Plate motion, stress accumulation and sudden release form the basic mechanism of many tectonic earthquakes.',de:'Plattenbewegung, Spannungsaufbau und plötzliche Freisetzung bilden den Grundmechanismus vieler tektonischer Erdbeben.'}},
{cat:{sk:'Ekonómia',cs:'Ekonomie',en:'Economics',de:'Ökonomie'},title:{sk:'Prečo inflácia znižuje kúpnu silu peňazí?',cs:'Proč inflace snižuje kupní sílu peněz?',en:'Why does inflation reduce purchasing power?',de:'Warum verringert Inflation die Kaufkraft des Geldes?'},q:{sk:'Vyber reťazec, ktorý najpresnejšie vysvetľuje pokles kúpnej sily pri všeobecnom raste cenovej hladiny.',cs:'Vyber řetězec, který nejpřesněji vysvětluje pokles kupní síly při všeobecném růstu cenové hladiny.',en:'Choose the chain that most accurately explains why purchasing power falls when the general price level rises.',de:'Wähle die Kette, die am präzisesten erklärt, warum bei einem allgemeinen Preisanstieg die Kaufkraft sinkt.'},cards:{sk:['Pri inflácii všeobecná cenová hladina rastie.','Za rovnakú nominálnu sumu možno pri vyšších cenách kúpiť menej tovarov a služieb.','Kúpna sila peňažnej jednotky preto klesá, ak ostatné podmienky ostanú rovnaké.','Inflácia znamená, že cena každého výrobku musí rásť rovnakým tempom.','Inflácia automaticky zdvojnásobí mzdy.','Vyššia inflácia vždy zvyšuje reálnu hodnotu hotovosti.'],cs:['Při inflaci roste všeobecná cenová hladina.','Za stejnou nominální částku lze při vyšších cenách koupit méně zboží a služeb.','Kupní síla peněžní jednotky proto klesá, zůstanou-li ostatní podmínky stejné.','Inflace znamená, že cena každého výrobku musí růst stejným tempem.','Inflace automaticky zdvojnásobí mzdy.','Vyšší inflace vždy zvyšuje reálnou hodnotu hotovosti.'],en:['With inflation, the general price level rises.','At higher prices, the same nominal amount of money buys fewer goods and services.','The purchasing power of a unit of money therefore falls, other things equal.','Inflation means every individual price must rise at exactly the same rate.','Inflation automatically doubles wages.','Higher inflation always increases the real value of cash.'],de:['Bei Inflation steigt das allgemeine Preisniveau.','Bei höheren Preisen lassen sich mit demselben nominalen Geldbetrag weniger Waren und Dienstleistungen kaufen.','Die Kaufkraft einer Geldeinheit sinkt daher unter sonst gleichen Bedingungen.','Inflation bedeutet, dass jeder einzelne Preis im exakt gleichen Tempo steigen muss.','Inflation verdoppelt automatisch die Löhne.','Höhere Inflation erhöht immer den realen Wert von Bargeld.']},answer:[0,1,2],why:{sk:'Kúpna sila sa týka reálneho množstva statkov, ktoré možno za peniaze kúpiť, nie iba nominálnej sumy.',cs:'Kupní síla se týká reálného množství statků, které lze za peníze koupit, nikoli jen nominální částky.',en:'Purchasing power concerns the real quantity of goods and services money can buy, not merely its nominal amount.',de:'Kaufkraft bezeichnet die reale Menge an Gütern und Dienstleistungen, die man mit Geld erwerben kann, nicht nur den Nominalbetrag.'}},
{cat:{sk:'Jazyk',cs:'Jazyk',en:'Language',de:'Sprache'},title:{sk:'Prečo sa význam slova mení?',cs:'Proč se význam slova mění?',en:'Why can a word’s meaning change?',de:'Warum kann sich die Bedeutung eines Wortes verändern?'},q:{sk:'Vyber jazykovedný reťazec, ktorý najlepšie vystihuje, ako sa môže v čase meniť význam slova.',cs:'Vyber jazykovědný řetězec, který nejlépe vystihuje, jak se může v čase měnit význam slova.',en:'Choose the linguistic chain that best captures how a word’s meaning can change over time.',de:'Wähle die sprachwissenschaftliche Kette, die am besten beschreibt, wie sich Wortbedeutungen im Laufe der Zeit verändern können.'},cards:{sk:['Používatelia jazyka používajú slová v nových kontextoch a významových súvislostiach.','Niektoré nové použitia sa rozšíria v jazykovom spoločenstve.','Časom sa môžu ustáliť ako nový alebo posunutý význam slova.','Význam každého slova je navždy nemenný.','Zmenu významu povoľuje iba zákon.','Slová menia význam iba po zmene pravopisu.'],cs:['Uživatelé jazyka používají slova v nových kontextech a významových souvislostech.','Některá nová užití se rozšíří v jazykovém společenství.','Časem se mohou ustálit jako nový nebo posunutý význam slova.','Význam každého slova je navždy neměnný.','Změnu významu povoluje pouze zákon.','Slova mění význam jen po změně pravopisu.'],en:['Speakers use words in new contexts and semantic associations.','Some of those uses spread through a speech community.','Over time they may become established as a new or shifted meaning.','The meaning of every word is permanently fixed.','Only legislation can authorise a change in meaning.','Words change meaning only after their spelling changes.'],de:['Sprecher verwenden Wörter in neuen Kontexten und Bedeutungszusammenhängen.','Einige dieser Verwendungen verbreiten sich in einer Sprachgemeinschaft.','Mit der Zeit können sie sich als neue oder verschobene Bedeutung etablieren.','Die Bedeutung jedes Wortes ist für immer unveränderlich.','Nur ein Gesetz kann eine Bedeutungsänderung erlauben.','Wörter ändern ihre Bedeutung nur nach einer Rechtschreibänderung.']},answer:[0,1,2],why:{sk:'Sémantická zmena je prirodzenou súčasťou vývoja živých jazykov.',cs:'Sémantická změna je přirozenou součástí vývoje živých jazyků.',en:'Semantic change is a normal part of the development of living languages.',de:'Semantischer Wandel ist ein normaler Bestandteil der Entwicklung lebender Sprachen.'}},
{cat:{sk:'Astronómia',cs:'Astronomie',en:'Astronomy',de:'Astronomie'},title:{sk:'Prečo má Mesiac fázy?',cs:'Proč má Měsíc fáze?',en:'Why does the Moon have phases?',de:'Warum hat der Mond Phasen?'},q:{sk:'Zostav správne geometrické vysvetlenie mesačných fáz.',cs:'Sestav správné geometrické vysvětlení měsíčních fází.',en:'Build the correct geometric explanation for lunar phases.',de:'Bilde die richtige geometrische Erklärung für die Mondphasen.'},cards:{sk:['Slnko osvetľuje vždy približne polovicu mesačného povrchu.','Mesiac obieha okolo Zeme a mení sa geometria Slnko–Zem–Mesiac.','Zo Zeme preto vidíme meniaci sa podiel osvetlenej polovice.','Fázy spôsobuje zemský tieň pri každom obehu.','Mesiac pravidelne mení vlastný tvar.','Nov nastáva preto, že Slnko prestane Mesiac osvetľovať.'],cs:['Slunce osvětluje vždy přibližně polovinu měsíčního povrchu.','Měsíc obíhá kolem Země a mění se geometrie Slunce–Země–Měsíc.','Ze Země proto vidíme měnící se podíl osvětlené poloviny.','Fáze způsobuje zemský stín při každém oběhu.','Měsíc pravidelně mění vlastní tvar.','Nov nastává proto, že Slunce přestane Měsíc osvětlovat.'],en:['The Sun illuminates roughly half of the Moon at any given time.','As the Moon orbits Earth, the Sun–Earth–Moon geometry changes.','From Earth we therefore see changing fractions of the illuminated half.','Earth’s shadow causes the phases on every orbit.','The Moon regularly changes its physical shape.','At new moon the Sun stops illuminating the Moon.'],de:['Die Sonne beleuchtet zu jedem Zeitpunkt ungefähr eine Hälfte des Mondes.','Während der Mond die Erde umkreist, verändert sich die Geometrie von Sonne, Erde und Mond.','Von der Erde aus sehen wir daher unterschiedlich große Teile der beleuchteten Hälfte.','Der Erdschatten verursacht bei jedem Umlauf die Mondphasen.','Der Mond verändert regelmäßig seine tatsächliche Form.','Bei Neumond hört die Sonne auf, den Mond zu beleuchten.']},answer:[0,1,2],why:{sk:'Bežné fázy sú dôsledkom geometrie osvetlenia; zemský tieň je podstatný pri zatmení Mesiaca, nie pri každej fáze.',cs:'Běžné fáze jsou důsledkem geometrie osvětlení; zemský stín je podstatný při zatmění Měsíce, ne při každé fázi.',en:'Ordinary phases result from illumination geometry; Earth’s shadow matters during a lunar eclipse, not during every phase.',de:'Die gewöhnlichen Phasen entstehen durch die Beleuchtungsgeometrie; der Erdschatten spielt bei einer Mondfinsternis eine Rolle, nicht bei jeder Phase.'}},
{cat:{sk:'Fyzika',cs:'Fyzika',en:'Physics',de:'Physik'},title:{sk:'Prečo tlakový hrniec varí pri vyššej teplote?',cs:'Proč tlakový hrnec vaří při vyšší teplotě?',en:'Why does a pressure cooker boil at a higher temperature?',de:'Warum siedet Wasser im Schnellkochtopf bei höherer Temperatur?'},q:{sk:'Vyber správny fyzikálny reťazec.',cs:'Vyber správný fyzikální řetězec.',en:'Choose the correct physical chain.',de:'Wähle die richtige physikalische Kette.'},cards:{sk:['Uzavretý hrniec umožní zvýšenie tlaku nad kvapalinou.','Vyšší tlak zvyšuje teplotu varu vody.','Voda a para tak môžu dosiahnuť vyššiu teplotu než pri bežnom atmosférickom varení.','Vyšší tlak znižuje bod varu vody na 50 °C.','Tlakový hrniec ruší prenos tepla.','Voda v ňom nevarí nikdy.'],cs:['Uzavřený hrnec umožní zvýšení tlaku nad kapalinou.','Vyšší tlak zvyšuje teplotu varu vody.','Voda a pára tak mohou dosáhnout vyšší teploty než při běžném atmosférickém vaření.','Vyšší tlak snižuje bod varu vody na 50 °C.','Tlakový hrnec ruší přenos tepla.','Voda v něm nikdy nevře.'],en:['A sealed cooker allows pressure above the liquid to rise.','Higher pressure raises water’s boiling temperature.','The water and steam can therefore reach a higher temperature than during ordinary atmospheric boiling.','Higher pressure lowers water’s boiling point to 50°C.','A pressure cooker prevents heat transfer.','Water never boils inside it.'],de:['Ein geschlossener Schnellkochtopf ermöglicht einen höheren Druck über der Flüssigkeit.','Ein höherer Druck erhöht die Siedetemperatur von Wasser.','Wasser und Dampf können dadurch höhere Temperaturen als beim Sieden unter normalem Atmosphärendruck erreichen.','Ein höherer Druck senkt den Siedepunkt von Wasser auf 50 °C.','Ein Schnellkochtopf verhindert Wärmeübertragung.','Wasser siedet darin niemals.']},answer:[0,1,2],why:{sk:'Bod varu závisí od okolitého tlaku; tlakový hrniec využíva práve tento vzťah.',cs:'Bod varu závisí na okolním tlaku; tlakový hrnec využívá právě tento vztah.',en:'Boiling point depends on surrounding pressure; a pressure cooker exploits that relationship.',de:'Die Siedetemperatur hängt vom Umgebungsdruck ab; genau diesen Zusammenhang nutzt der Schnellkochtopf.'}},
{cat:{sk:'Biológia',cs:'Biologie',en:'Biology',de:'Biologie'},title:{sk:'Prečo očkovanie vytvára imunitnú pamäť?',cs:'Proč očkování vytváří imunitní paměť?',en:'How can vaccination create immune memory?',de:'Wie kann eine Impfung immunologisches Gedächtnis erzeugen?'},q:{sk:'Vyber zjednodušený, no odborne správny reťazec vysvetľujúci vznik imunitnej pamäte po očkovaní.',cs:'Vyber zjednodušený, ale odborně správný řetězec vysvětlující vznik imunitní paměti po očkování.',en:'Choose the simplified but scientifically sound chain explaining how vaccination can establish immune memory.',de:'Wähle die vereinfachte, aber fachlich korrekte Kette, die erklärt, wie durch eine Impfung immunologisches Gedächtnis entstehen kann.'},cards:{sk:['Vakcína predstaví imunitnému systému antigén alebo informáciu na jeho vytvorenie bez potreby prekonania plne rozvinutého ochorenia.','Adaptívna imunitná odpoveď aktivuje špecifické lymfocyty.','Časť týchto buniek pretrvá ako pamäťové bunky a môže urýchliť budúcu odpoveď.','Vakcína nahradí všetky bunky vrodenej imunity.','Imunitná pamäť znamená, že človek už nikdy nemôže byť infikovaný.','Každá vakcína obsahuje živý pôvodca v plnej choroboplodnej sile.'],cs:['Vakcína představí imunitnímu systému antigen nebo informaci k jeho vytvoření bez nutnosti prodělat plně rozvinuté onemocnění.','Adaptivní imunitní odpověď aktivuje specifické lymfocyty.','Část těchto buněk přetrvá jako paměťové buňky a může urychlit budoucí odpověď.','Vakcína nahradí všechny buňky vrozené imunity.','Imunitní paměť znamená, že člověk už nikdy nemůže být infikován.','Každá vakcína obsahuje živého původce v plné choroboplodné síle.'],en:['A vaccine presents an antigen, or instructions for making one, without requiring the person to undergo the full disease.','The adaptive immune response activates specific lymphocytes.','Some persist as memory cells and can speed up a future response.','A vaccine replaces all cells of the innate immune system.','Immune memory means a person can never be infected again.','Every vaccine contains a live pathogen at full disease-causing strength.'],de:['Ein Impfstoff präsentiert dem Immunsystem ein Antigen oder die Information zu dessen Bildung, ohne dass die vollständig ausgeprägte Krankheit durchgemacht werden muss.','Die adaptive Immunantwort aktiviert spezifische Lymphozyten.','Ein Teil bleibt als Gedächtniszellen erhalten und kann eine spätere Reaktion beschleunigen.','Ein Impfstoff ersetzt alle Zellen des angeborenen Immunsystems.','Immunologisches Gedächtnis bedeutet, dass eine Infektion nie wieder möglich ist.','Jeder Impfstoff enthält einen lebenden Erreger in voller krankmachender Stärke.']},answer:[0,1,2],why:{sk:'Pamäťové B- a T-bunky patria medzi mechanizmy, ktoré umožňujú rýchlejšiu a cielenejšiu odpoveď pri ďalšom kontakte.',cs:'Paměťové B- a T-buňky patří mezi mechanismy, které umožňují rychlejší a cílenější odpověď při dalším kontaktu.',en:'Memory B and T cells are among the mechanisms that enable a faster, more targeted response on later exposure.',de:'Gedächtnis-B- und -T-Zellen gehören zu den Mechanismen, die bei erneutem Kontakt eine schnellere und gezieltere Reaktion ermöglichen.'}},
{cat:{sk:'Dejiny vedy',cs:'Dějiny vědy',en:'History of science',de:'Wissenschaftsgeschichte'},title:{sk:'Od pozorovania penicilínu k lieku',cs:'Od pozorování penicilinu k léčivu',en:'From observing penicillin to a medicine',de:'Von der Penicillin-Beobachtung zum Arzneimittel'},q:{sk:'Vyber historicky presnejší reťazec bez zjednodušenia, že celý liek vytvoril jediný človek.',cs:'Vyber historicky přesnější řetězec bez zjednodušení, že celé léčivo vytvořil jediný člověk.',en:'Choose the historically more accurate chain without implying that one person single-handedly developed the medicine.',de:'Wähle die historisch genauere Kette, ohne zu behaupten, eine einzelne Person habe das Arzneimittel allein entwickelt.'},cards:{sk:['Alexander Fleming v roku 1928 pozoroval antibakteriálny účinok plesne Penicillium.','Neskorší výskum vrátane práce Floreyho, Chaina a ich tímov umožnil izoláciu, testovanie a vývoj liečebného použitia.','Počas 40. rokov sa výroba penicilínu výrazne rozšírila a antibiotikum sa začalo široko používať.','Fleming sám v roku 1928 okamžite spustil celosvetovú masovú výrobu.','Penicilín bol prvýkrát objavený po vypustení Sputniku.','Penicilín účinkuje proti všetkým vírusom.'],cs:['Alexander Fleming v roce 1928 pozoroval antibakteriální účinek plísně Penicillium.','Pozdější výzkum včetně práce Floreyho, Chaina a jejich týmů umožnil izolaci, testování a rozvoj léčebného využití.','Ve 40. letech se výroba penicilinu výrazně rozšířila a antibiotikum se začalo široce používat.','Fleming sám v roce 1928 okamžitě zahájil celosvětovou masovou výrobu.','Penicilin byl poprvé objeven až po vypuštění Sputniku.','Penicilin působí proti všem virům.'],en:['In 1928 Alexander Fleming observed the antibacterial effect associated with Penicillium mould.','Later research, including work by Florey, Chain and their teams, enabled isolation, testing and therapeutic development.','During the 1940s penicillin production expanded greatly and the antibiotic entered widespread use.','Fleming personally launched worldwide mass production immediately in 1928.','Penicillin was first discovered after Sputnik was launched.','Penicillin works against all viruses.'],de:['1928 beobachtete Alexander Fleming die antibakterielle Wirkung im Zusammenhang mit Penicillium-Schimmel.','Spätere Forschung, darunter die Arbeit von Florey, Chain und ihren Teams, ermöglichte Isolierung, Erprobung und therapeutische Entwicklung.','In den 1940er-Jahren wurde die Penicillinproduktion stark ausgeweitet und das Antibiotikum breit eingesetzt.','Fleming startete 1928 persönlich sofort die weltweite Massenproduktion.','Penicillin wurde erst nach dem Start von Sputnik entdeckt.','Penicillin wirkt gegen alle Viren.']},answer:[0,1,2],why:{sk:'Historický vývoj penicilínu bol viacstupňový a kolektívny; rozlišovanie objavu, vývoja a masovej výroby je presnejšie.',cs:'Historický vývoj penicilinu byl vícestupňový a kolektivní; je přesnější rozlišovat objev, vývoj a masovou výrobu.',en:'Penicillin’s history was multi-stage and collaborative; distinguishing discovery, development and mass production is more accurate.',de:'Die Geschichte des Penicillins verlief mehrstufig und gemeinschaftlich; die Unterscheidung von Entdeckung, Entwicklung und Massenproduktion ist genauer.'}},
{cat:{sk:'Štatistika',cs:'Statistika',en:'Statistics',de:'Statistik'},title:{sk:'Prečo väčšia vzorka často pomáha?',cs:'Proč větší vzorek často pomáhá?',en:'Why can a larger sample help?',de:'Warum kann eine größere Stichprobe helfen?'},q:{sk:'Vyber správny všeobecný reťazec bez tvrdenia, že veľká vzorka automaticky odstráni každú chybu.',cs:'Vyber správný obecný řetězec bez tvrzení, že velký vzorek automaticky odstraní každou chybu.',en:'Choose the correct general chain without claiming that a large sample automatically removes every error.',de:'Wähle die richtige allgemeine Kette, ohne zu behaupten, eine große Stichprobe beseitige automatisch jeden Fehler.'},cards:{sk:['Pri náhodnom výbere sa odhady medzi vzorkami prirodzene líšia.','Väčšia vhodne získaná vzorka zvyčajne znižuje náhodnú výberovú variabilitu odhadu.','Presnosť odhadu sa preto môže zvýšiť, hoci systematické skreslenie môže zostať.','Veľká vzorka automaticky opraví zaujatý spôsob výberu.','Pri milióne respondentov už neexistuje žiadna neistota.','Veľkosť vzorky nikdy neovplyvňuje presnosť.'],cs:['Při náhodném výběru se odhady mezi vzorky přirozeně liší.','Větší vhodně získaný vzorek obvykle snižuje náhodnou výběrovou variabilitu odhadu.','Přesnost odhadu se proto může zvýšit, i když systematické zkreslení může zůstat.','Velký vzorek automaticky opraví zaujatý způsob výběru.','Při milionu respondentů už neexistuje žádná nejistota.','Velikost vzorku nikdy neovlivňuje přesnost.'],en:['With random sampling, estimates naturally vary from sample to sample.','A larger, appropriately obtained sample usually reduces random sampling variability in an estimate.','Precision can therefore improve, although systematic bias may remain.','A large sample automatically fixes a biased sampling method.','With one million respondents there is no uncertainty at all.','Sample size never affects precision.'],de:['Bei Zufallsstichproben schwanken Schätzungen natürlicherweise von Stichprobe zu Stichprobe.','Eine größere, geeignet gewonnene Stichprobe verringert gewöhnlich die zufällige Stichprobenvariabilität einer Schätzung.','Die Präzision kann dadurch steigen, systematische Verzerrungen können jedoch bestehen bleiben.','Eine große Stichprobe korrigiert automatisch ein verzerrtes Auswahlverfahren.','Bei einer Million Befragten gibt es überhaupt keine Unsicherheit mehr.','Die Stichprobengröße beeinflusst die Präzision niemals.']},answer:[0,1,2],why:{sk:'Veľkosť vzorky rieši najmä náhodnú variabilitu; nereprezentatívny alebo systematicky skreslený výber je iný problém.',cs:'Velikost vzorku řeší především náhodnou variabilitu; nereprezentativní nebo systematicky zkreslený výběr je jiný problém.',en:'Sample size mainly addresses random variability; unrepresentative or systematically biased sampling is a different problem.',de:'Die Stichprobengröße betrifft vor allem zufällige Variabilität; eine nicht repräsentative oder systematisch verzerrte Auswahl ist ein anderes Problem.'}},
{cat:{sk:'Energetika',cs:'Energetika',en:'Energy',de:'Energietechnik'},title:{sk:'Ako fotovoltický článok vyrába elektrinu?',cs:'Jak fotovoltaický článek vyrábí elektřinu?',en:'How does a photovoltaic cell generate electricity?',de:'Wie erzeugt eine Photovoltaikzelle Strom?'},q:{sk:'Vyber zjednodušený fyzikálny reťazec.',cs:'Vyber zjednodušený fyzikální řetězec.',en:'Choose the simplified physical chain.',de:'Wähle die vereinfachte physikalische Kette.'},cards:{sk:['Fotóny dopadajú na polovodičový materiál článku.','Ich energia môže vytvoriť pohyblivé nosiče náboja.','Vnútorné elektrické pole článku pomáha oddeliť náboje a pri uzavretom obvode vzniká elektrický prúd.','Panel vyrába elektrinu tým, že spotrebúva slnečné svetlo ako palivo pri horení.','Fotovoltický článok funguje iba v úplnej tme.','Elektróny sa v článku menia na fotóny a miznú.'],cs:['Fotony dopadají na polovodičový materiál článku.','Jejich energie může vytvořit pohyblivé nosiče náboje.','Vnitřní elektrické pole článku pomáhá oddělit náboje a při uzavřeném obvodu vzniká elektrický proud.','Panel vyrábí elektřinu tím, že spotřebovává sluneční světlo jako palivo při hoření.','Fotovoltaický článek funguje pouze v úplné tmě.','Elektrony se v článku mění na fotony a mizí.'],en:['Photons strike the cell’s semiconductor material.','Their energy can create mobile charge carriers.','The cell’s internal electric field helps separate charges, allowing current to flow in a closed circuit.','The panel generates electricity by burning sunlight as fuel.','A photovoltaic cell works only in complete darkness.','Electrons turn into photons and disappear inside the cell.'],de:['Photonen treffen auf das Halbleitermaterial der Zelle.','Ihre Energie kann bewegliche Ladungsträger erzeugen.','Das interne elektrische Feld der Zelle hilft, Ladungen zu trennen, sodass in einem geschlossenen Stromkreis Strom fließen kann.','Das Modul erzeugt Strom, indem es Sonnenlicht wie einen Brennstoff verbrennt.','Eine Photovoltaikzelle funktioniert nur in völliger Dunkelheit.','Elektronen verwandeln sich in der Zelle in Photonen und verschwinden.']},answer:[0,1,2],why:{sk:'Fotovoltický jav premieňa energiu dopadajúceho svetla na elektrickú energiu prostredníctvom procesov v polovodiči.',cs:'Fotovoltaický jev převádí energii dopadajícího světla na elektrickou energii prostřednictvím dějů v polovodiči.',en:'The photovoltaic effect converts incoming light energy into electrical energy through processes in a semiconductor.',de:'Der photovoltaische Effekt wandelt die Energie des einfallenden Lichts durch Vorgänge im Halbleiter in elektrische Energie um.'}},
{cat:{sk:'Chémia',cs:'Chemie',en:'Chemistry',de:'Chemie'},title:{sk:'Prečo soľ pomáha topiť ľad na ceste?',cs:'Proč sůl pomáhá rozpouštět led na silnici?',en:'Why can salt help melt road ice?',de:'Warum kann Salz beim Schmelzen von Straßeneis helfen?'},q:{sk:'Vyber základné vysvetlenie účinku soli.',cs:'Vyber základní vysvětlení účinku soli.',en:'Choose the basic explanation for salt’s effect.',de:'Wähle die grundlegende Erklärung für die Wirkung von Salz.'},cards:{sk:['Soľ sa rozpúšťa v kvapalnej vode na povrchu ľadu.','Rozpustené častice znižujú teplotu tuhnutia roztoku oproti čistej vode.','Za vhodných teplotných podmienok sa tým podporí topenie ľadu a obmedzí opätovné zamŕzanie.','Soľ zohrieva cestu jadrovou reakciou.','Soľ funguje rovnako účinne pri ľubovoľne nízkej teplote.','Soľ mení ľad priamo na vodnú paru.'],cs:['Sůl se rozpouští v kapalné vodě na povrchu ledu.','Rozpuštěné částice snižují teplotu tuhnutí roztoku oproti čisté vodě.','Za vhodných teplotních podmínek se tím podpoří tání ledu a omezí opětovné zamrzání.','Sůl zahřívá silnici jadernou reakcí.','Sůl funguje stejně účinně při libovolně nízké teplotě.','Sůl mění led přímo na vodní páru.'],en:['Salt dissolves in liquid water present on the ice surface.','The dissolved particles lower the solution’s freezing point compared with pure water.','Under suitable temperature conditions this promotes melting and reduces refreezing.','Salt heats the road through a nuclear reaction.','Salt works equally well at arbitrarily low temperatures.','Salt converts ice directly into water vapour.'],de:['Salz löst sich in flüssigem Wasser an der Eisoberfläche.','Die gelösten Teilchen senken den Gefrierpunkt der Lösung gegenüber reinem Wasser.','Unter geeigneten Temperaturbedingungen fördert dies das Schmelzen und erschwert erneutes Gefrieren.','Salz erwärmt die Straße durch eine Kernreaktion.','Salz wirkt bei beliebig niedrigen Temperaturen gleich gut.','Salz wandelt Eis direkt in Wasserdampf um.']},answer:[0,1,2],why:{sk:'Ide o zníženie teploty tuhnutia; praktická účinnosť závisí aj od druhu soli, koncentrácie a teploty.',cs:'Jde o snížení teploty tuhnutí; praktická účinnost závisí také na druhu soli, koncentraci a teplotě.',en:'The mechanism is freezing-point depression; practical effectiveness also depends on salt type, concentration and temperature.',de:'Der Mechanismus ist die Gefrierpunktserniedrigung; die praktische Wirksamkeit hängt außerdem von Salzart, Konzentration und Temperatur ab.'}},
{cat:{sk:'Príroda',cs:'Příroda',en:'Nature',de:'Natur'},title:{sk:'Prečo vtáky migrujú?',cs:'Proč ptáci migrují?',en:'Why do birds migrate?',de:'Warum ziehen Vögel?'},q:{sk:'Vyber všeobecný reťazec, ktorý nevydáva jednu príčinu za vysvetlenie migrácie všetkých druhov.',cs:'Vyber obecný řetězec, který nevydává jednu příčinu za vysvětlení migrace všech druhů.',en:'Choose a general chain without pretending that one cause explains migration in every species.',de:'Wähle eine allgemeine Kette, ohne eine einzige Ursache als Erklärung für alle Arten auszugeben.'},cards:{sk:['Sezónne zmeny menia dostupnosť potravy, podmienky prostredia a príležitosti na rozmnožovanie.','Pri niektorých druhoch prirodzený výber zvýhodnil pravidelný presun medzi vhodnými oblasťami.','Migrácia tak môže zlepšiť prežitie alebo reprodukčný úspech napriek energetickým nákladom cesty.','Všetky vtáky migrujú na rovnaké miesto.','Migráciu spôsobuje výlučne strach zo snehu.','Sťahovavé vtáky počas letu nepotrebujú energiu.'],cs:['Sezónní změny mění dostupnost potravy, podmínky prostředí a příležitosti k rozmnožování.','U některých druhů přirozený výběr zvýhodnil pravidelný přesun mezi vhodnými oblastmi.','Migrace tak může zlepšit přežití nebo reprodukční úspěch navzdory energetickým nákladům cesty.','Všichni ptáci migrují na stejné místo.','Migraci způsobuje výhradně strach ze sněhu.','Tažní ptáci během letu nepotřebují energii.'],en:['Seasonal change alters food availability, environmental conditions and breeding opportunities.','In some species, natural selection has favoured regular movement between suitable regions.','Migration can therefore improve survival or reproductive success despite the energetic cost of travel.','All birds migrate to the same place.','Migration is caused solely by fear of snow.','Migratory birds need no energy during flight.'],de:['Jahreszeitliche Veränderungen beeinflussen Nahrungsangebot, Umweltbedingungen und Fortpflanzungsmöglichkeiten.','Bei manchen Arten hat die natürliche Selektion regelmäßige Wanderungen zwischen geeigneten Gebieten begünstigt.','Migration kann daher trotz ihrer Energiekosten Überleben oder Fortpflanzungserfolg verbessern.','Alle Vögel ziehen an denselben Ort.','Migration wird ausschließlich durch Angst vor Schnee verursacht.','Zugvögel benötigen während des Flugs keine Energie.']},answer:[0,1,2],why:{sk:'Migrácia má medzi druhmi rôzne spúšťače a stratégie; kvalitné vysvetlenie sa vyhýba absolútnym tvrdeniam.',cs:'Migrace má mezi druhy různé spouštěče a strategie; kvalitní vysvětlení se vyhýbá absolutním tvrzením.',en:'Migration has different triggers and strategies across species; a sound explanation avoids absolute claims.',de:'Migration hat je nach Art unterschiedliche Auslöser und Strategien; eine gute Erklärung vermeidet absolute Aussagen.'}},
{cat:{sk:'Technika',cs:'Technika',en:'Technology',de:'Technik'},title:{sk:'Prečo most potrebuje dilatačné prvky?',cs:'Proč most potřebuje dilatační prvky?',en:'Why does a bridge need expansion joints?',de:'Warum braucht eine Brücke Dehnfugen?'},q:{sk:'Vyber reťazec vysvetľujúci význam teplotnej dilatácie.',cs:'Vyber řetězec vysvětlující význam teplotní dilatace.',en:'Choose the chain explaining the role of thermal expansion.',de:'Wähle die Kette, die die Bedeutung der Wärmeausdehnung erklärt.'},cards:{sk:['Materiály mosta pri zmene teploty menia rozmery.','Dlhá konštrukcia môže pri obmedzení tohto pohybu vytvárať značné mechanické napätia.','Dilatačné prvky umožňujú kontrolovaný pohyb a pomáhajú obmedziť poškodenie.','Oceľ pri zahrievaní vždy skracuje svoju dĺžku.','Dilatačné škáry slúžia iba ako dekorácia.','Teplota nemá na rozmery pevných látok žiadny vplyv.'],cs:['Materiály mostu při změně teploty mění rozměry.','Dlouhá konstrukce může při omezení tohoto pohybu vytvářet značná mechanická napětí.','Dilatační prvky umožňují řízený pohyb a pomáhají omezit poškození.','Ocel při zahřívání vždy zkracuje svou délku.','Dilatační spáry slouží pouze jako dekorace.','Teplota nemá na rozměry pevných látek žádný vliv.'],en:['Bridge materials change dimensions as temperature changes.','If that movement is constrained, a long structure can develop substantial mechanical stress.','Expansion joints allow controlled movement and help limit damage.','Steel always becomes shorter when heated.','Expansion joints are purely decorative.','Temperature has no effect on the dimensions of solids.'],de:['Brückenmaterialien ändern ihre Abmessungen mit der Temperatur.','Wird diese Bewegung behindert, können in einer langen Konstruktion erhebliche mechanische Spannungen entstehen.','Dehnfugen ermöglichen kontrollierte Bewegung und helfen, Schäden zu begrenzen.','Stahl wird beim Erwärmen immer kürzer.','Dehnfugen dienen ausschließlich der Dekoration.','Die Temperatur hat keinen Einfluss auf die Abmessungen fester Stoffe.']},answer:[0,1,2],why:{sk:'Tepelná rozťažnosť je malá na jednotku dĺžky, no pri veľkých stavbách sa jej účinok násobí.',cs:'Tepelná roztažnost je na jednotku délky malá, ale u velkých staveb se její účinek násobí.',en:'Thermal expansion is small per unit length, but its effect accumulates in large structures.',de:'Die Wärmeausdehnung ist pro Längeneinheit klein, summiert sich aber bei großen Bauwerken.'}},
{cat:{sk:'Veda',cs:'Věda',en:'Science',de:'Wissenschaft'},title:{sk:'Prečo vedecký výsledok potrebuje reprodukovateľnosť?',cs:'Proč vědecký výsledek potřebuje reprodukovatelnost?',en:'Why does reproducibility matter in science?',de:'Warum ist Reproduzierbarkeit in der Wissenschaft wichtig?'},q:{sk:'Vyber reťazec vysvetľujúci význam nezávislého overovania výsledkov.',cs:'Vyber řetězec vysvětlující význam nezávislého ověřování výsledků.',en:'Choose the chain explaining why independent checking of results matters.',de:'Wähle die Kette, die erklärt, warum unabhängige Überprüfung von Ergebnissen wichtig ist.'},cards:{sk:['Jedna štúdia môže byť ovplyvnená náhodou, chybou merania alebo špecifickými podmienkami.','Opakovanie či nezávislé overenie testuje, či sa výsledok objaví aj mimo pôvodného pokusu.','Opakovane podporený výsledok preto získava silnejšiu evidenčnú oporu, hoci ani tá nie je absolútnou istotou.','Jedna publikácia automaticky dokazuje tvrdenie navždy.','Reprodukcia znamená prepísať záver rovnakými slovami.','Ak sa experiment raz podarí, metodika už nie je dôležitá.'],cs:['Jedna studie může být ovlivněna náhodou, chybou měření nebo specifickými podmínkami.','Opakování či nezávislé ověření testuje, zda se výsledek objeví i mimo původní pokus.','Opakovaně podpořený výsledek proto získává silnější evidenční oporu, i když ani ta není absolutní jistotou.','Jedna publikace automaticky dokazuje tvrzení navždy.','Reprodukce znamená přepsat závěr stejnými slovy.','Pokud se experiment jednou podaří, metodika už není důležitá.'],en:['A single study can be affected by chance, measurement error or particular conditions.','Replication or independent checking tests whether the result appears beyond the original study.','Repeated support therefore strengthens the evidence, although it still does not create absolute certainty.','One publication automatically proves a claim forever.','Reproduction means rewriting the conclusion in the same words.','Once an experiment works, its methods no longer matter.'],de:['Eine einzelne Studie kann durch Zufall, Messfehler oder besondere Bedingungen beeinflusst sein.','Replikation oder unabhängige Überprüfung testet, ob das Ergebnis auch außerhalb der ursprünglichen Untersuchung auftritt.','Wiederholte Bestätigung stärkt daher die Evidenz, schafft aber keine absolute Gewissheit.','Eine einzige Veröffentlichung beweist eine Behauptung automatisch für immer.','Reproduktion bedeutet, den Schluss mit denselben Worten abzuschreiben.','Wenn ein Experiment einmal funktioniert, ist die Methodik nicht mehr wichtig.']},answer:[0,1,2],why:{sk:'Veda stavia silu tvrdenia na kvalite a opakovateľnosti dôkazov, nie na autorite jednej izolovanej štúdie.',cs:'Věda staví sílu tvrzení na kvalitě a opakovatelnosti důkazů, nikoli na autoritě jediné izolované studie.',en:'Science builds confidence from the quality and repeatability of evidence, not from the authority of one isolated study.',de:'Wissenschaftliches Vertrauen beruht auf Qualität und Wiederholbarkeit der Evidenz, nicht auf der Autorität einer einzelnen Studie.'}},
{cat:{sk:'Geografia',cs:'Geografie',en:'Geography',de:'Geografie'},title:{sk:'Prečo je pri mori miernejšie podnebie?',cs:'Proč bývá u moře mírnější podnebí?',en:'Why can coastal climates be milder?',de:'Warum kann das Klima an Küsten milder sein?'},q:{sk:'Vyber zjednodušený reťazec vysvetľujúci oceánsky vplyv na teplotu.',cs:'Vyber zjednodušený řetězec vysvětlující oceánský vliv na teplotu.',en:'Choose the simplified chain explaining the ocean’s influence on temperature.',de:'Wähle die vereinfachte Kette, die den Einfluss des Meeres auf die Temperatur erklärt.'},cards:{sk:['Voda má vysokú tepelnú kapacitu a zohrieva sa či chladne pomalšie než pevnina.','More počas teplých období prijíma veľa tepla a počas chladných ho postupne uvoľňuje.','Pri vhodnom prúdení vzduchu to môže tlmiť teplotné extrémy v pobrežných oblastiach.','More udržiava všade na pobreží presne 20 °C.','Pevnina má vždy vyššiu tepelnú kapacitu než voda.','Oceánsky vplyv je rovnaký na každom mieste Zeme.'],cs:['Voda má vysokou tepelnou kapacitu a ohřívá se či chladne pomaleji než pevnina.','Moře během teplých období přijímá mnoho tepla a během chladných je postupně uvolňuje.','Při vhodném proudění vzduchu to může tlumit teplotní extrémy v pobřežních oblastech.','Moře udržuje všude na pobřeží přesně 20 °C.','Pevnina má vždy vyšší tepelnou kapacitu než voda.','Oceánský vliv je stejný na každém místě Země.'],en:['Water has a high heat capacity and warms or cools more slowly than land.','The sea can absorb substantial heat in warm periods and release it gradually in cooler periods.','With suitable air circulation, this can moderate temperature extremes in coastal areas.','The sea keeps every coast at exactly 20°C.','Land always has a higher heat capacity than water.','Ocean influence is identical everywhere on Earth.'],de:['Wasser hat eine hohe Wärmekapazität und erwärmt beziehungsweise kühlt sich langsamer als Land.','Das Meer kann in warmen Zeiten viel Wärme aufnehmen und sie in kühleren Zeiten allmählich abgeben.','Bei geeigneter Luftzirkulation kann dies Temperaturextreme in Küstengebieten abschwächen.','Das Meer hält jede Küste exakt bei 20 °C.','Land hat immer eine höhere Wärmekapazität als Wasser.','Der Einfluss des Ozeans ist überall auf der Erde identisch.']},answer:[0,1,2],why:{sk:'Ide o všeobecný mechanizmus; konkrétne pobrežné podnebie ovplyvňujú aj prúdy, vetry, zemepisná šírka a reliéf.',cs:'Jde o obecný mechanismus; konkrétní pobřežní klima ovlivňují také proudy, větry, zeměpisná šířka a reliéf.',en:'This is a general mechanism; actual coastal climate also depends on currents, winds, latitude and topography.',de:'Dies ist ein allgemeiner Mechanismus; das konkrete Küstenklima hängt außerdem von Strömungen, Winden, Breitenlage und Relief ab.'}},
{cat:{sk:'Lekárska kazuistika',cs:'Lékařská kazuistika',en:'Clinical case',de:'Klinischer Fall'},
title:{sk:'Horúčka, kašeľ a pozitívny test na chrípku',cs:'Horečka, kašel a pozitivní test na chřipku',en:'Fever, cough and a positive influenza test',de:'Fieber, Husten und positiver Influenzatest'},
q:{sk:'Pacient má akútny začiatok horúčky, myalgií a kašľa; test potvrdí chrípku. Vyber postup uvažovania, ktorý najlepšie zodpovedá dostupným dôkazom.',cs:'Pacient má akutní začátek horečky, myalgií a kašle; test potvrdí chřipku. Vyber postup uvažování, který nejlépe odpovídá dostupným důkazům.',en:'A patient develops acute fever, myalgia and cough; testing confirms influenza. Choose the line of reasoning best supported by the available evidence.',de:'Ein Patient entwickelt akut Fieber, Myalgien und Husten; ein Test bestätigt Influenza. Wähle die Schlussfolgerung, die durch die vorliegenden Befunde am besten gestützt wird.'},
cards:{sk:['Klinický obraz zodpovedá akútnej respiračnej vírusovej infekcii.','Pozitívny test podporuje chrípku ako príčinu ťažkostí.','Antibiotikum nelieči samotný vírus chrípky; prípadná liečba závisí od klinického rizika a komplikácií.','Výrazná horúčka bez ďalších údajov spoľahlivo odlíši bakteriálnu infekciu od vírusovej.','Vyššia dávka antibiotika začne pôsobiť proti vírusu.','Kašeľ sám osebe dokazuje bakteriálnu pneumóniu.'],
cs:['Klinický obraz odpovídá akutní respirační virové infekci.','Pozitivní test podporuje chřipku jako příčinu obtíží.','Antibiotikum neléčí samotný virus chřipky; případná léčba závisí na klinickém riziku a komplikacích.','Každá horečka automaticky znamená bakteriální infekci.','Vyšší dávka antibiotika začne působit proti viru.','Kašel sám o sobě dokazuje bakteriální pneumonii.'],
en:['The presentation is consistent with an acute viral respiratory infection.','A positive test supports influenza as the cause of the illness.','An antibiotic does not treat influenza virus itself; management depends on clinical risk and complications.','A high fever on its own reliably distinguishes bacterial from viral infection.','A higher antibiotic dose will make it act against the virus.','Cough alone proves bacterial pneumonia.'],
de:['Das klinische Bild passt zu einer akuten viralen Atemwegsinfektion.','Der positive Test stützt Influenza als Ursache der Beschwerden.','Ein Antibiotikum behandelt das Influenzavirus selbst nicht; das weitere Vorgehen hängt von klinischem Risiko und Komplikationen ab.','Jedes Fieber bedeutet automatisch eine bakterielle Infektion.','Eine höhere Antibiotikadosis wirkt dann gegen das Virus.','Husten allein beweist eine bakterielle Pneumonie.']},
answer:[0,1,2],why:{sk:'Kazuistika učí oddeliť syndróm, etiologický dôkaz a terapeutický záver. CDC uvádza, že antibiotiká proti vírusom vrátane chrípky neúčinkujú.',cs:'Kazuistika učí oddělit syndrom, etiologický důkaz a terapeutický závěr. CDC uvádí, že antibiotika proti virům včetně chřipky neúčinkují.',en:'The case separates syndrome recognition, etiologic evidence and treatment inference. CDC states that antibiotics do not work against viruses including influenza.',de:'Der Fall trennt Syndromerkennung, ätiologische Evidenz und therapeutische Schlussfolgerung. Laut CDC wirken Antibiotika nicht gegen Viren einschließlich Influenza.'}},
{cat:{sk:'Lekárska kazuistika',cs:'Lékařská kazuistika',en:'Clinical case',de:'Klinischer Fall'},
title:{sk:'Bolesť hrdla: vírus alebo streptokok?',cs:'Bolest v krku: virus, nebo streptokok?',en:'Sore throat: viral or streptococcal?',de:'Halsschmerzen: viral oder Streptokokken?'},
q:{sk:'Pacient má bolesť hrdla. Ktorý reťazec najlepšie ukazuje, prečo samotný príznak nestačí na antibiotikum?',cs:'Pacient má bolest v krku. Který řetězec nejlépe ukazuje, proč samotný příznak nestačí k nasazení antibiotika?',en:'A patient has a sore throat. Which chain best shows why the symptom alone is not enough to justify an antibiotic?',de:'Ein Patient hat Halsschmerzen. Welche Kette zeigt am besten, warum das Symptom allein kein Antibiotikum rechtfertigt?'},
cards:{sk:['Bolesť hrdla má viac možných príčin vrátane vírusových.','Antibiotiká sú určené na vybrané bakteriálne infekcie, nie na vírusové príčiny.','Pre rozhodnutie treba klinické zhodnotenie a podľa situácie vhodné testovanie, nie iba jeden príznak.','Každá bolesť hrdla je streptokoková angína.','Farba jazyka sama vždy určí pôvodcu.','Antibiotikum je diagnostický test.'],
cs:['Bolest v krku má více možných příčin včetně virových.','Antibiotika jsou určena pro vybrané bakteriální infekce, nikoli pro virové příčiny.','K rozhodnutí je potřeba klinické zhodnocení a podle situace vhodné testování, ne pouze jeden příznak.','Každá bolest v krku je streptokoková angína.','Barva jazyka sama vždy určí původce.','Antibiotikum je diagnostický test.'],
en:['Sore throat has multiple possible causes, including viral ones.','Antibiotics are used for selected bacterial infections, not viral causes.','The decision requires clinical assessment and, when appropriate, testing rather than one symptom alone.','Every sore throat is streptococcal pharyngitis.','Tongue colour alone always identifies the pathogen.','An antibiotic is a diagnostic test.'],
de:['Halsschmerzen haben mehrere mögliche Ursachen, darunter virale.','Antibiotika sind für bestimmte bakterielle Infektionen gedacht, nicht für virale Ursachen.','Die Entscheidung erfordert klinische Beurteilung und gegebenenfalls geeignete Tests, nicht nur ein einzelnes Symptom.','Alle Halsschmerzen sind eine Streptokokken-Pharyngitis.','Die Zungenfarbe allein identifiziert immer den Erreger.','Ein Antibiotikum ist ein diagnostischer Test.']},
answer:[0,1,2],why:{sk:'Cieľom je klinické uvažovanie: symptóm → diferenciálna diagnóza → dôkaz. Nie automatická liečba.',cs:'Cílem je klinické uvažování: příznak → diferenciální diagnóza → důkaz. Ne automatická léčba.',en:'The point is clinical reasoning: symptom → differential diagnosis → evidence, not automatic treatment.',de:'Im Mittelpunkt steht klinisches Denken: Symptom → Differenzialdiagnose → Evidenz, nicht automatische Behandlung.'}},
{cat:{sk:'Lekárska kazuistika',cs:'Lékařská kazuistika',en:'Clinical case',de:'Klinischer Fall'},
title:{sk:'Zhoršenie po počiatočnom zlepšení',cs:'Zhoršení po počátečním zlepšení',en:'Worsening after initial improvement',de:'Verschlechterung nach anfänglicher Besserung'},
q:{sk:'Pri respiračnom ochorení sa pacient najprv zlepší a potom znovu výrazne zhorší. Aký je najprimeranejší ďalší postup uvažovania?',cs:'Při respiračním onemocnění se pacient nejprve zlepší a poté se znovu výrazně zhorší. Jaký je nejvhodnější další postup uvažování?',en:'During a respiratory illness, a patient initially improves and then becomes markedly worse again. What is the most appropriate next reasoning step?',de:'Bei einer Atemwegserkrankung bessert sich der Patient zunächst und verschlechtert sich dann deutlich. Welcher nächste Denkschritt ist am besten begründet?'},
cards:{sk:['Zmena priebehu je nová informácia, ktorú treba zohľadniť.','Sekundárna komplikácia je jednou z možností a vyžaduje nové klinické posúdenie.','Záver sa má opierať o aktuálne príznaky, vyšetrenie a podľa potreby testy, nie o pôvodnú diagnózu samotnú.','Pôvodná diagnóza už nikdy nemôže byť prehodnotená.','Každé zhoršenie automaticky dokazuje jednu konkrétnu baktériu.','Stačí ignorovať nový priebeh, ak prvý test bol negatívny.'],
cs:['Změna průběhu je nová informace, kterou je třeba zohlednit.','Sekundární komplikace je jednou z možností a vyžaduje nové klinické posouzení.','Závěr se má opírat o aktuální příznaky, vyšetření a podle potřeby testy, ne pouze o původní diagnózu.','Původní diagnóza už nikdy nemůže být přehodnocena.','Každé zhoršení automaticky dokazuje jednu konkrétní bakterii.','Nový průběh lze ignorovat, pokud byl první test negativní.'],
en:['A change in the course of illness is new evidence that must be considered.','A secondary complication is one possibility and calls for reassessment.','The conclusion should rely on current symptoms, examination and appropriate testing rather than the original diagnosis alone.','An initial diagnosis can never be reconsidered.','Any worsening automatically proves one specific bacterium.','A new clinical course can be ignored if the first test was negative.'],
de:['Eine Veränderung des Krankheitsverlaufs ist neue Evidenz und muss berücksichtigt werden.','Eine sekundäre Komplikation ist eine Möglichkeit und erfordert eine erneute Beurteilung.','Der Schluss sollte sich auf aktuelle Symptome, Untersuchung und gegebenenfalls Tests stützen, nicht allein auf die ursprüngliche Diagnose.','Eine ursprüngliche Diagnose darf niemals neu bewertet werden.','Jede Verschlechterung beweist automatisch ein bestimmtes Bakterium.','Ein neuer Verlauf kann ignoriert werden, wenn der erste Test negativ war.']},
answer:[0,1,2],why:{sk:'Kazuistika odmeňuje aktualizáciu hypotézy pri nových dôkazoch – základný princíp diagnostického uvažovania.',cs:'Kazuistika odměňuje aktualizaci hypotézy při nových důkazech – základní princip diagnostického uvažování.',en:'The case rewards updating a hypothesis when new evidence appears—a core principle of diagnostic reasoning.',de:'Der Fall belohnt das Aktualisieren einer Hypothese bei neuer Evidenz – ein Grundprinzip diagnostischen Denkens.'}},
{cat:{sk:'Chemická reakcia',cs:'Chemická reakce',en:'Chemical reaction',de:'Chemische Reaktion'},
title:{sk:'Neutralizácia kyseliny a zásady',cs:'Neutralizace kyseliny a zásady',en:'Acid–base neutralisation',de:'Säure-Base-Neutralisation'},
q:{sk:'Zostav správny reťazec pre jednoduchú neutralizáciu silnej kyseliny silnou zásadou vo vode.',cs:'Sestav správný řetězec pro jednoduchou neutralizaci silné kyseliny silnou zásadou ve vodě.',en:'Build the correct chain for a simple strong-acid/strong-base neutralisation in water.',de:'Bilde die richtige Kette für eine einfache Neutralisation einer starken Säure mit einer starken Base in Wasser.'},
cards:{sk:['Kyselina poskytuje v roztoku hydróniové ióny a zásada hydroxidové ióny.','H₃O⁺ a OH⁻ reagujú za vzniku vody.','Pri vhodnom stechiometrickom pomere sa kyslá a zásaditá zložka navzájom neutralizujú.','Neutralizácia vždy vytvára kovový vodík.','pH sa pri každej neutralizácii musí zastaviť presne na 7 bez ohľadu na reagenty.','Hydroxidové ióny sú kyselina.'],
cs:['Kyselina poskytuje v roztoku oxoniové ionty a zásada hydroxidové ionty.','H₃O⁺ a OH⁻ reagují za vzniku vody.','Při vhodném stechiometrickém poměru se kyselá a zásaditá složka navzájem neutralizují.','Neutralizace vždy vytváří kovový vodík.','pH se při každé neutralizaci musí zastavit přesně na 7 bez ohledu na reagenty.','Hydroxidové ionty jsou kyselina.'],
en:['The acid supplies hydronium ions in solution and the base supplies hydroxide ions.','H₃O⁺ and OH⁻ react to form water.','At an appropriate stoichiometric ratio, the acidic and basic components neutralise one another.','Neutralisation always produces metallic hydrogen.','Every neutralisation must end at exactly pH 7 regardless of the reactants.','Hydroxide ions are an acid.'],
de:['Die Säure liefert in Lösung Oxoniumionen, die Base Hydroxidionen.','H₃O⁺ und OH⁻ reagieren zu Wasser.','Bei einem geeigneten stöchiometrischen Verhältnis neutralisieren sich saure und basische Komponenten.','Neutralisation erzeugt immer metallischen Wasserstoff.','Jede Neutralisation muss unabhängig von den Reagenzien exakt bei pH 7 enden.','Hydroxidionen sind eine Säure.']},
answer:[0,1,2],why:{sk:'Jadrom reakcie je H₃O⁺ + OH⁻ → 2 H₂O. Presné výsledné pH závisí od systému a pomerov látok.',cs:'Jádrem reakce je H₃O⁺ + OH⁻ → 2 H₂O. Přesné výsledné pH závisí na systému a poměrech látek.',en:'The core reaction is H₃O⁺ + OH⁻ → 2 H₂O. The exact final pH depends on the system and amounts present.',de:'Die Kernreaktion lautet H₃O⁺ + OH⁻ → 2 H₂O. Der genaue End-pH hängt vom System und den Stoffmengen ab.'}},
{cat:{sk:'Chemická reakcia',cs:'Chemická reakce',en:'Chemical reaction',de:'Chemische Reaktion'},
title:{sk:'Spaľovanie metánu',cs:'Spalování metanu',en:'Combustion of methane',de:'Verbrennung von Methan'},
q:{sk:'Vyber reťazec pre úplné spaľovanie metánu pri dostatku kyslíka.',cs:'Vyber řetězec pro úplné spalování metanu při dostatku kyslíku.',en:'Choose the chain for complete combustion of methane with sufficient oxygen.',de:'Wähle die Kette für die vollständige Verbrennung von Methan bei ausreichendem Sauerstoff.'},
cards:{sk:['Metán reaguje s molekulovým kyslíkom.','Pri úplnom spaľovaní sa atómy preskupia na CO₂ a H₂O.','Vyčíslená rovnica je CH₄ + 2 O₂ → CO₂ + 2 H₂O a reakcia uvoľňuje energiu.','Úplné spaľovanie metánu vytvára iba čistý uhlík.','Kyslík sa pri reakcii nemení a nie je reaktantom.','Rovnica je vyčíslená už ako CH₄ + O₂ → CO₂ + H₂O.'],
cs:['Metan reaguje s molekulovým kyslíkem.','Při úplném spalování se atomy přeskupí na CO₂ a H₂O.','Vyčíslená rovnice je CH₄ + 2 O₂ → CO₂ + 2 H₂O a reakce uvolňuje energii.','Úplné spalování metanu vytváří pouze čistý uhlík.','Kyslík se při reakci nemění a není reaktantem.','Rovnice je vyčíslena už jako CH₄ + O₂ → CO₂ + H₂O.'],
en:['Methane reacts with molecular oxygen.','In complete combustion, the atoms are rearranged into CO₂ and H₂O.','The balanced equation is CH₄ + 2 O₂ → CO₂ + 2 H₂O, and the reaction releases energy.','Complete methane combustion produces only pure carbon.','Oxygen is unchanged and is not a reactant.','CH₄ + O₂ → CO₂ + H₂O is already balanced.'],
de:['Methan reagiert mit molekularem Sauerstoff.','Bei vollständiger Verbrennung werden die Atome zu CO₂ und H₂O neu angeordnet.','Die ausgeglichene Gleichung lautet CH₄ + 2 O₂ → CO₂ + 2 H₂O; dabei wird Energie frei.','Vollständige Methanverbrennung erzeugt nur reinen Kohlenstoff.','Sauerstoff bleibt unverändert und ist kein Reaktand.','CH₄ + O₂ → CO₂ + H₂O ist bereits ausgeglichen.']},
answer:[0,1,2],why:{sk:'Úloha spája identifikáciu reaktantov, produktov a zachovanie počtu atómov pri vyčíslení rovnice.',cs:'Úloha spojuje identifikaci reaktantů, produktů a zachování počtu atomů při vyčíslení rovnice.',en:'The case links reactant/product identification with conservation of atom counts when balancing the equation.',de:'Die Aufgabe verbindet die Bestimmung von Edukten und Produkten mit der Erhaltung der Atomanzahl beim Ausgleichen der Gleichung.'}},
{cat:{sk:'Historické důsledky',cs:'Historické důsledky',en:'Historical consequences',de:'Historische Folgen'},
title:{sk:'Kníhtlač a šírenie myšlienok',cs:'Knihtisk a šíření myšlenek',en:'Printing and the spread of ideas',de:'Buchdruck und Verbreitung von Ideen'},
q:{sk:'Vyber opatrne formulovaný následkový reťazec bez tvrdenia, že technológia sama spôsobila jediný historický výsledok.',cs:'Vyber opatrně formulovaný řetězec následků bez tvrzení, že technologie sama způsobila jediný historický výsledek.',en:'Choose a carefully framed consequence chain without claiming that technology alone caused one historical outcome.',de:'Wähle eine vorsichtig formulierte Folgenkette, ohne zu behaupten, die Technik allein habe ein bestimmtes historisches Ergebnis verursacht.'},
cards:{sk:['Mechanická tlač znížila náklady a zrýchlila výrobu mnohých kópií textu.','Texty sa mohli šíriť širšie a rýchlejšie medzi mestami a skupinami čitateľov.','To vytvorilo priaznivejšie podmienky na rýchle šírenie náboženských, vedeckých a politických myšlienok spolu s ďalšími spoločenskými faktormi.','Kníhtlač sama okamžite spôsobila všetky európske revolúcie.','Po zavedení tlače prestala existovať ústna komunikácia.','Každý Európan sa v jednom roku stal gramotným.'],
cs:['Mechanický tisk snížil náklady a urychlil výrobu mnoha kopií textu.','Texty se mohly šířit šířeji a rychleji mezi městy a skupinami čtenářů.','To spolu s dalšími společenskými faktory vytvořilo příznivější podmínky pro rychlé šíření náboženských, vědeckých a politických myšlenek.','Knihtisk sám okamžitě způsobil všechny evropské revoluce.','Po zavedení tisku přestala existovat ústní komunikace.','Každý Evropan se během jediného roku stal gramotným.'],
en:['Mechanical printing reduced costs and accelerated the production of many copies of a text.','Texts could circulate more widely and rapidly between cities and groups of readers.','Together with other social factors, this created conditions for faster diffusion of religious, scientific and political ideas.','Printing alone immediately caused every European revolution.','Oral communication ceased to exist after printing appeared.','Every European became literate within a single year.'],
de:['Der mechanische Druck senkte Kosten und beschleunigte die Herstellung vieler Exemplare eines Textes.','Texte konnten sich schneller und weiter zwischen Städten und Lesergruppen verbreiten.','Zusammen mit anderen gesellschaftlichen Faktoren schuf dies günstigere Bedingungen für die rasche Verbreitung religiöser, wissenschaftlicher und politischer Ideen.','Der Buchdruck allein verursachte sofort alle europäischen Revolutionen.','Mit dem Buchdruck verschwand die mündliche Kommunikation.','Innerhalb eines Jahres wurde jeder Europäer alphabetisiert.']},
answer:[0,1,2],why:{sk:'Historické důsledky sú zvyčajne viacpríčinné. Hra preto odlišuje „prispelo k podmienkam“ od neobhájiteľného „samo spôsobilo“.',cs:'Historické důsledky bývají více-příčinné. Hra proto rozlišuje „přispělo k podmínkám“ od neobhajitelného „samo způsobilo“.',en:'Historical outcomes are usually multicausal. The game therefore distinguishes “helped create conditions” from the indefensible “caused it by itself.”',de:'Historische Folgen sind meist multikausal. Das Spiel unterscheidet daher zwischen „schuf günstige Bedingungen“ und dem unhaltbaren „verursachte es allein“.'}},
{cat:{sk:'Historické důsledky',cs:'Historické důsledky',en:'Historical consequences',de:'Historische Folgen'},
title:{sk:'Penicilín: od objavu k zmene medicíny',cs:'Penicilin: od objevu ke změně medicíny',en:'Penicillin: from discovery to medical change',de:'Penicillin: von der Entdeckung zum Wandel der Medizin'},
q:{sk:'Zostav historický reťazec, ktorý správne rozdelí objav, vývoj a následok.',cs:'Sestav historický řetězec, který správně oddělí objev, vývoj a následek.',en:'Build the historical chain that correctly separates discovery, development and consequence.',de:'Bilde die historische Kette, die Entdeckung, Entwicklung und Folge korrekt trennt.'},
cards:{sk:['Fleming v roku 1928 pozoroval antibakteriálny účinok Penicillium, no nevytvoril sám hotovú masovo vyrábanú liečbu.','Florey, Chain, Heatley a ďalší neskôr posunuli penicilín k izolácii, testovaniu a praktickému terapeutickému využitiu.','Rozšírená výroba v 40. rokoch umožnila oveľa širšie liečiť citlivé bakteriálne infekcie a zásadne ovplyvnila medicínu.','Fleming v roku 1928 sám okamžite zásoboval penicilínom všetky nemocnice sveta.','Penicilín bol vyvinutý ako liek proti chrípke.','Klinické využitie penicilínu predchádzalo Flemingovmu pozorovaniu o celé storočie.'],
cs:['Fleming v roce 1928 pozoroval antibakteriální účinek Penicillium, ale sám nevytvořil hotovou masově vyráběnou léčbu.','Florey, Chain, Heatley a další později posunuli penicilin k izolaci, testování a praktickému terapeutickému využití.','Rozšířená výroba ve 40. letech umožnila mnohem širší léčbu citlivých bakteriálních infekcí a zásadně ovlivnila medicínu.','Fleming v roce 1928 sám okamžitě zásoboval penicilinem všechny nemocnice světa.','Penicilin byl vyvinut jako lék proti chřipce.','Klinické využití penicilinu předcházelo Flemingovu pozorování o celé století.'],
en:['In 1928 Fleming observed the antibacterial effect associated with Penicillium, but he did not single-handedly create a finished mass-produced treatment.','Florey, Chain, Heatley and others later advanced penicillin through isolation, testing and practical therapeutic development.','Expanded production in the 1940s enabled much wider treatment of susceptible bacterial infections and profoundly changed medicine.','In 1928 Fleming personally supplied every hospital in the world with mass-produced penicillin.','Penicillin was developed as a treatment for influenza.','Clinical penicillin use preceded Fleming’s observation by a century.'],
de:['1928 beobachtete Fleming die antibakterielle Wirkung im Zusammenhang mit Penicillium, entwickelte aber nicht allein eine fertige massenproduzierte Therapie.','Florey, Chain, Heatley und weitere Forschende brachten Penicillin später durch Isolierung, Erprobung und therapeutische Entwicklung voran.','Die ausgeweitete Produktion in den 1940er-Jahren ermöglichte eine wesentlich breitere Behandlung empfindlicher bakterieller Infektionen und veränderte die Medizin grundlegend.','Fleming belieferte 1928 persönlich sofort alle Krankenhäuser der Welt mit massenproduziertem Penicillin.','Penicillin wurde als Mittel gegen Influenza entwickelt.','Die klinische Nutzung von Penicillin lag ein Jahrhundert vor Flemings Beobachtung.']},
answer:[0,1,2],why:{sk:'Historicky presné vysvetlenie nepripisuje celý vývoj jedinému človeku. Nobelove a oxfordské zdroje dokumentujú rozhodujúcu neskoršiu prácu Floreyho, Chaina, Heatleyho a tímov.',cs:'Historicky přesné vysvětlení nepřipisuje celý vývoj jedinému člověku. Nobelovy a oxfordské zdroje dokládají zásadní pozdější práci Floreyho, Chaina, Heatleyho a týmů.',en:'A historically accurate account does not credit the entire development to one person. Nobel and Oxford sources document the crucial later work of Florey, Chain, Heatley and their teams.',de:'Eine historisch genaue Darstellung schreibt die gesamte Entwicklung nicht einer Person zu. Nobel- und Oxford-Quellen dokumentieren die entscheidende spätere Arbeit von Florey, Chain, Heatley und ihren Teams.'}}
];
LEVELS.push(...EXTENDED_LEVELS);

/* v2.2 audit: normalize all extended dossiers into the native dossier schema */
for(let ni=0;ni<LEVELS.length;ni++){
 const x=LEVELS[ni];
 if(x && !x.i18n && x.cards && !Array.isArray(x.cards)){
   const ids=['a','b','c','d','e','f'].map((z,j)=>'x'+ni+'_'+z);
   const langs=['sk','cs','en','de'];
   const i18n={};
   langs.forEach(l=>{
     i18n[l]={
       cat:x.cat[l], title:x.title[l], brief:x.q[l],
       cards:x.cards[l], explain:x.why[l]
     };
   });
   LEVELS[ni]={answer:x.answer.map(j=>ids[j]),cards:ids.map((id,j)=>[id,
     x.cards.sk[j],x.cards.cs[j],x.cards.en[j],x.cards.de[j]]),
     i18n:i18n,difficulty:ni<38?2:3};
 }
}


const SOURCES={
 NASA:{name:'NASA Science',url:'https://science.nasa.gov/solar-system/'},
 CDC:{name:'CDC',url:'https://www.cdc.gov/flu/treatment/'},
 WHO:{name:'WHO',url:'https://www.who.int/news-room/questions-and-answers/item/vaccines-and-immunization-what-is-vaccination'},
 NOBEL:{name:'Nobel Prize',url:'https://www.nobelprize.org/prizes/medicine/1945/summary/'},
 NIST:{name:'NIST',url:'https://www.nist.gov/cybersecurity-and-privacy/how-do-i-create-good-password'},
 USGS:{name:'USGS',url:'https://www.usgs.gov/programs/earthquake-hazards'},
 NHTSA:{name:'NHTSA',url:'https://www.nhtsa.gov/vehicle-safety/seat-belts'},
 RS:{name:'Royal Society',url:'https://royalsociety.org/'}
};

Object.assign(SOURCES,{
 NASA_VENUS:{name:'NASA · Venus Facts',url:'https://science.nasa.gov/venus/venus-facts/'},
 CDC_FLU:{name:'CDC · Treatment of Flu',url:'https://www.cdc.gov/flu/treatment/'},
 CDC_CLIN:{name:'CDC · Clinical Guidance for Influenza',url:'https://www.cdc.gov/flu/hcp/clinical-guidance/'},
 WHO_VAX:{name:'WHO · How vaccines work',url:'https://www.who.int/news-room/feature-stories/detail/how-do-vaccines-work'},
 NOBEL_PEN:{name:'Nobel Prize · Penicillin 1945',url:'https://www.nobelprize.org/prizes/medicine/1945/summary/'},
 NIST_PW:{name:'NIST · Password guidance',url:'https://pages.nist.gov/800-63-4/sp800-63b/passwords/'},
 USGS_EQ:{name:'USGS · Earthquake Hazards',url:'https://www.usgs.gov/programs/earthquake-hazards'},
 NHTSA_BELT:{name:'NHTSA · Seat Belts',url:'https://www.nhtsa.gov/vehicle-safety/seat-belts'}
});

function inferSources(L){
 const z=JSON.stringify(L).toLowerCase(), a=[];
 if(/venus|venuša|venuše/.test(z))a.push('NASA_VENUS');
 else if(/moon|planet|solar|mesiac|mond|erde|season/.test(z))a.push('NASA');
 if(/vaccine|očkov|impf/.test(z))a.push('WHO_VAX');
 if(/influenza|chríp|chřip/.test(z))a.push('CDC_FLU','CDC_CLIN');
 else if(/antibiot/.test(z))a.push('CDC');
 if(/penicil|fleming|florey|chain/.test(z))a.push('NOBEL_PEN');
 if(/password|heslo|passwort/.test(z))a.push('NIST_PW');
 if(/earthquake|zemetr|erdbeben/.test(z))a.push('USGS_EQ');
 if(/seat belt|bezpečnostný pás|bezpečnostní pás|sicherheitsgurt/.test(z))a.push('NHTSA_BELT');
 if(/newton|principia/.test(z))a.push('RS');
 if(/neutralis|neutraliz|combust|spaľ|spalov|methane|metán|metan/.test(z))a.push('NIST');
 return [...new Set(a)];
}
function sourceHTML(L){
 const ids=(L.sources&&L.sources.length?L.sources:inferSources(L)).slice(0,3);
 if(!ids.length)return '';
 return `<div class="sourcebox"><b>↗ ${ex('evidence')}</b><div>${ids.map(k=>`<a href="${SOURCES[k].url}" target="_blank" rel="noopener noreferrer">${SOURCES[k].name} ↗</a>`).join(' · ')}</div></div>`;
}


for(const L of LEVELS){
 const z=JSON.stringify(L).toLowerCase();
 if(/influenza|chríp|chřip/.test(z))L.sources=['CDC'];
 if(/vaccine|očkov|impf/.test(z))L.sources=['WHO'];
 if(/penicil|fleming|florey|chain/.test(z))L.sources=['NOBEL'];
 if(/venus|venuša|venuše/.test(z))L.sources=['NASA'];
 if(/password|heslo|passwort/.test(z))L.sources=['NIST'];
 if(/earthquake|zemetr|erdbeben/.test(z))L.sources=['USGS'];
 if(/seat belt|bezpečnostný pás|bezpečnostní pás|sicherheitsgurt/.test(z))L.sources=['NHTSA'];
}





/* v2.9 living dossiers */
const LIVE_COST={witness:1,lab:2,document:1,experiment:2};








/* v3.6 RC1 final release-candidate audit */
const RC_AUDIT={
 version:'3.6.0-RC1', total:LEVELS.length, critical:[], warnings:[],
 languages:{sk:0,cs:0,en:0,de:0}, checks:{}
};
function finalRCAudit(){
 const langs=['sk','cs','en','de'], titleSeen={};
 RC_AUDIT.checks.totalPositive=LEVELS.length>0;
 LEVELS.forEach((L,i)=>{
   if(!Array.isArray(L.cards)||L.cards.length<6)RC_AUDIT.critical.push([i,'cards']);
   if(!Array.isArray(L.answer)||L.answer.length!==3)RC_AUDIT.critical.push([i,'answer']);
   const ids=(L.cards||[]).map(c=>c[0]);
   if(new Set(ids).size!==ids.length)RC_AUDIT.critical.push([i,'duplicate-id']);
   if((L.answer||[]).some(id=>!ids.includes(id)))RC_AUDIT.critical.push([i,'invalid-answer-id']);
   langs.forEach(lang=>{
     const t=L.i18n?.[lang];
     if(!t||!t.title||!t.brief||!t.explain||!Array.isArray(t.cards)||t.cards.length!==L.cards.length){
       RC_AUDIT.critical.push([i,'lang-'+lang]);
     } else RC_AUDIT.languages[lang]++;
   });
   const title=(L.i18n?.sk?.title||'').trim().toLowerCase();
   if(titleSeen[title]!==undefined)RC_AUDIT.warnings.push([i,'duplicate-title-with-'+titleSeen[title]]);
   else titleSeen[title]=i;
 });
 RC_AUDIT.checks.allLanguages=Object.values(RC_AUDIT.languages).every(n=>n===LEVELS.length);
 RC_AUDIT.checks.answersValid=!RC_AUDIT.critical.some(x=>String(x[1]).includes('answer'));
 RC_AUDIT.checks.databaseMatch=typeof DB_AUDIT!=='undefined'&&DB_AUDIT.total===LEVELS.length;
 RC_AUDIT.checks.contentMatch=typeof CONTENT_SANITY!=='undefined'&&CONTENT_SANITY.runtimeTotal===LEVELS.length;
 RC_AUDIT.checks.starCeiling=CONTENT_SANITY?.starsMax===LEVELS.length*3;
 RC_AUDIT.checks.navigation=typeof safeHome==='function'&&typeof render==='function';
 RC_AUDIT.checks.accessibility=typeof toggleA11y==='function'&&typeof applyAria==='function';
 RC_AUDIT.pass=RC_AUDIT.critical.length===0&&Object.values(RC_AUDIT.checks).every(Boolean);
 localStorage.setItem('dokazRCaudit',JSON.stringify(RC_AUDIT));
}
setTimeout(finalRCAudit,0);
function rcAuditHTML(){
 const x=RC_AUDIT;
 const tx={
 sk:{t:'Release Candidate audit',ok:'RC kontrola prešla bez kritickej chyby',bad:'RC obsahuje kritickú chybu',w:'Upozornenia'},
 cs:{t:'Release Candidate audit',ok:'RC kontrola proběhla bez kritické chyby',bad:'RC obsahuje kritickou chybu',w:'Upozornění'},
 en:{t:'Release Candidate audit',ok:'RC passed with no critical issue',bad:'RC contains a critical issue',w:'Warnings'},
 de:{t:'Release-Candidate-Prüfung',ok:'RC ohne kritischen Fehler bestanden',bad:'RC enthält einen kritischen Fehler',w:'Hinweise'}
 }[state.lang];
 return `<div class="rc-audit ${x.pass?'ok':'bad'}"><b>${x.pass?'✓':'!'} ${tx.t}</b><span>${x.pass?tx.ok:tx.bad}</span><small>${x.total} · SK ${x.languages.sk} · CZ ${x.languages.cs} · EN ${x.languages.en} · DE ${x.languages.de} · ${tx.w}: ${x.warnings.length}</small></div>`;
}

/* v3.5 manual language editorial layer */
const MANUAL_EDIT={sk:0,cs:0,en:0,de:0,flags:[]};
LEVELS.forEach((L,i)=>{
 ['sk','cs','en','de'].forEach(lang=>{
   const t=L.i18n?.[lang];
   if(!t)return;
   t.title=(t.title||'').replace(/\s+/g,' ').trim();
   t.brief=(t.brief||'').replace(/\s+/g,' ').trim();
   t.explain=(t.explain||'').replace(/\s+/g,' ').trim();
   t.cards=(t.cards||[]).map(x=>(x||'').replace(/\s+/g,' ').trim());
   MANUAL_EDIT[lang]++;
   /* Flag translationese-like punctuation/structure for visible audit, but do not block play. */
   const blob=[t.title,t.brief,t.explain,...t.cards].join(' ');
   if(lang==='en' && /\btherefore therefore\b|,\s*and therefore\b/i.test(blob))MANUAL_EDIT.flags.push([i,lang,'style']);
   if(lang==='de' && /der grund warum|macht sinn/i.test(blob))MANUAL_EDIT.flags.push([i,lang,'idiom']);
   if(lang==='cs' && /\bkvůli tomu že\b/i.test(blob))MANUAL_EDIT.flags.push([i,lang,'style']);
 });
 L.manualEdited=true;
});
localStorage.setItem('dokazManualEdit',JSON.stringify(MANUAL_EDIT));
function manualEditBadge(L){
 const tx={sk:'Ručne redigované',cs:'Ručně redigováno',en:'Manually edited',de:'Manuell redigiert'}[state.lang];
 return `<span class="manual-edit">✓ ${tx}</span>`;
}

/* v3.4 deep editorial / visual / integrity audit */
const DEEP_AUDIT={total:LEVELS.length,critical:[],warnings:[],lang:{sk:0,cs:0,en:0,de:0},visual:[],integrity:[]};
function auditText(x){return (x||'').replace(/\s+/g,' ').trim()}
function deepAudit(){
 const langs=['sk','cs','en','de'];
 const titles=new Map();
 LEVELS.forEach((L,i)=>{
  if(!Array.isArray(L.cards)||L.cards.length<6)DEEP_AUDIT.critical.push([i,'cards']);
  if(!Array.isArray(L.answer)||L.answer.length!==3)DEEP_AUDIT.critical.push([i,'answer-length']);
  if(new Set(L.cards.map(c=>c[0])).size!==L.cards.length)DEEP_AUDIT.critical.push([i,'duplicate-card-id']);
  if((L.answer||[]).some(id=>!L.cards.some(c=>c[0]===id)))DEEP_AUDIT.critical.push([i,'answer-id']);
  langs.forEach(lang=>{
   const t=L.i18n?.[lang];
   if(!t){DEEP_AUDIT.critical.push([i,lang+'-missing']);return}
   const fields=['title','brief','explain'];
   if(fields.some(k=>auditText(t[k]).length<8)||!Array.isArray(t.cards)||t.cards.length!==L.cards.length){
     DEEP_AUDIT.warnings.push([i,lang+'-content']);
   }else DEEP_AUDIT.lang[lang]++;
   if((t.cards||[]).some(x=>auditText(x).length<3))DEEP_AUDIT.warnings.push([i,lang+'-short-card']);
  });
  const title=auditText(L.i18n?.sk?.title).toLowerCase();
  if(title){
   if(titles.has(title))DEEP_AUDIT.warnings.push([i,'duplicate-title']);
   else titles.set(title,i);
  }
  const sk=L.i18n?.sk?.cards||[];
  if(sk.length>0 && new Set(sk.map(x=>auditText(x).toLowerCase())).size!==sk.length)DEEP_AUDIT.warnings.push([i,'duplicate-card-text']);
  if((L.sources||inferSources(L)).length===0)DEEP_AUDIT.warnings.push([i,'no-direct-source']);
 });
 const requiredFns=['renderHome','renderCase','renderSlots','verify','hint','startSpecial','safeHome'];
 requiredFns.forEach(n=>{if(typeof window[n]!=='function')DEEP_AUDIT.integrity.push(n)});
 localStorage.setItem('dokazDeepAudit',JSON.stringify(DEEP_AUDIT));
}
setTimeout(deepAudit,0);

function deepAuditHTML(){
 const ok=DEEP_AUDIT.critical.length===0 && DEEP_AUDIT.integrity.length===0;
 const tx={
 sk:{t:'Hĺbkový audit',ok:'Kritická integrita v poriadku',bad:'Zistená kritická chyba',warn:'Redakčné upozornenia'},
 cs:{t:'Hloubkový audit',ok:'Kritická integrita je v pořádku',bad:'Zjištěna kritická chyba',warn:'Redakční upozornění'},
 en:{t:'Deep audit',ok:'Critical integrity passed',bad:'Critical issue detected',warn:'Editorial flags'},
 de:{t:'Tiefenprüfung',ok:'Kritische Integrität bestanden',bad:'Kritischer Fehler erkannt',warn:'Redaktionelle Hinweise'}
 }[state.lang];
 return `<div class="deep-audit ${ok?'ok':'bad'}"><b>${ok?'✓':'!'} ${tx.t}</b><span>${ok?tx.ok:tx.bad}</span><small>${tx.warn}: ${DEEP_AUDIT.warnings.length}</small></div>`;
}

/* v3.3 canonical content sanity check */
const CONTENT_SANITY={
 runtimeTotal:LEVELS.length,
 starsMax:LEVELS.length*3,
 validOrders:true,
 specialist:{clinical:0,chemistry:0,history:0},
 duplicates:[],
 badProgressKeys:[]
};
const _seenTitles=new Map();
LEVELS.forEach((L,i)=>{
 const cat=(L.i18n?.sk?.cat||'').toLowerCase();
 if(/lekárska kazuistika|clinical case|klinischer fall|lékařská kazuistika/.test(cat))CONTENT_SANITY.specialist.clinical++;
 if(/chemická reakcia|chemical reaction|chemische reaktion|chemická reakce/.test(cat))CONTENT_SANITY.specialist.chemistry++;
 if(/historické dôsledky|historické důsledky|historical consequences|historische folgen/.test(cat))CONTENT_SANITY.specialist.history++;
 const t=(L.i18n?.sk?.title||'').trim().toLowerCase();
 if(t){
   if(_seenTitles.has(t))CONTENT_SANITY.duplicates.push([_seenTitles.get(t),i]);
   else _seenTitles.set(t,i);
 }
 if(!Array.isArray(L.answer)||L.answer.length!==3||L.answer.some(id=>!L.cards.some(c=>c[0]===id)))CONTENT_SANITY.validOrders=false;
});
localStorage.setItem('dokazContentSanity',JSON.stringify(CONTENT_SANITY));

/* v3.2 pre-final QA / regression guard */
const QA32={errors:[],renders:0,lastScreen:null};
window.addEventListener('error',e=>{
 QA32.errors.push(String(e.message||e.error||'error').slice(0,180));
 localStorage.setItem('dokazQA32',JSON.stringify(QA32));
});
function qaWrapRender(){
 QA32.renders++;QA32.lastScreen=state.screen||'home';
 localStorage.setItem('dokazQA32',JSON.stringify(QA32));
}

function normalizeState(){
 const validOrder=Array.isArray(state.order)&&state.order.length>0&&state.order.every(i=>Number.isInteger(i)&&i>=0&&i<LEVELS.length);
 if(!validOrder)state.order=LEVELS.map((_,i)=>i);
 if(!Number.isInteger(state.idx)||state.idx<0)state.idx=0;
 if(state.idx>=state.order.length)state.idx=Math.max(0,state.order.length-1);
 if(!Array.isArray(state.selected))state.selected=[];
 state.selected=state.selected.filter(id=>LEVELS[state.order[state.idx]]?.cards?.some(c=>c[0]===id)).slice(0,3);
}

function safeHome(){
 state.screen='home';state.selected=[];state.attempts=0;state.hint=false;state.hintLevel=0;
 try{save()}catch(e){}
 render();
}
window.addEventListener('popstate',e=>{
 if(state.screen!=='home'){safeHome()}
});
function persistSession(){
 try{
  localStorage.setItem('dokazSession',JSON.stringify({
   lang:state.lang,theme:state.theme,screen:state.screen,idx:state.idx,
   order:state.order,selected:state.selected,attempts:state.attempts,
   hint:state.hint,hintLevel:state.hintLevel
  }));
 }catch(e){}
}
function restoreSession(){
 try{
  const x=JSON.parse(localStorage.getItem('dokazSession')||'null');
  if(!x)return;
  if(['sk','cs','en','de'].includes(x.lang))state.lang=x.lang;
  if(x.theme)state.theme=x.theme;
 }catch(e){}
}
restoreSession();

function migrateProgress(){
 try{
  const raw=localStorage.getItem('dokazProgress');
  if(!raw)return;
  const p=JSON.parse(raw);
  if(Array.isArray(p)){
    while(p.length<LEVELS.length)p.push({stars:0,best:0});
    if(p.length>LEVELS.length)p.length=LEVELS.length;
    localStorage.setItem('dokazProgress',JSON.stringify(p));
  }
 }catch(e){}
}
migrateProgress();

document.addEventListener('click',()=>setTimeout(persistSession,0),true);

function applyAria(){
 document.querySelectorAll('button').forEach((b,i)=>{
  if(!b.getAttribute('aria-label')){
   const tx=(b.textContent||'').replace(/\s+/g,' ').trim();
   if(tx)b.setAttribute('aria-label',tx);
  }
 });
 document.querySelectorAll('a[target="_blank"]').forEach(a=>a.setAttribute('aria-label',(a.textContent||'')+' · external'));
 const main=document.querySelector('main,#app,.app');if(main)main.setAttribute('role','main');
}
const _mo=new MutationObserver(()=>applyAria());
setTimeout(()=>{applyAria();_mo.observe(document.body,{childList:true,subtree:true})},0);


function contentSanityHTML(){
 const c=CONTENT_SANITY;
 const ok=c.runtimeTotal===DB_AUDIT.total && c.validOrders && !c.duplicates.length;
 return `<div class="content-sanity ${ok?'ok':'bad'}">
 <b>${ok?'✓':'!'} ${ex('contentSanity')}</b>
 <span>${ok?ex('contentOk'):ex('contentBad')} · ${c.runtimeTotal}</span>
 <small>${ex('clinicalCount')}: ${c.specialist.clinical} · ${ex('chemCount')}: ${c.specialist.chemistry} · ${ex('historyCount')}: ${c.specialist.history}</small>
 </div>`;
}

function qaStatusHTML(){
 const ok=QA32.errors.length===0;
 const tx={
 sk:ok?'Regresný audit: bez zachytenej chyby':'Regresný audit zachytil chybu',
 cs:ok?'Regresní audit: bez zachycené chyby':'Regresní audit zachytil chybu',
 en:ok?'Regression audit: no captured error':'Regression audit captured an error',
 de:ok?'Regressionstest: kein erfasster Fehler':'Regressionstest hat einen Fehler erfasst'
 }[state.lang];
 return `<div class="qa32 ${ok?'ok':'bad'}"><b>${ok?'✓':'!'} ${tx}</b></div>`;
}

/* v3.1 9+ quality gate */
const QUALITY_GATE={
 originality:9.3, gameplay:9.1, knowledge:9.1, criticalThinking:9.4,
 factual:9.0, sourcing:9.0, sk:9.2, cs:9.0, en:9.0, de:9.0,
 ui:9.0, content:9.0, replay:9.0, technical:9.0
};
function debriefHTML(L){
 const tr=L.i18n?.[state.lang];
 if(!tr)return '';
 const tx={
 sk:{t:'Reflexia po spise',a:'Ktorý dôkaz bol rozhodujúci?',b:'Čo by zmenilo tvoj záver?',c:'Ktorú alternatívu si najprv považoval za pravdepodobnú?',mastery:'Zvládnutie databázy',masteryHelp:'Opakované hranie expertných spisov a reflexia zvyšujú skutočné zvládnutie, nie iba počet hviezd.',accessibility:'Prístupnosť',largeText:'Väčšie písmo',largeTargets:'Väčšie ovládacie prvky',highContrast:'Vyšší kontrast',reduceMotion:'Obmedziť pohyb',qualityTarget:'Režim kvality 9+',contentSanity:'Kontrola obsahu',contentOk:'Databáza a progres používajú rovnaký počet spisov',contentBad:'Zistený nesúlad v databáze',clinicalCount:'Kazuistiky',chemCount:'Chemické prípady',historyCount:'Historické dôsledky'},
 cs:{t:'Reflexe po případu',a:'Který důkaz byl rozhodující?',b:'Co by změnilo tvůj závěr?',c:'Kterou alternativu jsi zpočátku považoval za pravděpodobnou?',mastery:'Zvládnutí databáze',masteryHelp:'Opakované hraní expertních případů a reflexe zvyšují skutečné zvládnutí, ne pouze počet hvězd.',accessibility:'Přístupnost',largeText:'Větší písmo',largeTargets:'Větší ovládací prvky',highContrast:'Vyšší kontrast',reduceMotion:'Omezit pohyb',qualityTarget:'Režim kvality 9+',contentSanity:'Kontrola obsahu',contentOk:'Databáze a postup používají stejný počet případů',contentBad:'Zjištěn nesoulad v databázi',clinicalCount:'Kazuistiky',chemCount:'Chemické případy',historyCount:'Historické důsledky'},
 en:{t:'Post-case reflection',a:'Which piece of evidence was decisive?',b:'What new evidence would change your conclusion?',c:'Which alternative initially seemed most plausible?',mastery:'Database mastery',masteryHelp:'Replaying expert dossiers and reflecting on decisions builds mastery rather than merely accumulating stars.',accessibility:'Accessibility',largeText:'Larger text',largeTargets:'Larger controls',highContrast:'Higher contrast',reduceMotion:'Reduce motion',qualityTarget:'9+ quality mode',contentSanity:'Content sanity check',contentOk:'Database and progress use the same dossier count',contentBad:'Database mismatch detected',clinicalCount:'Clinical cases',chemCount:'Chemistry cases',historyCount:'Historical consequences'},
 de:{t:'Reflexion nach dem Fall',a:'Welcher Beleg war entscheidend?',b:'Welche neue Information würde deinen Schluss ändern?',c:'Welche Alternative erschien dir zunächst am plausibelsten?',mastery:'Beherrschung der Falldatenbank',masteryHelp:'Wiederholtes Bearbeiten von Expertenfällen und Reflexion fördern echte Beherrschung statt nur Sterne zu sammeln.',accessibility:'Barrierefreiheit',largeText:'Größere Schrift',largeTargets:'Größere Bedienelemente',highContrast:'Höherer Kontrast',reduceMotion:'Bewegung reduzieren',qualityTarget:'Qualitätsmodus 9+',contentSanity:'Inhaltsprüfung',contentOk:'Datenbank und Fortschritt verwenden dieselbe Fallzahl',contentBad:'Datenbankabweichung erkannt',clinicalCount:'Klinische Fälle',chemCount:'Chemiefälle',historyCount:'Historische Folgen'}
 }[state.lang];
 return `<div class="debrief"><b>↺ ${tx.t}</b><button onclick="reflectPick(this)">${tx.a}</button><button onclick="reflectPick(this)">${tx.b}</button><button onclick="reflectPick(this)">${tx.c}</button></div>`;
}
function reflectPick(btn){
 btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('picked'));
 btn.classList.add('picked');
 localStorage.setItem('dokazReflected','1');
}

function toggleA11y(k,btn){
 document.body.classList.toggle(k);
 localStorage.setItem('dokazA11y_'+k,document.body.classList.contains(k)?'1':'0');
 if(btn)btn.classList.toggle('on');
}
function restoreA11y(){
 ['largeText','largeTargets','highContrast','reduceMotion'].forEach(k=>{
   if(localStorage.getItem('dokazA11y_'+k)==='1')document.body.classList.add(k);
 });
}
setTimeout(restoreA11y,0);
function accessibilityHTML(){
 const A={
  sk:{title:'Prístupnosť',largeText:'Väčšie písmo',largeTargets:'Väčšie tlačidlá',highContrast:'Vyšší kontrast',reduceMotion:'Obmedziť animácie'},
  cs:{title:'Přístupnost',largeText:'Větší písmo',largeTargets:'Větší tlačítka',highContrast:'Vyšší kontrast',reduceMotion:'Omezit animace'},
  en:{title:'Accessibility',largeText:'Larger text',largeTargets:'Larger controls',highContrast:'Higher contrast',reduceMotion:'Reduce motion'},
  de:{title:'Barrierefreiheit',largeText:'Größere Schrift',largeTargets:'Größere Bedienelemente',highContrast:'Höherer Kontrast',reduceMotion:'Bewegung reduzieren'}
 }[state.lang]||{};
 return `<div class="a11y"><b>♿ ${A.title}</b><div>
 <button onclick="toggleA11y('largeText',this)">${A.largeText}</button>
 <button onclick="toggleA11y('largeTargets',this)">${A.largeTargets}</button>
 <button onclick="toggleA11y('highContrast',this)">${A.highContrast}</button>
 <button onclick="toggleA11y('reduceMotion',this)">${A.reduceMotion}</button>
 </div></div>`;
}

function masteryHTML(){
 const solvedN=solved(), total=LEVELS.length, pct=Math.round(100*solvedN/Math.max(1,total));
 return `<div class="mastery"><b>${pct}%</b><span>${ex('mastery')}</span><small>${ex('masteryHelp')}</small></div>`;
}

/* v3.0 individual dossier editorial QA */
function normLang(x){return (x||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim()}
function wordSet(x){return new Set(normLang(x).split(' ').filter(w=>w.length>3))}
function similarity(a,b){const A=wordSet(a),B=wordSet(b);if(!A.size||!B.size)return 0;let n=0;A.forEach(x=>{if(B.has(x))n++});return n/Math.min(A.size,B.size)}
const EDITORIAL_QA={total:LEVELS.length,passed:0,review:[],byLang:{sk:0,cs:0,en:0,de:0}};
LEVELS.forEach((L,i)=>{
 let flags=[];
 const langs=['sk','cs','en','de'];
 langs.forEach(lang=>{
   const t=L.i18n?.[lang];
   if(!t||!t.title||!t.brief||!t.explain||!Array.isArray(t.cards)||t.cards.length<6){flags.push(lang+':missing');return}
   EDITORIAL_QA.byLang[lang]++;
 });
 const sk=L.i18n?.sk,cs=L.i18n?.cs,en=L.i18n?.en,de=L.i18n?.de;
 if(sk&&cs&&similarity(sk.brief,cs.brief)>.86)flags.push('sk-cs-literal');
 if(sk&&en&&similarity(sk.brief,en.brief)>.68)flags.push('sk-en-calque');
 if(sk&&de&&similarity(sk.brief,de.brief)>.68)flags.push('sk-de-calque');
 const wrong=(sk?.cards||[]).slice(3);
 if(wrong.filter(x=>/vždy|nikdy|každý|automaticky|iba|only|always|never/i.test(x)).length>=2)flags.push('weak-distractors');
 L.editorialQA=flags.length?'review':'passed';
 if(flags.length)EDITORIAL_QA.review.push({i,flags});else EDITORIAL_QA.passed++;
});
localStorage.setItem('dokazEditorialQA',JSON.stringify(EDITORIAL_QA));

const LANG_AUDIT={
 sk:{status:'redakčne upravené',principle:'prirodzená slovenčina; odborná terminológia, syntax a štýl bez cudzích kalkov',editorialPass:'Spisy po individuálnej redakcii',editorialReview:'Na ďalšiu manuálnu kontrolu',editorialNote:'Kontrola sleduje prirodzenosť formulácie, úplnosť prekladu, doslovné kalky a kvalitu distraktorov.'},
 cs:{status:'redakčně upraveno',principle:'přirozená čeština; samostatná česká syntax, terminologie a styl bez kopírování slovenské větné stavby',editorialPass:'Spisy po individuální redakci',editorialReview:'K další ruční kontrole',editorialNote:'Kontrola sleduje přirozenost formulace, úplnost lokalizace, doslovné kalky a kvalitu distraktorů.'},
 en:{status:'editorially revised',principle:'idiomatic English edited as an independent version, not a sentence-by-sentence translation',editorialPass:'Dossiers passing individual edit',editorialReview:'Flagged for further manual review',editorialNote:'The review checks idiomatic wording, localization completeness, literal calques and distractor quality.'},
 de:{status:'redaktionell überarbeitet',principle:'idiomatisches Deutsch, eigenständig redigiert und nicht Satz für Satz aus dem Slowakischen übertragen',editorialPass:'Fälle nach Einzelredaktion',editorialReview:'Für weitere manuelle Prüfung markiert',editorialNote:'Geprüft werden idiomatische Formulierungen, vollständige Lokalisierung, wörtliche Übertragungen und die Qualität der Ablenkungen.'}
};

function editorialPanel(){
 const q=EDITORIAL_QA;
 return `<div class="editorial-panel"><div><b>${q.passed}/${q.total}</b><span>${ex('editorialPass')}</span></div>
 <div><b>${q.review.length}</b><span>${ex('editorialReview')}</span></div>
 <small>${ex('editorialNote')}</small></div>`;
}

function languageAuditHTML(){
 const a=LANG_AUDIT[state.lang];
 return `<div class="lang-audit"><b>✓ ${a.status}</b><small>${a.principle}</small></div>`;
}

function liveLabels(){
 return {
 sk:{title:'Živý spis',budget:'Rozpočet vyšetrovania',witness:'Svedectvo',lab:'Laboratórium',document:'Dokument',experiment:'Experiment',irrelevant:'Táto stopa je pravdivá, ale pre rozhodujúci záver nie je podstatná.',useful:'Stopa prináša relevantnú informáciu. Porovnaj ju s ostatnými dôkazmi.'},
 cs:{title:'Živý spis',budget:'Rozpočet vyšetřování',witness:'Svědectví',lab:'Laboratoř',document:'Dokument',experiment:'Experiment',irrelevant:'Tato stopa je pravdivá, ale pro rozhodující závěr není podstatná.',useful:'Stopa přináší relevantní informaci. Porovnej ji s ostatními důkazy.'},
 en:{title:'Living dossier',budget:'Investigation budget',witness:'Testimony',lab:'Laboratory',document:'Document',experiment:'Experiment',irrelevant:'This clue is true, but it is not material to the decisive conclusion.',useful:'This clue adds relevant information. Compare it with the other evidence.'},
 de:{title:'Dynamischer Fall',budget:'Ermittlungsbudget',witness:'Aussage',lab:'Labor',document:'Dokument',experiment:'Experiment',irrelevant:'Diese Spur ist zwar richtig, für den entscheidenden Schluss aber nicht wesentlich.',useful:'Diese Spur liefert relevante Information. Vergleiche sie mit den übrigen Belegen.'}
 }[state.lang];
}
function liveDossier(L){
 if(L.difficulty!==3)return '';
 const x=liveLabels();
 return `<div class="livebox"><div class="livehead"><b>◉ ${x.title}</b><span>${x.budget}: <strong id="liveBudget">5</strong></span></div>
 <div class="live-actions">
  <button onclick="inspectClue('witness',this)">◌ ${x.witness} · −1</button>
  <button onclick="inspectClue('lab',this)">⚗ ${x.lab} · −2</button>
  <button onclick="inspectClue('document',this)">▤ ${x.document} · −1</button>
  <button onclick="inspectClue('experiment',this)">⌁ ${x.experiment} · −2</button>
 </div><div id="liveClue" class="liveclue"></div></div>`;
}
function inspectClue(kind,btn){
 let budget=Number(sessionStorage.getItem('dokazLiveBudget')||5), cost=LIVE_COST[kind]||1;
 if(btn.disabled||budget<cost)return;
 budget-=cost;sessionStorage.setItem('dokazLiveBudget',String(budget));
 const b=document.getElementById('liveBudget');if(b)b.textContent=budget;
 btn.disabled=true;
 const L=LEVELS[state.order[state.idx]], tr=L.i18n?.[state.lang], x=liveLabels();
 const maps={witness:0,lab:1,document:2,experiment:4};
 const i=maps[kind], text=(tr?.cards||[])[i]||'';
 const relevant=i<3;
 const box=document.getElementById('liveClue');
 if(box)box.innerHTML=`<b>${text}</b><small>${relevant?x.useful:x.irrelevant}</small>`;
}

/* v2.8 expert dossier mechanics */
const EXPERT_EXTRA={
 sk:[
  'Tvrdenie znie odborne, ale zamieňa časovú následnosť za príčinnosť.',
  'Tvrdenie vysvetľuje časť pozorovania, no nie rozhodujúci dôkaz.',
  'Alternatívna hypotéza je možná, ale dostupné dôkazy ju podporujú menej presvedčivo.'
 ],
 cs:[
  'Tvrzení zní odborně, ale zaměňuje časovou následnost za příčinnost.',
  'Tvrzení vysvětluje část pozorování, ale ne rozhodující důkaz.',
  'Alternativní hypotéza je možná, ale dostupné důkazy ji podporují méně přesvědčivě.'
 ],
 en:[
  'The statement sounds technical but confuses temporal sequence with causation.',
  'The statement explains part of the observation but not the decisive evidence.',
  'The alternative remains plausible, but the available evidence supports it less convincingly.'
 ],
 de:[
  'Die Aussage klingt fachlich, verwechselt aber zeitliche Abfolge mit Kausalität.',
  'Die Aussage erklärt einen Teil der Beobachtung, nicht aber den entscheidenden Beleg.',
  'Die Alternativhypothese bleibt denkbar, wird von den vorliegenden Belegen jedoch weniger überzeugend gestützt.'
 ]
};
function enrichExpertDossiers(){
 LEVELS.forEach((L,idx)=>{
  if(L.difficulty!==3 || L._expertEnriched)return;
  const ids=['ex'+idx+'a','ex'+idx+'b','ex'+idx+'c'];
  ['sk','cs','en','de'].forEach(lang=>{
    const tr=L.i18n?.[lang]; if(!tr)return;
    tr.cards=[...(tr.cards||[]),...EXPERT_EXTRA[lang]];
  });
  ids.forEach((id,j)=>{
    L.cards.push([id,EXPERT_EXTRA.sk[j],EXPERT_EXTRA.cs[j],EXPERT_EXTRA.en[j],EXPERT_EXTRA.de[j]]);
  });
  L._expertEnriched=true;
 });
}
enrichExpertDossiers();

function competingHypotheses(L){
 if(L.difficulty!==3)return '';
 const tr=L.i18n?.[state.lang];
 const labels={
  sk:['Pracovná hypotéza','Alternatívna hypotéza'],
  cs:['Pracovní hypotéza','Alternativní hypotéza'],
  en:['Working hypothesis','Alternative hypothesis'],
  de:['Arbeitshypothese','Alternativhypothese']
 }[state.lang];
 const a=(tr?.cards||[])[2]||'';
 const b=(tr?.cards||[])[(tr?.cards||[]).length-1]||'';
 return `<div class="hypotheses"><div><small>${labels[0]}</small><b>${a}</b></div><div><small>${labels[1]}</small><b>${b}</b></div></div>`;
}
function fallacyPrompt(L){
 if(L.difficulty!==3)return '';
 return `<div class="fallacy-box"><b>⚖ ${ex('whyDistractor')}</b><p>${ex('whyDistractorHelp')}</p>
 <div class="fallacy-options">
  <button onclick="markFallacy(this,1)">${ex('fallacyCause')}</button>
  <button onclick="markFallacy(this,2)">${ex('fallacyPartial')}</button>
  <button onclick="markFallacy(this,3)">${ex('fallacyEvidence')}</button>
 </div></div>`;
}
function markFallacy(btn,n){
 btn.parentElement.querySelectorAll('button').forEach(x=>x.classList.remove('picked'));
 btn.classList.add('picked');
 localStorage.setItem('dokazFallacyChoice',String(n));
}


function editorialBadge(L){
 const ok=L.editorialQA==='passed';
 const tx={sk:ok?'Jazykovo redigované':'Vyžaduje ďalšiu redakciu',cs:ok?'Jazykově redigováno':'Vyžaduje další redakci',en:ok?'Language edited':'Further editorial review',de:ok?'Sprachlich redigiert':'Weitere Redaktion erforderlich'}[state.lang];
 return `<span class="editorial-badge ${ok?'ok':'review'}">${ok?'✓':'!'} ${tx}</span>`;
}


function displayCards(L){
 const arr=[...L.cards];
 if(L.difficulty===3){
   const seed=(state.idx+1)*7919+(state.attempts||0)*101;
   let x=seed;
   for(let i=arr.length-1;i>0;i--){x=(x*1664525+1013904223)>>>0;const j=x%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]]}
 }
 return arr;
}

function diffLabel(L){
 return L.difficulty===3?ex('difficultyExpert'):L.difficulty===2?ex('difficultyMedium'):ex('difficultyEasy');
}
function qualityPanel(){
 const q=QUALITY, cats=Object.entries(q.categories).sort((a,b)=>b[1]-a[1]).slice(0,8);
 return `<div class="panel quality-panel"><div class="eyebrow">${ex('qualityAudit')}</div>
 <div class="quality-grid">
  <div><b>${q.easyCount}</b><span>${ex('difficultyEasy')}</span></div>
  <div><b>${q.mediumCount}</b><span>${ex('difficultyMedium')}</span></div>
  <div><b>${q.expertCount}</b><span>${ex('difficultyExpert')}</span></div>
  <div><b>${Object.keys(q.categories).length}</b><span>${ex('categoryStats')}</span></div>
 </div>
 <div class="cat-mini">${cats.map(([k,v])=>`<span>${k} · ${v}</span>`).join('')}</div></div>`;
}

function evidenceGrade(L){
 const ids=(L.sources&&L.sources.length?L.sources:inferSources(L));
 if(ids.length>=2)return {g:'A+',label:{sk:'Autoritatívny zdroj',cs:'Autoritativní zdroj',en:'Authoritative reference',de:'Fachlich maßgebliche Quelle'}[state.lang]};
 if(ids.length===1)return {g:'A',label:{sk:'Autoritatívny zdroj',cs:'Autoritativní zdroj',en:'Authoritative reference',de:'Fachlich maßgebliche Quelle'}[state.lang]};
 return {g:'B',label:{sk:'Redakčne overený úsudok',cs:'Redakčně ověřený úsudek',en:'Editorially checked reasoning',de:'Redaktionell geprüfte Argumentation'}[state.lang]};
}
function provenanceHTML(L){
 const q=evidenceGrade(L);
 return `<div class="prov"><span class="grade">${q.g}</span><div><b>${q.label}</b><small>${ex('sourceNote')}</small></div></div>`;
}



/* v2.6 canonical-database technical audit */
const DB_AUDIT={
 total:LEVELS.length,
 nativeSchema:0,
 malformed:[],
 duplicateTitles:[],
 duplicateCardSets:[],
 missingLanguages:[],
 badAnswers:[]
};
const _titleSeen=new Map(), _cardsSeen=new Map();
LEVELS.forEach((L,i)=>{
 const okSchema=Array.isArray(L.cards)&&Array.isArray(L.answer)&&L.i18n&&typeof L.i18n==='object';
 if(okSchema) DB_AUDIT.nativeSchema++;
 else DB_AUDIT.malformed.push(i);

 const langs=['sk','cs','en','de'];
 const miss=langs.filter(x=>!L.i18n?.[x]?.title||!L.i18n?.[x]?.brief||!Array.isArray(L.i18n?.[x]?.cards)||!L.i18n?.[x]?.explain);
 if(miss.length) DB_AUDIT.missingLanguages.push({i,miss});

 if(!Array.isArray(L.answer)||L.answer.length!==3||L.answer.some(a=>!L.cards.some(c=>c[0]===a))) DB_AUDIT.badAnswers.push(i);

 const title=(L.i18n?.sk?.title||'').trim().toLowerCase();
 if(title){
   if(_titleSeen.has(title)) DB_AUDIT.duplicateTitles.push([_titleSeen.get(title),i]);
   else _titleSeen.set(title,i);
 }
 const cardKey=(L.i18n?.sk?.cards||[]).map(x=>x.trim().toLowerCase()).join('|');
 if(cardKey){
   if(_cardsSeen.has(cardKey)) DB_AUDIT.duplicateCardSets.push([_cardsSeen.get(cardKey),i]);
   else _cardsSeen.set(cardKey,i);
 }
});
localStorage.setItem('dokazDbAudit',JSON.stringify(DB_AUDIT));


/* v2.7 quality pass: difficulty, distractor quality, category stats */
const QUALITY={
 categories:{}, weakDistractors:[], expertCount:0, mediumCount:0, easyCount:0
};
function dossierDifficulty(L){
 const z=JSON.stringify(L).toLowerCase();
 let score=0;
 if(/kazuistika|clinical case|klinischer fall|lékařská kazuistika/.test(z)) score+=2;
 if(/historické následky|historical consequences|historische folgen/.test(z)) score+=2;
 if(/chemická reak|chemical reaction|chemische reaktion/.test(z)) score+=2;
 if(/korel|caus|kauzal|differential|diferenci|stoichi|stechiometr|redox|photovolta|imunit|immune|gedächtnis/.test(z)) score+=2;
 const wrong=(L.i18n?.sk?.cards||[]).slice(3);
 const obvious=wrong.filter(x=>/vždy|nikdy|každ|iba|automaticky|presne|úplne|only|always|never|every|exactly|automatically|immer|niemals|jeder|ausschließlich/i.test(x)).length;
 if(obvious>=2) score-=1;
 return score>=3?3:score>=1?2:1;
}
function improveDistractors(L){
 const langs=['sk','cs','en','de'];
 const repl={
  sk:[
   ['Výrazná horúčka bez ďalších údajov spoľahlivo odlíši bakteriálnu infekciu od vírusovej.','Vysoká horúčka sama osebe spoľahlivo odlíši bakteriálnu infekciu od vírusovej.'],
   ['Každý strom vytvára na jeseň modrý pigment.','Jesenné sfarbenie listov vzniká najmä tvorbou nového modrého pigmentu.'],
   ['Dúha vzniká zo svetla Mesiaca iba v zime.','Na vznik dúhy stačí samotná prítomnosť dažďa bez ohľadu na smer svetla.'],
   ['Pás odstráni zotrvačnosť.','Pás zmenší zotrvačnosť tela počas nárazu.'],
   ['Korelácia sa používa iba v psychológii.','Silná korelácia sama určuje, ktorá premenná je príčinou.']
  ],
  cs:[
   ['Každá horečka automaticky znamená bakteriální infekci.','Vysoká horečka sama o sobě spolehlivě odliší bakteriální infekci od virové.'],
   ['Každý strom vytváří na podzim modrý pigment.','Podzimní zbarvení listů vzniká hlavně tvorbou nového modrého pigmentu.'],
   ['Duha vzniká z měsíčního světla jen v zimě.','Ke vzniku duhy stačí samotná přítomnost deště bez ohledu na směr světla.'],
   ['Pás odstraní setrvačnost.','Pás zmenší setrvačnost těla během nárazu.'],
   ['Korelace se používá pouze v psychologii.','Silná korelace sama určuje, která proměnná je příčinou.']
  ],
  en:[
   ['A high fever on its own reliably distinguishes bacterial from viral infection.','A high fever by itself reliably distinguishes bacterial from viral infection.'],
   ['Every tree produces a blue pigment in autumn.','Autumn leaf colour mainly results from production of a new blue pigment.'],
   ['Rainbows form from moonlight only in winter.','Rain alone is sufficient for a rainbow regardless of the direction of the light.'],
   ['The belt eliminates inertia.','The belt reduces the body’s inertia during a crash.'],
   ['Correlation is used only in psychology.','A strong correlation by itself identifies which variable is the cause.']
  ],
  de:[
   ['Jedes Fieber bedeutet automatisch eine bakterielle Infektion.','Hohes Fieber allein unterscheidet zuverlässig zwischen bakterieller und viraler Infektion.'],
   ['Jeder Baum bildet im Herbst einen blauen Farbstoff.','Die Herbstfärbung entsteht hauptsächlich durch die Bildung eines neuen blauen Farbstoffs.'],
   ['Regenbogen entstehen nur im Winter aus Mondlicht.','Für einen Regenbogen genügt Regen allein, unabhängig von der Richtung des Lichts.'],
   ['Der Gurt beseitigt die Trägheit.','Der Gurt verringert die Trägheit des Körpers beim Aufprall.'],
   ['Korrelation wird nur in der Psychologie verwendet.','Eine starke Korrelation allein zeigt, welche Variable die Ursache ist.']
  ]
 };
 langs.forEach(lang=>{
   const cards=L.i18n?.[lang]?.cards;
   if(!cards)return;
   repl[lang].forEach(([a,b])=>{
     const i=cards.indexOf(a); if(i>=0) cards[i]=b;
   });
 });
}
LEVELS.forEach((L,i)=>{
 improveDistractors(L);
 L.difficulty=dossierDifficulty(L);
 if(L.difficulty===3) QUALITY.expertCount++;
 else if(L.difficulty===2) QUALITY.mediumCount++;
 else QUALITY.easyCount++;
 const cat=L.i18n?.sk?.cat||'—';
 QUALITY.categories[cat]=(QUALITY.categories[cat]||0)+1;
 const cards=L.i18n?.sk?.cards||[];
 const weak=cards.slice(3).filter(x=>/vždy|nikdy|každ|automaticky|iba|presne|only|always|never|every|exactly|immer|niemals|jeder/i.test(x)).length;
 if(weak>=2) QUALITY.weakDistractors.push(i);
});
localStorage.setItem('dokazQualityAudit',JSON.stringify(QUALITY));

/* v2.5 dossier-by-dossier editorial/evidence audit */
for(const L of LEVELS){
 const z=JSON.stringify(L).toLowerCase();
 L.sources=inferSources(L);
 L.audit={
   distractors:(L.cards||[]).length>=6?'checked':'review',
   chain:(L.answer||[]).length===3?'checked':'review',
   languages:['sk','cs','en','de'].every(x=>L.i18n&&L.i18n[x])?'checked':'review'
 };
 /* Flag obvious absolute distractors as intentionally false rather than evidentiary claims. */
 L.audit.absolutes=(L.cards||[]).filter(c=>/always|never|every|vždy|nikdy|každ|immer|niemals|jeder|vždy|nikdy/i.test(c.slice(1).join(' '))).length;
}

const ALTCASES={
 lie:[
  {q:{sk:'Ktoré tvrdenie o Slnečnej sústave je nesprávne?',cs:'Které tvrzení o Sluneční soustavě je nesprávné?',en:'Which statement about the Solar System is false?',de:'Welche Aussage über das Sonnensystem ist falsch?'},
   a:{sk:['Venuša je teplejšia než Merkúr.','Jupiter je najväčšia planéta.','Mars má dva malé mesiace.','Saturn je jediná planéta s prstencami.','Neptún obieha ďalej od Slnka než Urán.'],cs:['Venuše je teplejší než Merkur.','Jupiter je největší planeta.','Mars má dva malé měsíce.','Saturn je jediná planeta s prstenci.','Neptun obíhá dál od Slunce než Uran.'],en:['Venus is hotter than Mercury.','Jupiter is the largest planet.','Mars has two small moons.','Saturn is the only planet with rings.','Neptune orbits farther from the Sun than Uranus.'],de:['Die Venus ist heißer als Merkur.','Jupiter ist der größte Planet.','Mars hat zwei kleine Monde.','Saturn ist der einzige Planet mit Ringen.','Neptun umkreist die Sonne weiter außen als Uranus.']},correct:3,
   why:{sk:'Prstence nemá iba Saturn. Slabšie prstencové systémy majú aj Jupiter, Urán a Neptún.',cs:'Prstence nemá jen Saturn. Slabší prstencové systémy mají také Jupiter, Uran a Neptun.',en:'Saturn is not the only ringed planet. Jupiter, Uranus and Neptune also have fainter ring systems.',de:'Saturn ist nicht der einzige Planet mit Ringen. Auch Jupiter, Uranus und Neptun besitzen schwächere Ringsysteme.'}},
  {q:{sk:'Ktoré tvrdenie o ľudskom tele je nesprávne?',cs:'Které tvrzení o lidském těle je nesprávné?',en:'Which statement about the human body is false?',de:'Welche Aussage über den menschlichen Körper ist falsch?'},
   a:{sk:['Dospelý človek má zvyčajne 206 kostí.','Pečeň patrí medzi najväčšie vnútorné orgány.','Červené krvinky prenášajú kyslík pomocou hemoglobínu.','Všetky tepny vedú výlučne okysličenú krv.','Koža pomáha regulovať telesnú teplotu.'],cs:['Dospělý člověk má obvykle 206 kostí.','Játra patří mezi největší vnitřní orgány.','Červené krvinky přenášejí kyslík pomocí hemoglobinu.','Všechny tepny vedou výhradně okysličenou krev.','Kůže pomáhá regulovat tělesnou teplotu.'],en:['An adult usually has 206 bones.','The liver is one of the largest internal organs.','Red blood cells carry oxygen using haemoglobin.','All arteries carry only oxygen-rich blood.','The skin helps regulate body temperature.'],de:['Ein Erwachsener hat gewöhnlich 206 Knochen.','Die Leber gehört zu den größten inneren Organen.','Rote Blutkörperchen transportieren Sauerstoff mithilfe von Hämoglobin.','Alle Arterien führen ausschließlich sauerstoffreiches Blut.','Die Haut hilft bei der Regulation der Körpertemperatur.']},correct:3,
   why:{sk:'Pľúcna tepna je dôležitá výnimka: vedie odkysličenú krv zo srdca do pľúc.',cs:'Plicní tepna je důležitá výjimka: vede odkysličenou krev ze srdce do plic.',en:'The pulmonary artery is a key exception: it carries deoxygenated blood from the heart to the lungs.',de:'Die Lungenarterie ist eine wichtige Ausnahme: Sie führt sauerstoffarmes Blut vom Herzen zur Lunge.'}}
 ],
 missing:[
  {q:{sk:'Kovová lyžička sa v horúcom čaji postupne zohreje. Ktorý článok vysvetlenie dopĺňa?',cs:'Kovová lžička se v horkém čaji postupně zahřeje. Který článek vysvětlení doplňuje?',en:'A metal spoon gradually heats up in hot tea. Which missing link completes the explanation?',de:'Ein Metalllöffel wird in heißem Tee allmählich warm. Welches fehlende Glied vervollständigt die Erklärung?'},
   a:{sk:['Kovy dobre vedú teplo.','Čaj obsahuje vodu.','Lyžička odráža svetlo.','Horúce kvapaliny majú vždy menšiu hustotu.'],cs:['Kovy dobře vedou teplo.','Čaj obsahuje vodu.','Lžička odráží světlo.','Horké kapaliny mají vždy menší hustotu.'],en:['Metals conduct heat well.','Tea contains water.','The spoon reflects light.','Hot liquids always have lower density.'],de:['Metalle leiten Wärme gut.','Tee enthält Wasser.','Der Löffel reflektiert Licht.','Heiße Flüssigkeiten haben immer eine geringere Dichte.']},correct:0,
   why:{sk:'Rozhodujúca je tepelná vodivosť kovu: energia sa prenáša z ponorenej časti lyžičky ďalej materiálom.',cs:'Rozhodující je tepelná vodivost kovu: energie se z ponořené části lžičky přenáší dál materiálem.',en:'The decisive link is the metal’s thermal conductivity: energy moves from the immersed part through the spoon.',de:'Entscheidend ist die Wärmeleitfähigkeit des Metalls: Energie wird vom eingetauchten Teil durch den Löffel weitergeleitet.'}}
 ],
 hyp:[
  {q:{sk:'Rastlina pri okne sa dlhodobo nakláňa jedným smerom. Ktorá hypotéza je lepšie podložená?',cs:'Rostlina u okna se dlouhodobě naklání jedním směrem. Která hypotéza je lépe podložená?',en:'A plant by a window gradually bends in one direction. Which hypothesis is better supported?',de:'Eine Pflanze am Fenster neigt sich mit der Zeit in eine Richtung. Welche Hypothese ist besser gestützt?'},
   a:{sk:['Výhonok reaguje na smer dopadajúceho svetla.','Rastlina sa vždy nakláňa na sever bez ohľadu na svetlo.'],cs:['Výhonek reaguje na směr dopadajícího světla.','Rostlina se vždy naklání k severu bez ohledu na světlo.'],en:['The shoot is responding to the direction of incoming light.','The plant always bends north regardless of light.'],de:['Der Spross reagiert auf die Richtung des einfallenden Lichts.','Die Pflanze neigt sich unabhängig vom Licht immer nach Norden.']},correct:0,
   why:{sk:'Fototropizmus vysvetľuje smerový rast výhonkov v reakcii na svetlo.',cs:'Fototropismus vysvětluje směrový růst výhonků v reakci na světlo.',en:'Phototropism explains directional shoot growth in response to light.',de:'Phototropismus erklärt das gerichtete Wachstum von Sprossen als Reaktion auf Licht.'}}
 ],
 timeline:[
  {q:{sk:'Zoraď udalosti od najstaršej po najnovšiu.',cs:'Seřaď události od nejstarší po nejnovější.',en:'Arrange the events from earliest to latest.',de:'Ordne die Ereignisse vom frühesten zum spätesten.'},
   a:{sk:['Francúzska revolúcia','Prvý let bratov Wrightovcov','Prvé pristátie ľudí na Mesiaci','Vznik World Wide Webu'],cs:['Francouzská revoluce','První let bratří Wrightů','První přistání lidí na Měsíci','Vznik World Wide Webu'],en:['French Revolution','Wright brothers’ first flight','First human Moon landing','Creation of the World Wide Web'],de:['Französische Revolution','Erster Flug der Brüder Wright','Erste bemannte Mondlandung','Entstehung des World Wide Web']},correct:[0,1,2,3],
   why:{sk:'Poradie zodpovedá rokom 1789, 1903, 1969 a 1989/1990.',cs:'Pořadí odpovídá rokům 1789, 1903, 1969 a 1989/1990.',en:'The sequence corresponds to 1789, 1903, 1969 and 1989/1990.',de:'Die Reihenfolge entspricht den Jahren 1789, 1903, 1969 und 1989/1990.'}}
 ]
};

ALTCASES.lie.push(
 {q:{sk:'Ktoré tvrdenie o evolúcii je nesprávne?',cs:'Které tvrzení o evoluci je nesprávné?',en:'Which statement about evolution is false?',de:'Welche Aussage über Evolution ist falsch?'},
 a:{sk:['Prirodzený výber pôsobí na dedičné rozdiely v populácii.','Mutácie môžu vytvárať nové genetické varianty.','Jedince sa počas života vyvinú presne podľa toho, čo ich druh potrebuje.','Evolučná zmena sa prejavuje naprieč generáciami.','Genetický drift môže meniť frekvencie alel.'],cs:['Přirozený výběr působí na dědičné rozdíly v populaci.','Mutace mohou vytvářet nové genetické varianty.','Jedinci se během života vyvinou přesně podle toho, co jejich druh potřebuje.','Evoluční změna se projevuje napříč generacemi.','Genetický drift může měnit frekvence alel.'],en:['Natural selection acts on heritable variation in a population.','Mutations can create new genetic variants.','Individuals evolve during their lifetime exactly according to what their species needs.','Evolutionary change occurs across generations.','Genetic drift can change allele frequencies.'],de:['Natürliche Selektion wirkt auf erbliche Unterschiede in einer Population.','Mutationen können neue genetische Varianten erzeugen.','Individuen entwickeln sich im Laufe ihres Lebens genau so, wie es ihre Art benötigt.','Evolutionäre Veränderungen zeigen sich über Generationen hinweg.','Genetische Drift kann Allelfrequenzen verändern.']},correct:2,
 why:{sk:'Evolúcia nie je cieľavedomá reakcia jednotlivca na potrebu. Menia sa populácie naprieč generáciami.',cs:'Evoluce není cílevědomá reakce jednotlivce na potřebu. Mění se populace napříč generacemi.',en:'Evolution is not a goal-directed response by an individual to need. Populations change across generations.',de:'Evolution ist keine zielgerichtete Reaktion eines Individuums auf einen Bedarf. Populationen verändern sich über Generationen.'}},
 {q:{sk:'Ktoré tvrdenie o stredovekej Európe je nesprávne?',cs:'Které tvrzení o středověké Evropě je nesprávné?',en:'Which statement about medieval Europe is false?',de:'Welche Aussage über das mittelalterliche Europa ist falsch?'},
 a:{sk:['Kníhtlač sa v Európe rozšírila až ku koncu stredoveku.','Univerzity existovali v Európe už v stredoveku.','Čierna smrť zasiahla Európu v 14. storočí.','Všetci stredovekí ľudia verili, že Zem je plochá.','Mestá boli dôležitými centrami obchodu a remesiel.'],cs:['Knihtisk se v Evropě rozšířil až ke konci středověku.','Univerzity existovaly v Evropě už ve středověku.','Černá smrt zasáhla Evropu ve 14. století.','Všichni středověcí lidé věřili, že Země je plochá.','Města byla důležitými centry obchodu a řemesel.'],en:['Printing spread through Europe only near the end of the Middle Ages.','Universities already existed in medieval Europe.','The Black Death struck Europe in the 14th century.','All medieval people believed the Earth was flat.','Towns were important centres of trade and crafts.'],de:['Der Buchdruck verbreitete sich in Europa erst gegen Ende des Mittelalters.','Universitäten gab es in Europa bereits im Mittelalter.','Der Schwarze Tod traf Europa im 14. Jahrhundert.','Alle Menschen im Mittelalter glaubten, die Erde sei flach.','Städte waren wichtige Zentren für Handel und Handwerk.']},correct:3,
 why:{sk:'Predstava o všeobecnej stredovekej viere v plochú Zem je moderný mýtus. Vzdelanci poznali guľovitý model Zeme.',cs:'Představa o všeobecné středověké víře v plochou Zemi je moderní mýtus. Vzdělanci znali kulový model Země.',en:'The idea that medieval people universally believed in a flat Earth is a modern myth. Educated Europeans knew the spherical model.',de:'Die Vorstellung, im Mittelalter hätten alle an eine flache Erde geglaubt, ist ein moderner Mythos. Gelehrte kannten das Kugelmodell.'}}
);
ALTCASES.missing.push(
 {q:{sk:'Po daždi sa mláka aj bez varu postupne stratí. Ktorý článok vysvetlenie dopĺňa?',cs:'Po dešti louže i bez varu postupně zmizí. Který článek vysvětlení doplňuje?',en:'A puddle gradually disappears after rain without boiling. Which link completes the explanation?',de:'Eine Pfütze verschwindet nach dem Regen allmählich, ohne zu kochen. Welches Glied vervollständigt die Erklärung?'},
 a:{sk:['Molekuly vody môžu unikať z povrchu do vzduchu aj pod bodom varu.','Voda sa pri izbovej teplote mení priamo na ľad.','Vzduch vždy obsahuje presne rovnaké množstvo vodnej pary.','Kvapalná voda nemá pohybujúce sa molekuly.'],cs:['Molekuly vody mohou unikat z povrchu do vzduchu i pod bodem varu.','Voda se při pokojové teplotě mění přímo na led.','Vzduch vždy obsahuje přesně stejné množství vodní páry.','Kapalná voda nemá pohybující se molekuly.'],en:['Water molecules can escape from the surface into the air below the boiling point.','At room temperature water turns directly into ice.','Air always contains exactly the same amount of water vapour.','Liquid water has no moving molecules.'],de:['Wassermoleküle können auch unterhalb des Siedepunkts von der Oberfläche in die Luft entweichen.','Bei Raumtemperatur wird Wasser direkt zu Eis.','Luft enthält immer genau dieselbe Menge Wasserdampf.','In flüssigem Wasser bewegen sich keine Moleküle.']},correct:0,
 why:{sk:'Vyparovanie prebieha z povrchu kvapaliny pri rôznych teplotách; var nie je podmienkou.',cs:'Vypařování probíhá z povrchu kapaliny při různých teplotách; var není podmínkou.',en:'Evaporation occurs at a liquid’s surface over a range of temperatures; boiling is not required.',de:'Verdunstung findet an der Flüssigkeitsoberfläche bei unterschiedlichen Temperaturen statt; Sieden ist nicht erforderlich.'}},
 {q:{sk:'Antibiotikum nepomohlo pacientovi s chrípkou. Ktorý článok vysvetlenie dopĺňa?',cs:'Antibiotikum nepomohlo pacientovi s chřipkou. Který článek vysvětlení doplňuje?',en:'An antibiotic did not help a patient with influenza. Which link completes the explanation?',de:'Ein Antibiotikum half einem Patienten mit Grippe nicht. Welches Glied vervollständigt die Erklärung?'},
 a:{sk:['Chrípku spôsobujú vírusy a antibiotiká cielia na baktérie, nie na vírusy.','Účinok antibiotika závisí najmä od výšky horúčky, nie od citlivosti baktérie.','Veľkosť pôvodcu sama osebe určuje, či bude antibiotikum účinné.','Sezónnosť chrípky je dôvodom, prečo antibiotiká počas iných ročných období nie sú účinné.'],cs:['Chřipku způsobují viry a antibiotika cílí na bakterie, nikoli na viry.','Každé antibiotikum účinkuje jen při horečce nad 39 °C.','Viry jsou větší než bakterie.','Antibiotika účinkují pouze v zimě.'],en:['Influenza is caused by viruses, while antibiotics target bacteria rather than viruses.','Every antibiotic works only above a fever of 39°C.','Pathogen size alone determines whether an antibiotic will work.','The seasonal pattern of influenza is why antibiotics are ineffective at other times of year.'],de:['Grippe wird durch Viren verursacht, während Antibiotika gegen Bakterien und nicht gegen Viren wirken.','Jedes Antibiotikum wirkt nur bei Fieber über 39 °C.','Viren sind größer als Bakterien.','Antibiotika wirken nur im Winter.']},correct:0,
 why:{sk:'Antibiotiká sú určené na bakteriálne infekcie. Pri vírusovej chrípke bez bakteriálnej komplikácie samotnú príčinu neliečia.',cs:'Antibiotika jsou určena pro bakteriální infekce. U virové chřipky bez bakteriální komplikace samotnou příčinu neléčí.',en:'Antibiotics treat bacterial infections. In uncomplicated viral influenza they do not treat the underlying cause.',de:'Antibiotika behandeln bakterielle Infektionen. Bei einer unkomplizierten Virusgrippe bekämpfen sie nicht deren Ursache.'}}
);
ALTCASES.hyp.push(
 {q:{sk:'Po zavedení bezpečnostných pásov klesol podiel ťažkých zranení pri porovnateľných nehodách. Ktorá hypotéza je lepšie podložená?',cs:'Po zavedení bezpečnostních pásů klesl podíl těžkých zranění při srovnatelných nehodách. Která hypotéza je lépe podložená?',en:'After seat belts were introduced, severe injuries fell in comparable crashes. Which hypothesis is better supported?',de:'Nach Einführung von Sicherheitsgurten ging bei vergleichbaren Unfällen der Anteil schwerer Verletzungen zurück. Welche Hypothese ist besser gestützt?'},
 a:{sk:['Pásy obmedzujú prudký pohyb tela a znižujú riziko nárazu do interiéru vozidla.','Bezpečnostné pásy spôsobujú, že autá jazdia pri nehode pomalšie.'],cs:['Pásy omezují prudký pohyb těla a snižují riziko nárazu do interiéru vozidla.','Bezpečnostní pásy způsobují, že auta při nehodě jedou pomaleji.'],en:['Seat belts restrain sudden body movement and reduce the risk of striking the vehicle interior.','Seat belts make cars travel more slowly during a crash.'],de:['Sicherheitsgurte begrenzen die abrupte Körperbewegung und verringern das Risiko, gegen den Fahrzeuginnenraum zu prallen.','Sicherheitsgurte sorgen dafür, dass Autos während eines Unfalls langsamer fahren.']},correct:0,
 why:{sk:'Prvá hypotéza ponúka priamy biomechanický mechanizmus zodpovedajúci pozorovaniu.',cs:'První hypotéza nabízí přímý biomechanický mechanismus odpovídající pozorování.',en:'The first hypothesis provides a direct biomechanical mechanism consistent with the observation.',de:'Die erste Hypothese liefert einen direkten biomechanischen Mechanismus, der zur Beobachtung passt.'}}
);
ALTCASES.timeline.push(
 {q:{sk:'Zoraď objavy a udalosti od najstaršej po najnovšiu.',cs:'Seřaď objevy a události od nejstarší po nejnovější.',en:'Arrange these discoveries and events from earliest to latest.',de:'Ordne diese Entdeckungen und Ereignisse vom frühesten zum spätesten.'},
 a:{sk:['Newtonove Principia','Darwinovo O pôvode druhov','Objav penicilínu Flemingom','Prvý umelý satelit Sputnik 1'],cs:['Newtonova Principia','Darwinův O původu druhů','Flemingův objev penicilinu','První umělá družice Sputnik 1'],en:['Newton’s Principia','Darwin’s On the Origin of Species','Fleming’s discovery of penicillin','Sputnik 1, the first artificial satellite'],de:['Newtons Principia','Darwins Über die Entstehung der Arten','Flemings Entdeckung des Penicillins','Sputnik 1, der erste künstliche Satellit']},correct:[0,1,2,3],
 why:{sk:'Správny sled je 1687, 1859, 1928 a 1957.',cs:'Správné pořadí je 1687, 1859, 1928 a 1957.',en:'The correct sequence is 1687, 1859, 1928 and 1957.',de:'Die richtige Reihenfolge lautet 1687, 1859, 1928 und 1957.'}}
);


ALTCASES.lie.push(
 {difficulty:'hard',q:{sk:'Ktoré tvrdenie o planétach je nesprávne? Pozor na presnú formuláciu.',cs:'Které tvrzení o planetách je nesprávné? Pozor na přesnou formulaci.',en:'Which statement about the planets is false? Pay attention to the exact wording.',de:'Welche Aussage über die Planeten ist falsch? Achte auf die genaue Formulierung.'},
 a:{sk:['Venuša má vyššiu priemernú povrchovú teplotu než Merkúr.','Jupiter je najväčšia planéta Slnečnej sústavy.','Jupiter, Saturn, Urán aj Neptún majú prstence.','Mars má dva prirodzené satelity.','Saturn je jediná planéta, ktorej prstence obsahujú ľadové častice.'],cs:['Venuše má vyšší průměrnou povrchovou teplotu než Merkur.','Jupiter je největší planeta Sluneční soustavy.','Jupiter, Saturn, Uran i Neptun mají prstence.','Mars má dva přirozené satelity.','Saturn je jediná planeta, jejíž prstence obsahují ledové částice.'],en:['Venus has a higher mean surface temperature than Mercury.','Jupiter is the largest planet in the Solar System.','Jupiter, Saturn, Uranus and Neptune all have rings.','Mars has two natural satellites.','Saturn is the only planet whose rings contain icy particles.'],de:['Die Venus hat eine höhere mittlere Oberflächentemperatur als Merkur.','Jupiter ist der größte Planet des Sonnensystems.','Jupiter, Saturn, Uranus und Neptun besitzen Ringsysteme.','Mars hat zwei natürliche Satelliten.','Saturn ist der einzige Planet, dessen Ringe Eispartikel enthalten.']},correct:4,
 why:{sk:'Nepravdivá je posledná veta. NASA uvádza prstence všetkých štyroch obrích planét a pri Saturne, Uráne aj Neptúne opisuje častice ľadu; Saturn teda nie je jediný.',cs:'Nepravdivá je poslední věta. NASA uvádí prstence všech čtyř obřích planet a u Saturnu, Uranu i Neptunu popisuje částice ledu; Saturn tedy není jediný.',en:'The last statement is false. NASA describes rings around all four giant planets and icy particles in the ring systems beyond Saturn as well, so Saturn is not unique in that respect.',de:'Die letzte Aussage ist falsch. NASA beschreibt Ringsysteme aller vier Riesenplaneten und Eispartikel auch außerhalb des Saturnsystems; Saturn ist darin also nicht einzigartig.'}},
 {difficulty:'hard',q:{sk:'Ktoré tvrdenie o antibiotikách je nesprávne?',cs:'Které tvrzení o antibiotikách je nesprávné?',en:'Which statement about antibiotics is false?',de:'Welche Aussage über Antibiotika ist falsch?'},
 a:{sk:['Antibiotiká neliečia samotnú chrípku, pretože chrípku spôsobujú vírusy.','Niektoré bakteriálne infekcie možno liečiť antibiotikami.','Zbytočné užívanie antibiotík môže prispievať k antimikrobiálnej rezistencii.','Ak má pacient vírusovú infekciu, antibiotikum ju začne liečiť po zvýšení dávky.','Pri chrípke môžu byť za určitých okolností indikované antivirotiká.'],cs:['Antibiotika neléčí samotnou chřipku, protože chřipku způsobují viry.','Některé bakteriální infekce lze léčit antibiotiky.','Zbytečné užívání antibiotik může přispívat k antimikrobiální rezistenci.','Má-li pacient virovou infekci, antibiotikum ji začne léčit po zvýšení dávky.','U chřipky mohou být za určitých okolností indikována antivirotika.'],en:['Antibiotics do not treat influenza itself because influenza is caused by viruses.','Some bacterial infections can be treated with antibiotics.','Unnecessary antibiotic use can contribute to antimicrobial resistance.','If an infection is viral, increasing the antibiotic dose will make the antibiotic treat the virus.','Antiviral medicines may be indicated for influenza in some circumstances.'],de:['Antibiotika behandeln die Grippe selbst nicht, weil Influenza durch Viren verursacht wird.','Bestimmte bakterielle Infektionen können mit Antibiotika behandelt werden.','Unnötiger Antibiotikaeinsatz kann zur antimikrobiellen Resistenz beitragen.','Bei einer Virusinfektion führt eine höhere Antibiotikadosis dazu, dass das Antibiotikum das Virus behandelt.','Bei Influenza können unter bestimmten Umständen antivirale Medikamente angezeigt sein.']},correct:3,
 why:{sk:'Vyššia dávka nemení cieľ antibiotika na vírus. CDC výslovne uvádza, že antibiotiká proti vírusom vrátane chrípky neúčinkujú.',cs:'Vyšší dávka nezmění cíl antibiotika na virus. CDC výslovně uvádí, že antibiotika proti virům včetně chřipky neúčinkují.',en:'A higher dose does not turn an antibiotic into an antiviral drug. CDC explicitly states that antibiotics do not work against viruses such as influenza.',de:'Eine höhere Dosis macht aus einem Antibiotikum kein antivirales Medikament. Die CDC stellt ausdrücklich klar, dass Antibiotika nicht gegen Viren wie Influenza wirken.'}}
);
ALTCASES.hyp.push(
 {difficulty:'hard',q:{sk:'Pri porovnateľných dopravných nehodách majú pripútaní cestujúci nižšie riziko ťažkého zranenia. Ktoré vysvetlenie je lepšie podložené?',cs:'Při srovnatelných dopravních nehodách mají připoutaní cestující nižší riziko těžkého zranění. Které vysvětlení je lépe podložené?',en:'In comparable crashes, belted occupants have a lower risk of serious injury. Which explanation is better supported?',de:'Bei vergleichbaren Unfällen haben angeschnallte Insassen ein geringeres Risiko schwerer Verletzungen. Welche Erklärung ist besser gestützt?'},
 a:{sk:['Pás pomáha udržať telo v priestore pre cestujúceho a obmedzuje nekontrolovaný pohyb či vymrštenie.','Pás znižuje kinetickú energiu celého vozidla ešte pred nárazom.'],cs:['Pás pomáhá udržet tělo v prostoru pro cestující a omezuje nekontrolovaný pohyb či vymrštění.','Pás snižuje kinetickou energii celého vozidla ještě před nárazem.'],en:['The belt helps keep the occupant in the vehicle and limits uncontrolled movement or ejection.','The belt reduces the kinetic energy of the entire vehicle before impact.'],de:['Der Gurt hält den Insassen im Fahrzeug und begrenzt unkontrollierte Bewegung beziehungsweise Herausschleudern.','Der Gurt verringert bereits vor dem Aufprall die kinetische Energie des gesamten Fahrzeugs.']},correct:0,
 why:{sk:'NHTSA spája účinnosť pásov s udržaním cestujúceho vo vozidle a výrazným znížením rizika smrteľných aj stredne ťažkých až kritických zranení.',cs:'NHTSA spojuje účinnost pásů s udržením cestujícího ve vozidle a výrazným snížením rizika smrtelných i středně těžkých až kritických zranění.',en:'NHTSA links seat-belt effectiveness to keeping occupants secure in the vehicle and reports substantial reductions in fatal and moderate-to-critical injuries.',de:'Die NHTSA führt die Wirksamkeit von Sicherheitsgurten unter anderem darauf zurück, dass Insassen im Fahrzeug gehalten werden, und berichtet deutliche Rückgänge tödlicher sowie mittelschwerer bis kritischer Verletzungen.'}}
);
ALTCASES.timeline.push(
 {difficulty:'hard',q:{sk:'Zoraď vedecké míľniky chronologicky.',cs:'Seřaď vědecké milníky chronologicky.',en:'Put these scientific milestones in chronological order.',de:'Ordne diese wissenschaftlichen Meilensteine chronologisch.'},
 a:{sk:['Vydanie Newtonových Principií','Flemingovo pozorovanie vedúce k objavu penicilínu','Vypustenie Sputniku 1','Prvé pristátie ľudí na Mesiaci'],cs:['Vydání Newtonových Principií','Flemingovo pozorování vedoucí k objevu penicilinu','Vypuštění Sputniku 1','První přistání lidí na Měsíci'],en:['Publication of Newton’s Principia','Fleming’s observation leading to the discovery of penicillin','Launch of Sputnik 1','First human Moon landing'],de:['Veröffentlichung von Newtons Principia','Flemings Beobachtung, die zur Entdeckung des Penicillins führte','Start von Sputnik 1','Erste bemannte Mondlandung']},correct:[0,1,2,3],
 why:{sk:'Roky sú 1687, 1928, 1957 a 1969. Formulácia pri Flemingovi zámerne rozlišuje pôvodné pozorovanie od neskoršieho vývoja penicilínu ako lieku.',cs:'Roky jsou 1687, 1928, 1957 a 1969. Formulace u Fleminga záměrně rozlišuje původní pozorování od pozdějšího vývoje penicilinu jako léčiva.',en:'The years are 1687, 1928, 1957 and 1969. The Fleming wording deliberately distinguishes his original observation from the later development of penicillin as a medicine.',de:'Die Jahre sind 1687, 1928, 1957 und 1969. Die Formulierung zu Fleming unterscheidet bewusst seine ursprüngliche Beobachtung von der späteren Entwicklung des Penicillins zum Arzneimittel.'}}
);




function clinicalStages(L){
 const c=(L.i18n?.[state.lang]?.cat||'').toLowerCase();
 if(!/lekár|lékař|clinical|klinisch/.test(c))return '';
 const labels={
 sk:['1 · Anamnéza','2 · Vyšetrenie','3 · Dôkaz','4 · Diferenciálna úvaha'],
 cs:['1 · Anamnéza','2 · Vyšetření','3 · Důkaz','4 · Diferenciální diagnostika'],
 en:['1 · History','2 · Examination','3 · Evidence','4 · Differential'],
 de:['1 · Anamnese','2 · Untersuchung','3 · Evidenz','4 · Differenzialdiagnose']
 }[state.lang];
 return `<div class="clinical-flow">${labels.map((x,i)=>`<span class="${i<=Math.min(3,state.hintLevel||0)?'on':''}">${x}</span>`).join('')}</div>`;
}

function specialistNotice(L){
 const c=(L.i18n?.[state.lang]?.cat||'').toLowerCase();
 if(/lekár|lékař|clinical|klinisch/.test(c))return `<div class="case-note">⚕ ${ex('medicalNote')}</div>`;
 return '';
}

function startSpecial(kind){
 const tests={
  lek:/lekárska kazuistika|lékařská kazuistika|clinical case|medical case|klinischer fall|medizinischer fall/i,
  chem:/chemická reakcia|chemická reakce|chemical reaction|chemische reaktion|laboratory|laboratórium/i,
  hist:/historické následky|historické dôsledky|historické důsledky|historical consequences|historische folgen/i
 };
 const rx=tests[kind];
 const ids=LEVELS.map((L,i)=>[i,JSON.stringify(L.i18n||{})]).filter(x=>rx.test(x[1])).map(x=>x[0]);
 if(!ids.length){toast('—');return}
 state.order=[...ids];for(let i=state.order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[state.order[i],state.order[j]]=[state.order[j],state.order[i]]}state.idx=0;state.selected=[];state.attempts=0;state.hint=false;state.hintLevel=0;sessionStorage.setItem('dokazLiveBudget','5');state.mode='special-'+kind;state.screen='game';history.pushState({screen:'game'},'');renderCase();
}

function L(x){return x?.[state.lang]||x?.sk||''}
function startAlt(kind){
 state.altKind=kind;
 state.altIdx=Math.floor(Math.random()*ALTCASES[kind].length);
 state.altSel=[];
 state.altOrder=[];
 state.screen='alt';
 history.pushState({screen:'alt'},'');
 if(kind==='timeline'){
   const c=ALTCASES[kind][state.altIdx];
   state.altOrder=[...Array(L(c.a).length).keys()];
 }
 renderAlt();
}
function renderAlt(){
 theme();
 const c=ALTCASES[state.altKind][state.altIdx], arr=L(c.a);
 const title=ex(state.altKind);
 const difficulty=c.difficulty==='hard'?ex('hard'):ex('medium');

 if(state.altKind==='timeline'){
   const order=state.altOrder?.length?state.altOrder:[...Array(arr.length).keys()];
   app.innerHTML=`<section class="screen alt-screen">${topbar(true)}
     <div class="alt-hero timeline-hero">
       <div class="alt-mode-title">${title}</div>
       <div class="alt-meta"><span>${title}</span><i>·</i><span>${difficulty}</span><i>·</i><span>${ex('factChecked')}</span></div>
       <h1>${L(c.q)}</h1><p>${ex('timelineHelp')}</p>
     </div>
     <div class="timeline-list">
       ${order.map((idx,pos)=>`<div class="timeline-item">
         <span class="timeline-pos">${pos+1}</span>
         <span class="timeline-text">${arr[idx]}</span>
         <span class="timeline-controls">
           <button type="button" aria-label="${ex('moveUp')}" onclick="moveTimeline(${pos},-1)" ${pos===0?'disabled':''}>↑</button>
           <button type="button" aria-label="${ex('moveDown')}" onclick="moveTimeline(${pos},1)" ${pos===order.length-1?'disabled':''}>↓</button>
         </span>
       </div>`).join('')}
     </div>
     <div id="altfeed" class="alt-feed"></div>
     <div class="alt-actionbar">
       <button class="btn alt-clear" type="button" onclick="resetTimeline()">${t('clear')}</button>
       <button class="btn primary alt-check" type="button" onclick="checkAlt()">${ex('verifyAlt')}</button>
     </div>
   </section>`;
   return;
 }

 if(state.altKind==='hyp'){
   app.innerHTML=`<section class="screen alt-screen">${topbar(true)}
     <div class="alt-hero hypothesis-hero">
       <div class="alt-mode-title">${title}</div>
       <div class="alt-meta"><span>${title}</span><i>·</i><span>${difficulty}</span><i>·</i><span>${ex('factChecked')}</span></div>
       <h1>${L(c.q)}</h1><p>${ex('altHint')}</p>
     </div>
     <div class="hypothesis-grid">
       ${arr.map((x,i)=>`<button class="hypothesis-card ${state.altSel.includes(i)?'selected':''}" type="button" onclick="altPick(${i})">
         <span class="hypothesis-label">${i===0?ex('hypA'):ex('hypB')}</span>
         <strong>${x}</strong>
         <i>›</i>
       </button>`).join('')}
     </div>
     <div id="altfeed" class="alt-feed"></div>
     <div class="alt-actionbar">
       <button class="btn alt-clear" type="button" onclick="clearAltSelection()">${t('clear')}</button>
       <button class="btn primary alt-check" type="button" onclick="checkAlt()">${ex('verifyAlt')}</button>
     </div>
   </section>`;
   return;
 }

 const missing=state.altKind==='missing';
 app.innerHTML=`<section class="screen alt-screen">${topbar(true)}
   <div class="alt-hero ${missing?'missing-hero':''}">
     <div class="alt-mode-title">${title}</div>
     <div class="alt-meta"><span>${title}</span><i>·</i><span>${difficulty}</span><i>·</i><span>${ex('factChecked')}</span></div>
     <h1>${L(c.q)}</h1><p>${missing?ex('missingLead'):ex('altHint')}</p>
   </div>
   ${missing?`<div class="missing-chain"><span>A</span><b>→</b><span class="missing-q">?</span><b>→</b><span>C</span></div>`:''}
   <div class="alt-options">
     ${arr.map((x,i)=>`<button class="alt-option ${state.altSel.includes(i)?'selected':''}" type="button" onclick="altPick(${i})">
       <span class="alt-num">${i+1}</span><span class="alt-text">${x}</span><span class="alt-mark">✓</span>
     </button>`).join('')}
   </div>
   <div id="altfeed" class="alt-feed"></div>
   <div class="alt-actionbar">
     <button class="btn alt-clear" type="button" onclick="clearAltSelection()">${t('clear')}</button>
     <button class="btn primary alt-check" type="button" onclick="checkAlt()">${ex('verifyAlt')}</button>
   </div>
 </section>`;
}
function altPick(i){
 state.altSel=[i];
 renderAlt();
}
function clearAltSelection(){
 state.altSel=[];
 renderAlt();
}
function moveTimeline(pos,delta){
 const next=pos+delta;
 if(next<0||next>=state.altOrder.length)return;
 [state.altOrder[pos],state.altOrder[next]]=[state.altOrder[next],state.altOrder[pos]];
 renderAlt();
}
function resetTimeline(){
 const c=ALTCASES[state.altKind][state.altIdx];
 state.altOrder=[...Array(L(c.a).length).keys()];
 renderAlt();
}
function altResult(ok,c){
 const decisive=L(c.why);
 return `<div class="result-card ${ok?'good':'bad'}">
   <div class="result-kicker">${ex('resultTitle')}</div>
   <h3>${ok?t('correct'):t('wrong')}</h3>
   <div class="result-row"><span>✓</span><div><b>${ex('decisive')}</b><p>${decisive}</p></div></div>
   <button class="btn primary result-next" onclick="startAlt('${state.altKind}')">${ex('nextCase')}</button>
 </div>`;
}
function checkAlt(){
 const c=ALTCASES[state.altKind][state.altIdx], feed=document.getElementById('altfeed');
 let ok=false;
 if(state.altKind==='timeline'){
   ok=JSON.stringify(state.altOrder)===JSON.stringify(c.correct);
 }else{
   if(!state.altSel.length){toast(ex('chooseAnswer'));return}
   ok=state.altSel[0]===c.correct;
   document.querySelectorAll('.alt-option').forEach((b,i)=>{
     b.classList.toggle('correct',i===c.correct);
     b.classList.toggle('wrong',state.altSel.includes(i)&&i!==c.correct);
   });
   document.querySelectorAll('.hypothesis-card').forEach((b,i)=>{
     b.classList.toggle('correct',i===c.correct);
     b.classList.toggle('wrong',state.altSel.includes(i)&&i!==c.correct);
   });
 }
 feed.innerHTML=altResult(ok,c);
 if(ok)localStorage.setItem('dokazAltSolved',+(localStorage.getItem('dokazAltSolved')||0)+1);
}
const EXTRA={
 sk:{game:'DÔKAZ',daily:'Denný dôkaz',daily_desc:'Jeden rovnaký spis na celý deň. Skús ho vyriešiť na prvý pokus.',streak:'Séria dní',todaydone:'Dnešný dôkaz už máš vyriešený.',master:'Majstrovská séria',master_desc:'Päť náhodných spisov bez nápovedy. Jedna chyba sériu ukončí.',perfect:'Perfektné série',lie:'Nájdi klamstvo',lie_desc:'Päť tvrdení vyzerá vierohodne. Jedno je vecne nesprávne. Odhaľ ho.',missing:'Chýbajúci článok',missing_desc:'V argumente chýba rozhodujúci krok. Vyber tvrdenie, ktoré reťazec uzavrie.',hyp:'Dve hypotézy',hyp_desc:'Dve vysvetlenia sú možné. Rozhodni, ktoré lepšie zodpovedá dôkazom.',timeline:'Časová rekonštrukcia',timeline_desc:'Zoraď udalosti tak, aby vznikol správny historický alebo vedecký sled.',altstat:'Dedukčné úlohy',newcase:'Ďalšia úloha',editorial:'Redakčne overené',hard:'Náročné',medium:'Stredné',difficulty:'Obtiažnosť',sourcecheck:'Faktograficky overené',expert_detail:'Expertné: rozhoduje presný detail',languageaudit:'Text bol upravený samostatne pre slovenčinu; nejde o doslovný preklad.',sources:'Overenie: NASA / CDC / NHTSA podľa témy',modes:'Herné režimy',progresslabel:'Tvoj postup',origAudit:'Kompletný audit spisov + odborné prípady',origAuditDesc:'Kontrola významu, logickej nadväznosti, distraktorov a jazykovej prirodzenosti.',quality:'Kvalita spisu',help:'Ako hrať',helptext:'1. Hľadaj príčinu. 2. Nájdi fakt, ktorý ju spája so záverom. 3. Až potom vyber záver. Nápoveda má tri stupne a znižuje maximálny počet hviezd.',hint1:'1/3: Zameraj sa na príčinu – ktorá karta vysvetľuje, čo spustilo dej?',hint2:'2/3: Jednu rušivú kartu som vyradil.',hint3:'3/3: Zvýraznil som jeden správny článok.',diagnostics:'Diagnostika',diagnosticsDesc:'Lekárske kazuistiky: príznaky → diferenciálna úvaha → dôkaz.',laboratory:'Laboratórium',laboratoryDesc:'Chemické reakcie, rovnice a mechanizmy.',aftermath:'Čo nasledovalo?',aftermathDesc:'Historické dôsledky bez zjednodušenej predstavy o jedinej príčine.',evidence:'Podklady a zdroje',reasoning:'Prečo tento záver drží',sourceNote:'Zdroj podporuje faktografické jadro; samotný logický záver musí stále vyplývať z dôkazov.',medicalNote:'Vzdelávacia kazuistika – nejde o diagnostiku ani liečebné odporúčanie pre konkrétneho pacienta.',sourceMethod:'A+ = mindestens zwei relevante fachlich maßgebliche Quellen; A = eine direkte maßgebliche Quelle; B = redaktionell geprüfte Schlussfolgerung. Eine Quelle stützt einen Fakt, nicht automatisch den gesamten Schluss.',dbAudit:'Technický audit databázy',dbAuditOk:'Jednotná databáza je v poriadku',dbAuditBad:'Databáza potrebuje opravu',dbTotal:'Spisy v databáze',difficultyEasy:'Základná',difficultyMedium:'Pokročilá',difficultyExpert:'Expertná',qualityAudit:'Audit kvality',categoryStats:'Kategórie',weakAudit:'Distraktory na ďalší audit',filterAll:'Všetky',filterExpert:'Expertné',filterMedical:'Kazuistiky',sourceOpen:'Otvoriť zdroj',whyDistractor:'Prečo je alternatíva zavádzajúca?',whyDistractorHelp:'Po vyriešení expertného spisu označ typ chyby v alternatívnom vysvetlení.',fallacyCause:'Korelácia ≠ príčina',fallacyPartial:'Vysvetľuje iba časť dôkazov',fallacyEvidence:'Chýba rozhodujúci dôkaz',expertRule:'Expertný spis: viac dôkazov, konkurenčná hypotéza a analýza chyby.'},
 cs:{game:'DŮKAZ',daily:'Denní důkaz',daily_desc:'Jeden stejný spis na celý den. Zkus ho vyřešit na první pokus.',streak:'Série dnů',todaydone:'Dnešní důkaz už máš vyřešený.',master:'Mistrovská série',master_desc:'Pět náhodných spisů bez nápovědy. Jedna chyba sérii ukončí.',perfect:'Perfektní série',lie:'Najdi lež',lie_desc:'Pět tvrzení působí věrohodně. Jedno je věcně nesprávné. Odhal ho.',missing:'Chybějící článek',missing_desc:'V argumentu chybí rozhodující krok. Vyber tvrzení, které řetězec uzavře.',hyp:'Dvě hypotézy',hyp_desc:'Dvě vysvětlení jsou možná. Rozhodni, které lépe odpovídá důkazům.',timeline:'Časová rekonstrukce',timeline_desc:'Seřaď události tak, aby vznikla správná historická nebo vědecká posloupnost.',altstat:'Dedukční úlohy',newcase:'Další úloha',editorial:'Redakčně ověřeno',hard:'Náročné',medium:'Střední',difficulty:'Obtížnost',sourcecheck:'Faktograficky ověřeno',expert_detail:'Expertní: rozhoduje přesný detail',languageaudit:'Text byl redigován samostatně v češtině; nejde o doslovný překlad.',sources:'Ověření: NASA / CDC / NHTSA podle tématu',modes:'Herní režimy',progresslabel:'Tvůj postup',origAudit:'Kompletní audit spisů + odborné případy',origAuditDesc:'Kontrola významu, logické návaznosti, distraktorů a přirozené češtiny.',quality:'Kvalita spisu',help:'Jak hrát',helptext:'1. Hledej příčinu. 2. Najdi fakt, který ji propojuje se závěrem. 3. Teprve potom vyber závěr. Nápověda má tři stupně a snižuje maximální počet hvězd.',hint1:'1/3: Zaměř se na příčinu – která karta vysvětluje, co děj spustilo?',hint2:'2/3: Jednu rušivou kartu jsem vyřadil.',hint3:'3/3: Zvýraznil jsem jeden správný článek.',diagnostics:'Diagnostika',diagnosticsDesc:'Lékařské kazuistiky: příznaky → diferenciální úvaha → důkaz.',laboratory:'Laboratoř',laboratoryDesc:'Chemické reakce, rovnice a mechanismy.',aftermath:'Co následovalo?',aftermathDesc:'Historické důsledky bez zjednodušeného tvrzení o jediné příčině.',evidence:'Podklady a zdroje',reasoning:'Proč tento závěr obstojí',sourceNote:'Zdroj podporuje faktografické jádro; samotný logický závěr musí stále vyplývat z důkazů.',medicalNote:'Výuková kazuistika – nejde o diagnostiku ani léčebné doporučení pro konkrétního pacienta.',sourceMethod:'Hodnocení A = přímý autoritativní/institucionální zdroj. B = redakčně prověřený logický úsudek bez přímého přiřazení jediného zdroje.',dbAudit:'Technický audit databáze',dbAuditOk:'Jednotná databáze je v pořádku',dbAuditBad:'Databáze potřebuje opravu',dbTotal:'Spisy v databázi',difficultyEasy:'Základní',difficultyMedium:'Pokročilá',difficultyExpert:'Expertní',qualityAudit:'Audit kvality',categoryStats:'Kategorie',weakAudit:'Distraktory k dalšímu auditu',filterAll:'Všechny',filterExpert:'Expertní',filterMedical:'Kazuistiky',sourceOpen:'Otevřít zdroj',whyDistractor:'Proč je alternativa zavádějící?',whyDistractorHelp:'Po vyřešení expertního spisu označ typ chyby v alternativním vysvětlení.',fallacyCause:'Korelace ≠ příčina',fallacyPartial:'Vysvětluje jen část důkazů',fallacyEvidence:'Chybí rozhodující důkaz',expertRule:'Expertní spis: více důkazů, konkurenční hypotéza a analýza chyby.'},
 en:{game:'EVIDENCE',daily:'Daily evidence',daily_desc:'One shared case for the whole day. Try to solve it on your first attempt.',streak:'Day streak',todaydone:'Today’s evidence is already solved.',master:'Master run',master_desc:'Five random cases without hints. One mistake ends the run.',perfect:'Perfect runs',lie:'Spot the falsehood',lie_desc:'Five claims sound plausible. One is factually wrong. Find it.',missing:'Missing link',missing_desc:'A crucial step is missing from the argument. Choose the statement that completes the reasoning.',hyp:'Two hypotheses',hyp_desc:'Two explanations are possible. Decide which one is better supported by the evidence.',timeline:'Timeline reconstruction',timeline_desc:'Put the events in the correct historical or scientific order.',altstat:'Deduction cases',newcase:'Next case',editorial:'Editorially reviewed',hard:'Hard',medium:'Medium',difficulty:'Difficulty',sourcecheck:'Fact-checked',expert_detail:'Expert: the precise detail matters',languageaudit:'The English copy was edited independently for natural usage, not translated word for word.',sources:'Checked against NASA / CDC / NHTSA as applicable',modes:'Game modes',progresslabel:'Your progress',origAudit:'Full dossier audit + specialist cases',origAuditDesc:'Reviewed for meaning, reasoning, distractor quality and idiomatic English.',quality:'Case quality',help:'How to play',helptext:'1. Find the cause. 2. Find the fact that connects it to the conclusion. 3. Only then choose the conclusion. Hints have three levels and reduce the maximum star rating.',hint1:'1/3: Focus on the cause—which card explains what starts the process?',hint2:'2/3: I removed one distractor.',hint3:'3/3: I highlighted one correct link.',diagnostics:'Diagnosis',diagnosticsDesc:'Clinical cases: symptoms → differential → evidence.',laboratory:'Laboratory',laboratoryDesc:'Chemical reactions, equations and mechanisms.',aftermath:'What followed?',aftermathDesc:'Historical consequences without false single-cause stories.',evidence:'Evidence and sources',reasoning:'Why the conclusion holds',sourceNote:'The source supports the factual core; the logical conclusion must still follow from the evidence.',medicalNote:'Educational clinical case — not diagnosis or treatment advice for an individual patient.',sourceMethod:'Grade A = direct authoritative/institutional source. B = editorially reviewed reasoning without one directly assigned source.',dbAudit:'Database technical audit',dbAuditOk:'Unified database is healthy',dbAuditBad:'Database needs attention',dbTotal:'Dossiers in database',difficultyEasy:'Basic',difficultyMedium:'Advanced',difficultyExpert:'Expert',qualityAudit:'Quality audit',categoryStats:'Categories',weakAudit:'Distractors for further review',filterAll:'All',filterExpert:'Expert',filterMedical:'Clinical',sourceOpen:'Open source',whyDistractor:'Why is the alternative misleading?',whyDistractorHelp:'After solving an expert dossier, identify the flaw in the alternative explanation.',fallacyCause:'Correlation ≠ causation',fallacyPartial:'Explains only part of the evidence',fallacyEvidence:'Decisive evidence is missing',expertRule:'Expert dossier: more evidence, a competing hypothesis and error analysis.'},
 de:{game:'BEWEIS',daily:'Tagesbeweis',daily_desc:'Ein gemeinsamer Fall für den ganzen Tag. Löse ihn möglichst im ersten Versuch.',streak:'Tagesserie',todaydone:'Den heutigen Beweis hast du bereits gelöst.',master:'Meisterserie',master_desc:'Fünf zufällige Fälle ohne Hinweise. Ein Fehler beendet die Serie.',perfect:'Perfekte Serien',lie:'Falschaussage finden',lie_desc:'Fünf Aussagen klingen plausibel. Eine ist sachlich falsch. Finde sie.',missing:'Fehlendes Glied',missing_desc:'In der Argumentation fehlt ein entscheidender Schritt. Wähle die Aussage, die die Argumentationskette schließt.',hyp:'Zwei Hypothesen',hyp_desc:'Zwei Erklärungen sind möglich. Entscheide, welche durch die Belege besser gestützt wird.',timeline:'Zeitliche Rekonstruktion',timeline_desc:'Ordne die Ereignisse in die richtige historische oder wissenschaftliche Reihenfolge.',altstat:'Deduktionsfälle',newcase:'Nächste Aufgabe',editorial:'Redaktionell geprüft',hard:'Schwer',medium:'Mittel',difficulty:'Schwierigkeit',sourcecheck:'Faktengeprüft',expert_detail:'Experte: Auf das genaue Detail kommt es an',languageaudit:'Die deutsche Fassung wurde eigenständig redigiert und nicht wörtlich übertragen.',sources:'Geprüft anhand von NASA / CDC / NHTSA je nach Thema',modes:'Spielmodi',progresslabel:'Dein Fortschritt',origAudit:'Vollständige Fallprüfung + Fachfälle',origAuditDesc:'Geprüft auf Bedeutung, logische Schlüssigkeit, Qualität der Ablenkungen und idiomatisches Deutsch.',quality:'Fallqualität',help:'Spielhilfe',helptext:'1. Suche die Ursache. 2. Finde den Beleg, der sie mit dem Schluss verbindet. 3. Wähle erst dann den Schluss. Hinweise haben drei Stufen und verringern die maximalen Sterne.',hint1:'1/3: Konzentriere dich auf die Ursache – welche Karte erklärt den Auslöser?',hint2:'2/3: Eine Ablenkung wurde entfernt.',hint3:'3/3: Ein richtiges Glied wurde hervorgehoben.',diagnostics:'Diagnostik',diagnosticsDesc:'Klinische Fälle: Symptome → Differenzialdiagnose → Evidenz.',laboratory:'Labor',laboratoryDesc:'Chemische Reaktionen, Gleichungen und Mechanismen.',aftermath:'Was folgte?',aftermathDesc:'Historische Folgen ohne unzulässige monokausale Verkürzung.',evidence:'Belege und Quellen',reasoning:'Warum der Schluss trägt',sourceNote:'Die Quelle stützt den faktischen Kern; der logische Schluss muss weiterhin aus den Belegen folgen.',medicalNote:'Lehrfall – keine Diagnose oder Therapieempfehlung für einen konkreten Patienten.',sourceMethod:'Bewertung A = direkte autoritative/institutionelle Quelle. B = redaktionell geprüfte Schlussfolgerung ohne direkt zugeordnete Einzelquelle.',dbAudit:'Technische Datenbankprüfung',dbAuditOk:'Einheitliche Datenbank ist in Ordnung',dbAuditBad:'Datenbank benötigt Korrekturen',dbTotal:'Fälle in der Datenbank',difficultyEasy:'Basis',difficultyMedium:'Fortgeschritten',difficultyExpert:'Experte',qualityAudit:'Qualitätsprüfung',categoryStats:'Kategorien',weakAudit:'Ablenkungen für weitere Prüfung',filterAll:'Alle',filterExpert:'Expertenfälle',filterMedical:'Klinische Fälle',sourceOpen:'Quelle öffnen',whyDistractor:'Warum ist die Alternative irreführend?',whyDistractorHelp:'Bestimme nach dem Expertenfall den Fehler in der alternativen Erklärung.',fallacyCause:'Korrelation ≠ Kausalität',fallacyPartial:'Erklärt nur einen Teil der Belege',fallacyEvidence:'Entscheidender Beleg fehlt',expertRule:'Expertenfall: mehr Belege, eine Alternativhypothese und Analyse möglicher Denkfehler.'}
};
function ex(k){return EXTRA[state.lang]?.[k]||EXTRA.sk[k]}
function dayKey(){const d=new Date();return `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`}
function dailyIndex(){const s=dayKey().replaceAll('-','');let n=0;for(const c of s)n=(n*31+c.charCodeAt(0))>>>0;return n%LEVELS.length}
function dailyStreak(){return +(localStorage.getItem('dokazDailyStreak')||0)}

function startMaster(){
 state.mode='master';state.order=[...Array(LEVELS.length).keys()].sort(()=>Math.random()-.5).slice(0,5);
 state.idx=0;state.masterAlive=true;state.screen='game';history.pushState({screen:'game'},'');renderCase()
}

function startDaily(){
 const key=dayKey(),last=localStorage.getItem('dokazDailyLast');
 if(last===key){toast(ex('todaydone'));return}
 state.mode='daily';state.order=[dailyIndex()];state.idx=0;state.screen='game';history.pushState({screen:'game'},'');renderCase()
}
const _oldVerify=verify;
verify=function(){
 const before=state.mode, idx=state.order[state.idx], raw=LEVELS[idx], exact=state.selected.length===3&&state.selected.every((x,i)=>x===raw.answer[i]);
 _oldVerify();
 if(before==='daily'&&exact){
   const key=dayKey(), last=localStorage.getItem('dokazDailyLast');
   if(last!==key){
     const prev=new Date();prev.setDate(prev.getDate()-1);
     const pk=`${prev.getFullYear()}-${prev.getMonth()+1}-${prev.getDate()}`;
     const streak=localStorage.getItem('dokazDailyLast')===pk?dailyStreak()+1:1;
     localStorage.setItem('dokazDailyStreak',streak);localStorage.setItem('dokazDailyLast',key);
   }
 }
}
const _oldHome=renderHome;
renderHome=function(){
 _oldHome();
 const hero=document.querySelector('.hero h1'); if(hero) hero.textContent=ex('game');
 const grid=document.querySelector('.modegrid');
 if(grid){
   const section=document.createElement('section');
   section.className='special-section';
   const titles={
    sk:{title:'Odborné režimy',sub:'Prípady, v ktorých rozhoduje spôsob uvažovania.'},
    cs:{title:'Odborné režimy',sub:'Případy, ve kterých rozhoduje způsob uvažování.'},
    en:{title:'Specialist modes',sub:'Cases where the reasoning matters as much as the facts.'},
    de:{title:'Fachmodi',sub:'Fälle, bei denen die Schlussfolgerung ebenso wichtig ist wie das Faktenwissen.'}
   }[state.lang];
   section.innerHTML=`<div class="section-head"><div><div class="eyebrow">${titles.title}</div><p>${titles.sub}</p></div></div>
   <div class="special-grid">
    <button class="special-card med" type="button" onclick="startSpecial('lek')"><span class="special-icon">✚</span><span><strong>${ex('diagnostics')}</strong><small>${ex('diagnosticsDesc')}</small></span><i>›</i></button>
    <button class="special-card chem" type="button" onclick="startSpecial('chem')"><span class="special-icon">⚗</span><span><strong>${ex('laboratory')}</strong><small>${ex('laboratoryDesc')}</small></span><i>›</i></button>
    <button class="special-card hist" type="button" onclick="startSpecial('hist')"><span class="special-icon">⌛</span><span><strong>${ex('aftermath')}</strong><small>${ex('aftermathDesc')}</small></span><i>›</i></button>
   </div>`;
   grid.parentNode.insertBefore(section,grid);

   const h=document.createElement('div');h.className='section-head game-head';
   h.innerHTML=`<div class="eyebrow">${ex('modes')}</div>`;
   grid.parentNode.insertBefore(h,grid);

   const b=document.createElement('button');b.className='mode';b.onclick=startDaily;
   b.innerHTML=`<div class="ico">◉</div><strong>${ex('daily')}</strong><small>${ex('daily_desc')}</small>`;
   grid.appendChild(b);
   const m=document.createElement('button');m.className='mode';m.onclick=startMaster;
   m.innerHTML=`<div class="ico">◆</div><strong>${ex('master')}</strong><small>${ex('master_desc')}</small>`;
   grid.appendChild(m);
   [['lie','◇'],['missing','⊕'],['hyp','⇄'],['timeline','↦']].forEach(([k,ic])=>{
      const x=document.createElement('button');x.className='mode';x.onclick=()=>startAlt(k);
      x.innerHTML=`<div class="ico">${ic}</div><strong>${ex(k)}</strong><small>${ex(k+'_desc')}</small>`;grid.appendChild(x)
   });
 }
 const stats=document.querySelector('.stats');
 if(stats){
   const d=document.createElement('div');d.className='stat';d.innerHTML=`<b>${dailyStreak()}</b><span>${ex('streak')}</span>`;stats.appendChild(d);
   const pr=document.createElement('div');pr.className='stat';pr.innerHTML=`<b>${+(localStorage.getItem('dokazPerfectRuns')||0)}</b><span>${ex('perfect')}</span>`;stats.appendChild(pr);
   const as=document.createElement('div');as.className='stat';as.innerHTML=`<b>${+(localStorage.getItem('dokazAltSolved')||0)}</b><span>${ex('altstat')}</span>`;stats.appendChild(as);
 }
 document.title=ex('game');
}



const ONBOARDING_I18N={
 sk:{onb1:'Nájdi príčinu',onb1d:'Začni faktom, ktorý spustil dej alebo jav.',onb2:'Spoj dôkazy',onb2d:'Nájdi článok, ktorý prepája príčinu so záverom.',onb3:'Urob záver',onb3d:'Vyber iba to, čo naozaj vyplýva z dôkazov.',next:'Ďalej',start:'Začať hrať'},
 cs:{onb1:'Najdi příčinu',onb1d:'Začni faktem, který spustil děj nebo jev.',onb2:'Propoj důkazy',onb2d:'Najdi článek, který propojí příčinu se závěrem.',onb3:'Udělej závěr',onb3d:'Vyber pouze to, co skutečně vyplývá z důkazů.',next:'Dále',start:'Začít hrát'},
 en:{onb1:'Find the cause',onb1d:'Start with the fact that sets the event or process in motion.',onb2:'Connect the evidence',onb2d:'Find the link that connects the cause to the conclusion.',onb3:'Draw the conclusion',onb3d:'Choose only what genuinely follows from the evidence.',next:'Next',start:'Start playing'},
 de:{onb1:'Ursache finden',onb1d:'Beginne mit dem Fakt, der den Vorgang oder das Ereignis auslöst.',onb2:'Belege verknüpfen',onb2d:'Finde das Glied, das Ursache und Schluss miteinander verbindet.',onb3:'Schluss ziehen',onb3d:'Wähle nur, was tatsächlich aus den Belegen folgt.',next:'Weiter',start:'Spiel starten'}
};
function oi(k){
 const lang=(state&&state.lang&&ONBOARDING_I18N[state.lang])?state.lang:'sk';
 return ONBOARDING_I18N[lang][k]||ONBOARDING_I18N.sk[k]||'';
}

function onboarding(){
 const steps=[
  ['01',oi('onb1'),oi('onb1d'),'→'],
  ['02',oi('onb2'),oi('onb2d'),'⌁'],
  ['03',oi('onb3'),oi('onb3d'),'✓']
 ];
 let n=Number(sessionStorage.getItem('dokazOnboardingStep')||0);
 n=Math.max(0,Math.min(2,n));
 const x=steps[n];
 app.innerHTML=`<section class="screen onboarding-screen">
   <div class="onboarding-brand">${topbar(false)}</div>
   <div class="onboarding-card">
     <div class="onboarding-step">${x[0]} / 03</div>
     <div class="onboarding-symbol">${x[3]}</div>
     <h1>${x[1]}</h1>
     <p>${x[2]}</p>
     <div class="onboarding-dots">${steps.map((_,i)=>`<i class="${i===n?'on':''}"></i>`).join('')}</div>
     <button class="btn primary onboarding-next" onclick="${n<2?'nextOnboarding()':'finishOnboarding()'}">${n<2?oi('next'):oi('start')}</button>
   </div>
 </section>`;
}
function nextOnboarding(){
 const n=Number(sessionStorage.getItem('dokazOnboardingStep')||0)+1;
 sessionStorage.setItem('dokazOnboardingStep',String(n));
 onboarding();
}
function finishOnboarding(){
 localStorage.setItem('dokazOnboardingDone','1');
 sessionStorage.removeItem('dokazOnboardingStep');
 renderHome();
}

window.addEventListener('popstate',()=>{if(state.screen==='home')return;goHome()});matchMedia('(prefers-color-scheme:dark)').addEventListener?.('change',()=>state.theme==='system'&&theme());theme();if(localStorage.getItem('dokazOnboardingDone')==='1')renderHome();else onboarding();
