'use strict';

(() => {
  let installPrompt=null;
  const standalone=window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
  function showInstallButton(){
    if(standalone||!installPrompt||document.getElementById('pwaInstall'))return;
    const hero=document.querySelector('.hero-main');if(!hero)return;
    const button=document.createElement('button');button.id='pwaInstall';button.className='pwa-install';button.type='button';button.innerHTML='<span>↓</span><small>Nainštalovať</small>';
    button.addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;button.remove();});hero.insertBefore(button,hero.lastElementChild);
  }
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;showInstallButton();});
  window.addEventListener('appinstalled',()=>{installPrompt=null;document.getElementById('pwaInstall')?.remove();});
  new MutationObserver(showInstallButton).observe(document.getElementById('app'),{childList:true,subtree:true});
  if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',async()=>{try{const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./'});registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller){const update=document.createElement('button');update.className='pwa-update-toast';update.textContent='Je dostupná nová verzia · Aktualizovať';update.addEventListener('click',()=>{worker.postMessage({type:'SKIP_WAITING'});});document.body.appendChild(update);}});});navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload());}catch(error){console.warn('PWA offline režim sa nepodarilo aktivovať.',error);}});
  const hash=location.hash.slice(1);if(hash==='learn')setTimeout(()=>window.showLearningHub?.(),300);else if(hash==='play')setTimeout(()=>window.showHome?.(),300);
})();
