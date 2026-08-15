'use strict';

// WebSocket klient pre iPhone/PWA stránku, ktorú cez Wi-Fi poskytuje Android hostiteľ.
(() => {
  if (window.QuizMultiplayer || !/^https?:$/.test(location.protocol)) return;
  let socket=null,pending=[],stopped=false;
  const emit=event=>{const deliver=()=>window.MultiplayerNative?.onNativeEvent(JSON.stringify(event));if(window.MultiplayerNative)deliver();else setTimeout(deliver,50);};
  const params=()=>new URLSearchParams(location.search);
  const hostFrom=address=>{const clean=String(address||location.host).replace(/^https?:\/\//,'').split('/')[0];return `${clean.split(':')[0]||location.hostname}:45874`;};
  const connect=(address,code,name,reconnectId,appVersion,protocol)=>{
    stopped=false;if(socket)try{socket.close();}catch(_){}
    try{socket=new WebSocket(`ws://${hostFrom(address)}/ws`);}catch(error){emit({type:'error',message:`Pripojenie zlyhalo: ${error.message}`});return;}
    socket.addEventListener('open',()=>{socket.send(JSON.stringify({type:'join',code:String(code||''),name:String(name||'Hráč'),reconnectId:String(reconnectId||''),appVersion:String(appVersion||window.QUIZ_APP_VERSION||'PWA'),protocol:Number(protocol)||3,client:'iphone-pwa'}));pending.splice(0).forEach(item=>socket.send(item));emit({type:'connected'});});
    socket.addEventListener('message',event=>{try{emit({type:'message',payload:JSON.parse(event.data)});}catch(_){emit({type:'error',message:'Hostiteľ poslal neplatnú správu.'});}});
    socket.addEventListener('error',()=>emit({type:'error',message:'Wi-Fi spojenie s hostiteľom zlyhalo.'}));
    socket.addEventListener('close',()=>{socket=null;if(!stopped)emit({type:'disconnected'});});
  };
  window.QuizMultiplayer={webClient:true,startHost(){return JSON.stringify({ok:false,message:'Miestnosť vytvor v Android aplikácii.'});},joinHost(a,c,n){connect(a,c,n,'','PWA',3);},joinHostV2(a,c,n,r){connect(a,c,n,r,'PWA',3);},joinHostV3:connect,send(payload){if(socket?.readyState===WebSocket.OPEN)socket.send(payload);else if(socket?.readyState===WebSocket.CONNECTING)pending.push(payload);},stop(){stopped=true;pending=[];if(socket)socket.close();socket=null;},setKeepAlive(){},openWifiSettings(){},openHotspotSettings(){},lockRoom(){},consumePairingData(){const p=params(),code=p.get('code')||'',address=p.get('address')||`${location.hostname}:45873`;return /^\d{6}$/.test(code)?JSON.stringify({address,code}):'';}};
})();
