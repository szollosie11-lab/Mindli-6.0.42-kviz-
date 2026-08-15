'use strict';

(function () {
  // Otázky sú nemenný vstup. Hlboké JSON klonovanie celej databázy pri štarte
  // vytváralo na slabších telefónoch veľkú pamäťovú špičku a WebView spadol.
  const RAW_BANK = window.QUESTION_BANK;
  const I18n = window.QuizI18n;
  const STORAGE = {
    profiles: 'quiz-v2-profiles', active: 'quiz-v2-active-profile', settings: 'quiz-v2-settings',
    overrides: 'quiz-v2-overrides', custom: 'quiz-v2-custom-questions'
  };
  const ACHIEVEMENTS = [
    {id:'streak10', icon:'10', name:'Bez zaváhania', text:'10 správnych odpovedí za sebou'},
    {id:'allCategories', icon:'18', name:'Všestranný znalec', text:'Správna odpoveď vo všetkých okruhoch'},
    {id:'wallet10k', icon:'¤', name:'Kvízový bankár', text:'Konto aspoň 10 000 kr'},
    {id:'expert', icon:'5', name:'Expert', text:'Správna expertná odpoveď'},
    {id:'perfect', icon:'✓', name:'Bezchybný', text:'Dokončené kolo bez chyby'},
    {id:'bet1000', icon:'1K', name:'Odvážny tip', text:'Výhra so stávkou 1 000 kr'},
    {id:'extreme', icon:'6', name:'Mozgový trust', text:'Správna odpoveď na extrémnu otázku'},
    {id:'answers50', icon:'50', name:'Rozbehnutý', text:'Zodpovedaných 50 otázok'},
    {id:'correct100', icon:'100', name:'Stovkár', text:'100 správnych odpovedí'},
    {id:'typed20', icon:'Aa', name:'Majster písania', text:'20 správnych písaných odpovedí'},
    {id:'extreme5', icon:'X5', name:'Lovec extrémov', text:'5 správnych extrémnych odpovedí'},
    {id:'workshop10', icon:'DT', name:'Technický praktik', text:'10 správnych odpovedí v dielni a technike'},
    {id:'fashion10', icon:'MD', name:'Cit pre dizajn', text:'10 správnych odpovedí v móde a textile'},
    {id:'networkGame', icon:'Wi', name:'Spolu v sieti', text:'Dokončená hra na viacerých telefónoch'},
    {id:'networkWinner', icon:'1.', name:'Sieťový šampión', text:'Víťazstvo v hre na viacerých telefónoch'},
    {id:'logic10', icon:'◇', name:'Bystré oko', text:'10 správnych odpovedí vo vizuálnej logike'}
    ,{id:'cityFlags5', icon:'M5', name:'Mestský vexilológ', text:'5 správnych odpovedí na mestské vlajky'}
    ,{id:'rareFlags10', icon:'V10', name:'Lovec vzácnych vlajok', text:'10 správnych odpovedí na menej známe štátne vlajky'}
  ];
  const defaultSettings = {
    theme:'system', adaptiveDimming:'gentle', largeText:false, colorblind:false, animations:true,
    sound:true, introMusic:true, backgroundMusic:true, vibration:true, timeLimit:0, language:'sk',autoAdvance:true,autoAdvanceDelay:1200,
    readQuestions:false,voiceInput:false,largeButtons:false,oneHanded:false
  };

  function load(key, fallback) {
    try { const value = JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch (_) { return fallback; }
  }
  function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function uid(prefix='id') { return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
  function today(offset=0) {
    const date = new Date(); date.setDate(date.getDate()+offset);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  function emptyStats() {
    return {total:0, correct:0, typedCorrect:0, extremeCorrect:0, multiplayerGames:0, multiplayerWins:0,
      totalWagered:0, maxWallet:1000, bestCorrectStreak:0,currentCorrectStreak:0, perCategory:{}, history:[], multiplayerHistory:[], playedDates:[]};
  }
  function createProfile(name='Hráč', type='adult') {
    return {id:uid('profile'), name, type, avatar:name.trim().slice(0,2).toLocaleUpperCase('sk') || 'HR',
      xp:0, coins:0, endlessWallet:1000, walletUnifiedV30:true, moneyCodeUsed:false, savedGame:null, favorites:[], questionReports:[], presets:[], lastRescue:null,
      walletLedger:[],questionProgress:{},difficultyFeedback:{},reviewQueue:[],weeklyResults:{},adventures:{},learning:{reviewed:0,mastered:0,lastSession:null},dailyMission:{date:null,answered:0,noHelp:0,logic:0,rewarded:false},preferences:{language:'sk',difficulty:'progressive',onlyUnseen:false,languageTraining:false,trainingLanguage:'en',lastCategoryId:null},
      stats:emptyStats(), mistakes:[], achievements:[], dailyDates:[], lastDaily:null, dailyStreak:0};
  }
  let profiles = load(STORAGE.profiles, []);
  if (!profiles.length) profiles = [createProfile('Hráč', 'adult')];
  let walletMigrationChanged=false;
  profiles = profiles.map(p => {
    const normalized={...createProfile(p.name,p.type), ...p, favorites:Array.isArray(p.favorites)?p.favorites:[], questionReports:Array.isArray(p.questionReports)?p.questionReports:[], presets:Array.isArray(p.presets)?p.presets:[],walletLedger:Array.isArray(p.walletLedger)?p.walletLedger:[],questionProgress:p.questionProgress&&typeof p.questionProgress==='object'?p.questionProgress:{},difficultyFeedback:p.difficultyFeedback&&typeof p.difficultyFeedback==='object'?p.difficultyFeedback:{},reviewQueue:Array.isArray(p.reviewQueue)?p.reviewQueue:[],weeklyResults:p.weeklyResults&&typeof p.weeklyResults==='object'?p.weeklyResults:{},adventures:p.adventures&&typeof p.adventures==='object'?p.adventures:{},learning:p.learning&&typeof p.learning==='object'?p.learning:{reviewed:0,mastered:0,lastSession:null},dailyMission:p.dailyMission&&typeof p.dailyMission==='object'?p.dailyMission:{date:null,answered:0,noHelp:0,logic:0,rewarded:false},preferences:{...createProfile(p.name,p.type).preferences,...(p.preferences||{})}, stats:{...emptyStats(),...(p.stats||{})}};
    if(p.walletUnifiedV30!==true){const latest=normalized.stats.history?.[0],latestWallet=Number(latest?.wallet),savedWallet=Number(normalized.endlessWallet);if(savedWallet===1000&&latest?.mode!=='learning'&&Number.isFinite(latestWallet))normalized.endlessWallet=Math.round(latestWallet);normalized.walletUnifiedV30=true;walletMigrationChanged=true;}
    return normalized;
  });
  if(walletMigrationChanged)localStorage.setItem(STORAGE.profiles,JSON.stringify(profiles));
  let activeId = localStorage.getItem(STORAGE.active) || profiles[0].id;
  if (!profiles.some(p => p.id===activeId)) activeId=profiles[0].id;
  let settings = {...defaultSettings, ...load(STORAGE.settings,{})};
  let overrides = load(STORAGE.overrides,{});
  let customQuestions = load(STORAGE.custom,[]);
  let bank;
  let allQuestions;

  function structurallyValidQuestion(question) {
    const options=Array.isArray(question?.options)?question.options:[];
    const ci=question?.correctIndex;
    if(options.length!==4||!Number.isInteger(ci)||ci<0||ci>3)return false;
    if(new Set(options.map(x=>String(x).trim().toLocaleLowerCase())).size!==4)return false;
    return options.every(x=>String(x).trim().length>0);
  }
  function normalizeQuestion(question, category) {
    const q = {...question};
    q.categoryId = q.categoryId || category.id;
    q.categoryName = category.name;
    q.answer = q.answer || q.options?.[q.correctIndex] || '';
    q.acceptedAnswers = Array.isArray(q.acceptedAnswers) ? q.acceptedAnswers : [];
    q.typingEligible = q.typingEligible !== false;
    q.difficulty = Math.max(1, Math.min(6, Number(q.difficulty)||1));
    return q;
  }
  function rebuildBank() {
    const cloned = {...RAW_BANK,categories:RAW_BANK.categories.map(category=>({...category,questions:category.questions.map(question=>({...question}))}))};
    const language=settings.language||'sk';
    const rawMap = new Map();
    for (const category of cloned.categories) {
      category.name=I18n?.categoryName(category,language)||category.name;
      category.questions = category.questions.filter(q=>(language==='sk'||Boolean(q.i18n?.[language]))&&structurallyValidQuestion(q)).map(q => {
        q=I18n?.localizeQuestion(q,language)||q;
        const normalized = normalizeQuestion(q, category); rawMap.set(normalized.id, normalized); return normalized;
      });
    }
    for (const custom of customQuestions) {
      const category = cloned.categories.find(c => c.id===custom.categoryId) || cloned.categories[0];
      if(!structurallyValidQuestion(custom)){console.warn('MINDli: skipped malformed custom question',custom?.id);continue;}const q = normalizeQuestion(custom, category); rawMap.set(q.id,q); category.questions.push(q);
    }
    for (const [id, override] of Object.entries(overrides)) {
      if (!rawMap.has(id)) continue;
      const target=rawMap.get(id); Object.assign(target, override);
      target.answer=target.answer||target.options?.[target.correctIndex]||'';
    }
    for (const category of cloned.categories) category.questions = category.questions.filter(q => !q.disabled);
    bank=cloned; allQuestions=rawMap;
    return bank;
  }
  rebuildBank();

  function profile() { return profiles.find(p=>p.id===activeId) || profiles[0]; }
  function persistProfiles() { save(STORAGE.profiles,profiles); localStorage.setItem(STORAGE.active,activeId); }
  function persistSettings() { save(STORAGE.settings,settings); applyVisualSettings(); rebuildBank(); }
  function applyVisualSettings() {
    const root=document.documentElement;
    const allowed=new Set(['system','light','dark','midnight','forest','ocean','sunset']),systemDark=window.matchMedia?.('(prefers-color-scheme: dark)').matches,choice=allowed.has(settings.theme)?settings.theme:'system',palette=choice==='system'?(systemDark?'dark':'light'):choice,theme=['dark','midnight','ocean','sunset'].includes(palette)?'dark':'light';
    root.dataset.theme=theme;root.dataset.palette=palette;root.dataset.themeChoice=choice;
    root.classList.toggle('large-text',!!settings.largeText);
    root.classList.toggle('colorblind',!!settings.colorblind);
    root.classList.toggle('no-motion',!settings.animations);
    root.classList.toggle('large-buttons',!!settings.largeButtons);
    root.classList.toggle('one-handed',!!settings.oneHanded);
    const hour=new Date().getHours(),night=hour>=20||hour<7,deepNight=hour>=22||hour<6,mode=settings.adaptiveDimming||'gentle';let dim=0;
    if(mode!=='off'){dim=theme==='dark'?(deepNight ? .07 : night ? .045 : .018):(deepNight ? .035 : night ? .018 : 0);if(mode==='strong')dim*=1.7;}
    root.dataset.adaptiveDim=dim>0?'on':'off';root.style?.setProperty?.('--adaptive-dim-opacity',String(Math.min(.14,dim)));
    const themeColors={dark:'#111827',midnight:'#070d19',forest:'#eaf4ed',ocean:'#092d49',sunset:'#4a2130',light:'#f3f6fb'};document.querySelector?.('meta[name="theme-color"]')?.setAttribute('content',themeColors[palette]||themeColors.light);
  }
  try{const scheme=window.matchMedia?.('(prefers-color-scheme: dark)'),onSchemeChange=()=>{if(settings.theme==='system')applyVisualSettings();};if(scheme?.addEventListener)scheme.addEventListener('change',onSchemeChange);else scheme?.addListener?.(onSchemeChange);}catch(_){ }
  window.addEventListener?.('focus',applyVisualSettings);document.addEventListener?.('visibilitychange',()=>{if(!document.hidden)applyVisualSettings();});window.setInterval?.(applyVisualSettings,300000);
  function levelInfo(xp=profile().xp) {
    const level=Math.floor(xp/500)+1, progress=xp%500;
    const titles=['Začiatočník','Objaviteľ','Znalec','Expert','Kvízový majster'];
    return {level,progress,next:500,title:titles[Math.min(titles.length-1,Math.floor((level-1)/3))]};
  }
  function unlock(id) {
    const p=profile(); if (!p.achievements.includes(id)) { p.achievements.push(id); persistProfiles(); return true; }
    return false;
  }
  function markPlayed(date=today()) {
    const p=profile(); if(!p.stats.playedDates.includes(date)) p.stats.playedDates.push(date);
    p.stats.playedDates=p.stats.playedDates.slice(-120); persistProfiles();
  }
  function updateDaily() {
    const p=profile(), date=today();
    if(p.dailyDates.includes(date)) return {new:false,reward:0,streak:p.dailyStreak};
    p.dailyStreak=p.lastDaily===today(-1)?p.dailyStreak+1:1; p.lastDaily=date; p.dailyDates.push(date);
    /* Coin rewards are granted in app.js so one daily game cannot pay twice. */
    persistProfiles(); return {new:true,reward:0,streak:p.dailyStreak};
  }
  function addProfile(name,type) { const p=createProfile(name,type); profiles.push(p); activeId=p.id; persistProfiles(); return p; }
  function setActive(id) { if(profiles.some(p=>p.id===id)){activeId=id;persistProfiles();} }
  function deleteProfile(id) { if(profiles.length<2)return false; profiles=profiles.filter(p=>p.id!==id); if(activeId===id)activeId=profiles[0].id;persistProfiles();return true; }
  function resetProfile(id) { const index=profiles.findIndex(p=>p.id===id); if(index<0)return; const old=profiles[index]; profiles[index]={...createProfile(old.name,old.type),id:old.id,avatar:old.avatar}; persistProfiles(); }
  function saveQuestion(question) {
    const isCustom=question.id?.startsWith('custom-');
    if(isCustom){const i=customQuestions.findIndex(q=>q.id===question.id);if(i>=0)customQuestions[i]=question;else customQuestions.push(question);save(STORAGE.custom,customQuestions);}
    else {overrides[question.id]={...(overrides[question.id]||{}),...question};save(STORAGE.overrides,overrides);}
    rebuildBank();
  }
  function addCustom(question) { question.id=question.id||uid('custom'); customQuestions.push(question); save(STORAGE.custom,customQuestions); rebuildBank(); return question; }
  function setDisabled(id,disabled) { overrides[id]={...(overrides[id]||{}),disabled}; save(STORAGE.overrides,overrides); rebuildBank(); }
  function resetQuestionOverride(id) { if(!Object.prototype.hasOwnProperty.call(overrides,id))return false;delete overrides[id];save(STORAGE.overrides,overrides);rebuildBank();return true; }
  function removeCustom(id){customQuestions=customQuestions.filter(q=>q.id!==id);save(STORAGE.custom,customQuestions);rebuildBank();}
  function exportBackup() {
    return {format:'mindli-backup',schema:1,appVersion:window.QUIZ_APP_VERSION||'unknown',createdAt:new Date().toISOString(),
      profiles:JSON.parse(JSON.stringify(profiles)),activeId,settings:JSON.parse(JSON.stringify(settings)),
      overrides:JSON.parse(JSON.stringify(overrides)),customQuestions:JSON.parse(JSON.stringify(customQuestions))};
  }
  function validateBackup(data) {
    if(!data||data.format!=='mindli-backup'||data.schema!==1)return {ok:false,message:'Súbor nie je platná záloha Mindli.'};
    if(!Array.isArray(data.profiles)||!data.profiles.length||data.profiles.length>20)return {ok:false,message:'Záloha neobsahuje platné profily.'};
    if(!data.profiles.every(item=>item&&typeof item.id==='string'&&typeof item.name==='string'))return {ok:false,message:'Niektorý profil v zálohe je poškodený.'};
    if(!data.settings||typeof data.settings!=='object'||!data.overrides||typeof data.overrides!=='object'||!Array.isArray(data.customQuestions))return {ok:false,message:'Záloha nemá všetky potrebné údaje.'};
    return {ok:true,message:'Záloha je platná.'};
  }
  function importBackup(data) {
    const validation=validateBackup(data);if(!validation.ok)return validation;
    save(STORAGE.profiles,data.profiles);localStorage.setItem(STORAGE.active,data.profiles.some(item=>item.id===data.activeId)?data.activeId:data.profiles[0].id);
    save(STORAGE.settings,{...defaultSettings,...data.settings});save(STORAGE.overrides,data.overrides||{});save(STORAGE.custom,data.customQuestions||[]);
    return {ok:true,message:'Záloha bola obnovená.'};
  }

  applyVisualSettings(); persistProfiles();
  window.QuizCore={STORAGE,ACHIEVEMENTS,RAW_BANK,get bank(){return bank;},get allQuestions(){return allQuestions;},
    get profiles(){return profiles;},get activeId(){return activeId;},get settings(){return settings;},
    get overrides(){return overrides;},get customQuestions(){return customQuestions;},profile,persistProfiles,persistSettings,
    applyVisualSettings,levelInfo,unlock,markPlayed,updateDaily,today,addProfile,setActive,deleteProfile,resetProfile,
    rebuildBank,saveQuestion,addCustom,setDisabled,resetQuestionOverride,removeCustom,exportBackup,validateBackup,importBackup,uid};
})();
