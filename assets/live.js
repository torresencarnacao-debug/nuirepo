(()=>{
'use strict';
const t=value=>window.MirageEnglish?window.MirageEnglish(value):String(value??'');
const viewer=new URLSearchParams(location.search).get('viewer')==='nui'?'nui':'preview';
const menu=document.querySelector('.menu'),list=document.getElementById('mainOptions'),tabs=document.querySelector('.tabs'),notice=document.getElementById('connectionStatus');
const image=document.getElementById('bannerImage'),imageError=document.getElementById('bannerError');
imageError.innerHTML='Banner unavailable<span>The banner URL is not responding.</span>';
image.onerror=()=>{image.hidden=true;imageError.hidden=false};image.onload=()=>{image.hidden=false;imageError.hidden=true};
let banner='',rowKey='',tabKey='',nodes=[],indicator=null,pending=null,frame=0,windowStart=0,windowMenu='';
const titles={EXPLOIT_PUTIN:'Putin',EXPLOIT_SEED:'Seed',EXPLOIT_WAVESHIELD:'WaveShield',EXPLOIT_ELECTRON:'Electron AC',MAIN:'Main',VIP_PED:'Peds',PLAYER:'Player',MOVEMENT:'Movement',WARDROBE:'Wardrobe',ONLINE:'Online',TROLL:'Online',COMBAT:'Combat',WEAPON:'Weapon',VEHICLE:'Vehicle',MISC:'Misc',EXPLOIT:'Exploit',VIP:'Exploit',SETTINGS:'Settings',SETTINGS_RENDER:'Render',SETTINGS_UTILITY:'Utility',CUSTOM_PEDS:'Custom Peds'};
function icon(name){name=name.toLowerCase();if(name.includes('player')||name.includes('self'))return 'player';if(name.includes('online'))return 'online';if(name.includes('combat'))return 'combat';if(name.includes('weapon'))return 'weapon';if(name.includes('vehicle'))return 'vehicle';if(name.includes('visual')||name.includes('render'))return 'visual';if(name.includes('ped'))return 'peds';if(name.includes('misc'))return 'misc';return null}
function el(tag,cls,text){const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node}
function applyTheme(theme){
 if(theme){const values=['r','g','b'].map(key=>Math.max(0,Math.min(255,Number(theme[key])||0)));document.documentElement.style.setProperty('--theme-rgb',values.join(','))}
}
function draw(state){
 applyTheme(state.theme);
 const border=state.border||{enabled:false};
 menu.dataset.border=!border.enabled?'off':Number(border.style)===1?'simple':Number(border.style)===2?'glow':'animated';
 menu.style.display=state.visible?'block':'none';notice.hidden=true;if(!state.visible)return;
 document.querySelector('.heading').textContent=titles[state.menu]||state.title;
 const previousKey=document.getElementById('previousKey');if(previousKey)previousKey.textContent=state.help&&state.help.previous||'Q';
 const names=Array.isArray(state.tabs)?state.tabs:[],tk=JSON.stringify([names,state.activeTab]);
 if(tk!==tabKey){tabKey=tk;tabs.replaceChildren();tabs.hidden=!names.length;names.forEach((name,i)=>tabs.append(el('span','tab'+(i+1===state.activeTab?' active':''),t(name))))}
 const all=Array.isArray(state.rows)?state.rows:[],count=all.length,selected=Math.max(1,Math.min(count||1,Number(state.selected)||1));
 if(windowMenu!==state.menu){windowStart=0;windowMenu=state.menu}
 if(selected-1<windowStart)windowStart=selected-1;
 if(selected-1>=windowStart+10)windowStart=selected-10;
 windowStart=Math.max(0,Math.min(windowStart,Math.max(0,count-10)));
 const visibleRows=all.slice(windowStart,windowStart+10);
 const rk=state.menu+':'+windowStart+':'+JSON.stringify(visibleRows.map(item=>[item.label,item.kind,!!item.slider,item.badge!==undefined&&item.badge!==null&&item.badge!=='',!!item.selector,!!item.toggle,!!item.submenu]));
 if(rk!==rowKey){
  const savedScroll=list.scrollTop||0;rowKey=rk;nodes=[];if(!indicator)indicator=el('div','selection-indicator');list.replaceChildren(indicator);list.scrollTop=savedScroll;
  let offset=1;
  visibleRows.forEach((item,i)=>{
   const separator=item.kind==='separator'||item.kind==='resource_separator',row=el('div','row'+(separator?' separator':'')),slots={};
   const which=state.menu==='MAIN'?icon(item.label||''):null;
   if(which&&!separator){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('nav-icon');const use=document.createElementNS('http://www.w3.org/2000/svg','use');use.setAttribute('href','#ico-'+which);svg.append(use);row.append(svg)}
   row.append(el('span','label',t(item.label||'')));
   if(item.slider&&Number.isFinite(item.slider.value)){
    const slider=el('span','option-slider');const fill=el('i');const min=Number(item.slider.min)||0,max=Number(item.slider.max)||100;
    let amount=Math.max(0,Math.min(1,(item.slider.value-min)/Math.max(1,max-min)));if(item.slider.inverse)amount=1-amount;
    fill.style.width=(amount*100)+'%';slots.fill=fill;slider.append(fill);row.append(slider);
   }
   if(item.badge!==undefined&&item.badge!==null&&item.badge!==''){slots.badge=el('span','badge');row.append(slots.badge);}
   if(item.toggle){slots.toggle=el('span','switch');row.append(slots.toggle);}else if(item.submenu)row.append(el('span','chevron','›'));
   list.append(row);nodes.push({row,index:windowStart+i+1,offset,separator,slots});offset+=separator?26:34;
  });
 }
 nodes.forEach((node,i)=>{
  const item=visibleRows[i],slots=node.slots;
  if(slots.badge){const value=(item.selector?'‹ ':'')+t(item.badge)+(item.selector?' ›':'');if(slots.badge.textContent!==value)slots.badge.textContent=value;}
  if(slots.toggle)slots.toggle.classList.toggle('on',!!item.active);
  if(slots.fill){const min=Number(item.slider.min)||0,max=Number(item.slider.max)||100;let amount=Math.max(0,Math.min(1,(item.slider.value-min)/Math.max(1,max-min)));if(item.slider.inverse)amount=1-amount;slots.fill.style.width=(amount*100)+'%';}
 });
 const scale=Math.max(.5,Math.min(1.5,(Number(state.scale)||.83))),width=370*scale;
 menu.style.transform='scale('+scale+')';menu.style.transformOrigin='top left';menu.style.left=state.position===2?Math.max(25,(innerWidth-width)/2)+'px':state.position===3?Math.max(25,innerWidth-width-28)+'px':'28px';
 if(window.MirageLayout)window.MirageLayout.apply('menu');
 // La hauteur depend du nombre de lignes. Seule la hauteur de l'ecran declenche un defilement.
 const available=Math.max(68,(innerHeight-38)/scale-110-29-(names.length?32:0)-30);
 list.style.maxHeight=Math.floor(available)+'px';
 let activeRow=null;
 nodes.forEach(item=>{const active=item.index===selected;item.row.classList.toggle('selected',active);if(active){activeRow=item;if(indicator){indicator.hidden=item.separator;indicator.style.transform='translate3d(0,'+item.offset+'px,0)'}}});
 if(activeRow){const height=activeRow.separator?26:34;const viewport=list.clientHeight||available;const scroll=list.scrollTop||0;if(activeRow.offset<scroll)list.scrollTop=activeRow.offset;else if(activeRow.offset+height>scroll+viewport)list.scrollTop=activeRow.offset+height-viewport}
 document.querySelector('.counter').textContent=(count?selected:0)+' / '+count;
 const track=document.getElementById('menuTrack'),total=nodes.length?nodes[nodes.length-1].offset+(nodes[nodes.length-1].separator?26:34):1,viewport=list.clientHeight||Math.min(available,total),thumb=count>10?10/count:Math.min(1,viewport/total);
 if(track){track.hidden=count===0;track.style.setProperty('--thumb-height',(thumb*100)+'%');track.style.setProperty('--thumb-top',(count>10?windowStart/count*100:(list.scrollTop||0)/total*100)+'%');track.style.left=state.sidebar==='right'?'calc(100% + 15px)':'-22px'}
 let url=typeof state.banner==='string'?state.banner:'';if(!/^(https?:\/\/|data:image\/)/i.test(url))url='/assets/mirage-banner.png?v=19';
 if(url!==banner){banner=url;imageError.hidden=true;image.hidden=false;image.src=url}
}
function consume(payload){
 if(payload.connected&&payload.state){pending=payload.state;if(!frame)frame=requestAnimationFrame(()=>{frame=0;const state=pending;pending=null;draw(state)})}
 else{pending=null;if(frame){cancelAnimationFrame(frame);frame=0}menu.style.display='none';notice.hidden=false;notice.textContent='Waiting for Lua. Run menu_mirage_nui.lua, then open your menu.'}
}

let liveState=null,lastMessage=Date.now(),toastId=null,toastTimer=null,progressAnimation=null;
const notification=document.getElementById('nuiNotification'),bindsBox=document.getElementById('nuiBinds'),spectatorsBox=document.getElementById('nuiSpectators');
function syncNotificationOutline(){
 const svg=document.getElementById('notificationOutline'),rect=document.getElementById('notificationProgress');
 const w=notification.clientWidth,h=notification.clientHeight;
 if(!svg||!rect||!w||!h)return;
 svg.setAttribute('viewBox','0 0 '+w+' '+h);
 rect.setAttribute('x','1');rect.setAttribute('y','1');
 rect.setAttribute('width',String(Math.max(0,w-2)));rect.setAttribute('height',String(Math.max(0,h-2)));
 rect.setAttribute('rx',String(Math.min(5,(w-2)/2,(h-2)/2)));
 rect.removeAttribute('pathLength');
}
if(typeof ResizeObserver==='function')new ResizeObserver(syncNotificationOutline).observe(notification);
window.addEventListener('resize',syncNotificationOutline);
function hideWidgets(){notification.hidden=true;bindsBox.hidden=true;spectatorsBox.hidden=true}
function widgets(value){
 if(value)applyTheme(value.theme);
 if(!value||!value.enabled){hideWidgets();return}
 const binds=Array.isArray(value.binds)?value.binds:[],spectators=Array.isArray(value.spectators)?value.spectators:[];
 bindsBox.hidden=!value.bindsVisible||!binds.length;
 const bindRows=document.getElementById('bindRows');const bindsSignature=JSON.stringify(binds);
 if(bindRows.dataset.signature!==bindsSignature){bindRows.dataset.signature=bindsSignature;bindRows.replaceChildren();
 binds.forEach(bind=>{const line=el('div','bind-line');line.append(el('span','bind-label',t(bind.label)),el('span','bind-key',bind.toggle?'('+bind.key+')':bind.key));line.append(el('span','bind-state'+(bind.active?' on':'')+(bind.toggle?'':' action'),bind.toggle?(bind.active?'ON':'OFF'):''));bindRows.append(line)});}
 spectatorsBox.hidden=!value.spectatorsVisible;document.getElementById('spectatorsTitle').textContent='Spectators';
 const spectatorCount=document.getElementById('spectatorCount');if(spectatorCount)spectatorCount.textContent=String(spectators.length);
 const bindCount=document.getElementById('bindCount');if(bindCount)bindCount.textContent=String(binds.length);
 const spectatorRows=document.getElementById('spectatorRows');const spectatorsSignature=JSON.stringify(spectators.map(spec=>typeof spec==='string'?spec:{name:spec.name,distance:Number.isFinite(spec.distance)?Math.round(spec.distance):null}));
 if(spectatorRows.dataset.signature!==spectatorsSignature){spectatorRows.dataset.signature=spectatorsSignature;spectatorRows.replaceChildren();
 if(!spectators.length)spectatorRows.append(el('div','spectator-line empty','No spectators'));else spectators.forEach(spec=>{const item=typeof spec==='string'?{name:spec}:spec;const row=el('div','spectator-line');row.append(el('span','spectator-direction','↓'),el('span','spectator-name',item.name||'?'),el('span','spectator-distance',Number.isFinite(item.distance)?Math.round(item.distance)+'m':'—'));spectatorRows.append(row)});}
 const toast=value.toast;
 if(toast&&toast.id!==toastId){
  toastId=toast.id;notification.hidden=false;document.getElementById('notificationText').textContent=t(toast.text);
  notification.classList.remove('arrive');void notification.offsetWidth;notification.classList.add('arrive');
  syncNotificationOutline();
  const remaining=Math.max(0,Math.min(3000,Number(toast.remaining)||0));
  const progress=document.getElementById('notificationProgress');
  if(progressAnimation!==null)cancelAnimationFrame(progressAnimation);
  const started=performance.now();
  function drawCountdown(now){
   const left=Math.max(0,remaining-(now-started))/3000;
   const perimeter=progress.getTotalLength();
   progress.style.strokeDasharray=(perimeter*(1-left))+'px '+(perimeter+1)+'px';
   progress.style.strokeDashoffset='0';
   progressAnimation=left>0&&!notification.hidden?requestAnimationFrame(drawCountdown):null;
  }
  drawCountdown(started);
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>{notification.hidden=true},remaining);
 }
}
const authPanel=document.getElementById('nuiAuth');
function drawAuth(value){
 if(!value)return;applyTheme(value.theme);authPanel.hidden=!value.active;if(!value.active)return;
 menu.style.display='none';notice.hidden=true;
 document.getElementById('authSubtitle').textContent=value.confirm?'Recognized session':'Enter your authentication key';
 const input=document.getElementById('authInput');input.hidden=!!value.confirm;
 document.getElementById('authConfirm').hidden=!value.confirm;
 const length=Math.max(0,Math.min(128,Number(value.length)||0));
 document.getElementById('authMasked').textContent=length?'•'.repeat(length):'Enter your key…';
 input.classList.toggle('placeholder',!length);
 document.getElementById('authName').textContent=value.name||'Confirm this session?';
 document.getElementById('authConfirmYes').classList.toggle('selected',value.selected===1);
 document.getElementById('authConfirmChange').classList.toggle('selected',value.selected===2);
 document.getElementById('authError').textContent=t(value.error||'');
 document.getElementById('authHelp').textContent=value.confirm?'← / → Select · ENTER Confirm':'ENTER Confirm · CTRL+V Paste';
}
const loadingPanel=document.getElementById('nuiLoading');
function drawLoading(value){
 if(!value)return;applyTheme(value.theme);loadingPanel.hidden=!value.active;if(!value.active)return;
 menu.style.display='none';authPanel.hidden=true;notice.hidden=true;
 const percent=Math.max(0,Math.min(100,Number(value.progress)||0));
 document.getElementById('loadingPercent').textContent=Math.floor(percent)+'%';
 document.getElementById('loadingProgress').style.width=percent+'%';
 document.getElementById('loadingStatus').textContent=t(value.status||'Loading…');
}
const bindingPanel=document.getElementById('nuiBinding');
function drawBinding(value){
 if(!value)return;applyTheme(value.theme);bindingPanel.hidden=!value.active;if(!value.active)return;
 menu.style.display='none';authPanel.hidden=true;loadingPanel.hidden=true;notice.hidden=true;
 document.getElementById('bindingTitle').textContent=t(value.title||'MIRAGE');
 document.getElementById('bindingSubtitle').textContent=t(value.subtitle||'Press a key to assign');
 document.getElementById('bindingKey').textContent=t(value.key||'None');
 document.getElementById('bindingHelp').textContent=t(value.help||'ENTER Confirm · ESC Cancel');
}
window.addEventListener('message',event=>{
 let packet=event.data;if(typeof packet==='string'){try{packet=JSON.parse(packet)}catch{return}}
 if(!packet||packet.channel!=='mirage-ui-v3')return;
 lastMessage=Date.now();
 if(packet.action==='snapshot'&&packet.value&&Array.isArray(packet.value.rows)){liveState=packet.value;consume({connected:true,state:liveState})}
 else if(packet.action==='selection'&&liveState&&packet.value&&packet.value.menu===liveState.menu){liveState={...liveState,...packet.value};consume({connected:true,state:liveState})}
 else if(packet.action==='widgets')widgets(packet.value);
 else if(packet.action==='auth')drawAuth(packet.value);
 else if(packet.action==='loading')drawLoading(packet.value);
 else if(packet.action==='binding')drawBinding(packet.value);
});
const direct=new URLSearchParams(location.search).get('transport')==='direct';
if(direct){
 setInterval(()=>{if(Date.now()-lastMessage>1800){if(frame){cancelAnimationFrame(frame);frame=0}pending=null;menu.style.display='none';hideWidgets();authPanel.hidden=true;loadingPanel.hidden=true;bindingPanel.hidden=true;notice.hidden=false;notice.textContent='Waiting for Lapsus.SendNuiMessage. Make sure the updated Lua script is running.'}},500);
}else{
 const state={visible:true,menu:'MAIN',title:'Main',tabs:['Main','Exploit','Settings'],activeTab:1,rows:['Player','Online Menu','Combat','Weapon','Vehicle','Misc'].map((label,index)=>({label,index:index+1,submenu:true})),selected:1,start:1,maxDisplay:6,banner:'/assets/mirage-banner.png?v=19',scale:.83,position:1,sidebar:'left'};
 consume({connected:true,state});notice.hidden=false;notice.textContent='Local preview. In Lapsus, updates arrive directly through SendNuiMessage.';
 widgets({enabled:true,bindsVisible:true,binds:[{key:'H',label:'Solo Session',toggle:true,active:true}],spectatorsVisible:true,spectators:[]});
 window.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();state.selected=(state.selected-1+(event.key==='ArrowDown'?1:-1)+state.rows.length)%state.rows.length+1;consume({connected:true,state})}});
}
})();
