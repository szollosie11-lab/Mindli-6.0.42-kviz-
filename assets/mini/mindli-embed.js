(()=>{
 const hosted=new URLSearchParams(location.search).get('host')==='mindli'; if(!hosted)return;
 const root=document.documentElement; root.classList.add('mindli-hosted');
 function hideGlobalSettings(){
  const match=/nastaven|settings|einstellungen|vzhľad|appearance|darstellung|farebný|theme/i;
  document.querySelectorAll('button,a').forEach(el=>{const code=(el.getAttribute('onclick')||'')+' '+(el.id||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.textContent||'');if(/settingsBtn|showSettings|settings\(\)|theme/i.test(code)&&match.test(code)){el.classList.add('mindli-global-setting');el.setAttribute('data-mindli-global-setting','1')}});
 }
 function apply(s={}){
  root.dataset.mindliTheme=s.theme||'light';root.dataset.mindliPalette=s.palette||'';
  root.classList.toggle('mindli-large-text',!!s.largeText);root.classList.toggle('mindli-large-buttons',!!s.largeButtons);root.classList.toggle('mindli-colorblind',!!s.colorblind);root.classList.toggle('mindli-no-motion',s.animations===false);
  try{localStorage.setItem('mindli-host-state',JSON.stringify(s))}catch{}
  hideGlobalSettings();
 }
 try{apply(JSON.parse(localStorage.getItem('mindli-host-state')||'{}'))}catch{}
 window.addEventListener('message',e=>{if(e.data?.type==='mindli-mini-state')apply(e.data)});
 new MutationObserver(hideGlobalSettings).observe(document.documentElement,{subtree:true,childList:true});
 document.addEventListener('DOMContentLoaded',()=>{hideGlobalSettings();document.body.insertAdjacentHTML('afterbegin','<div class="mindli-host-note">Vzhľad a prístupnosť sa riadia hlavnými nastaveniami MINDli. Tu zostávajú iba pravidlá a voľby samotnej minihry.</div>')},{once:true});
})();
// Reward bridge used only when a mini app is hosted by MINDli.
window.mindliReward=function(app,key,coins,permanent=false){try{if(parent&&parent!==window)parent.postMessage({type:'mindli-mini-reward',app,key,coins,permanent},'*')}catch(_){}};
