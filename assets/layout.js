(()=>{
'use strict';
const key='mirage-layout-v1';
const definitions=[
 ['menu','.menu','.banner,.heading,.footer'],
 ['binds','#nuiBinds','header'],
 ['spectators','#nuiSpectators','header'],
 ['notification','#nuiNotification',null],
 ['authentication','#nuiAuth','.auth-header'],
 ['loading','#nuiLoading','.loading-header'],
 ['binding','#nuiBinding','.binding-header']
];
let positions={},editing=false,drag=null,resetVersion=null,raf=0;
try{const saved=JSON.parse(localStorage.getItem(key)||'{}');if(saved&&typeof saved==='object'&&!Array.isArray(saved))positions=saved}catch{}
const panels=new Map();
const toolbar=document.createElement('div');toolbar.className='layout-toolbar';toolbar.hidden=true;
const hint=document.createElement('span');hint.textContent='Drag panel headers · ESC: finish';
const reset=document.createElement('button');reset.type='button';reset.textContent='Reset positions';
toolbar.append(hint,reset);document.body.append(toolbar);
function save(){try{localStorage.setItem(key,JSON.stringify(positions))}catch{}}
function place(panel,x,y){
 const rect=panel.node.getBoundingClientRect();
 // Keep a usable header onscreen even when a submenu grows taller than the viewport.
 x=Math.max(8,Math.min(Math.max(8,innerWidth-rect.width-8),x));
 y=Math.max(8,Math.min(Math.max(8,innerHeight-Math.min(rect.height,60)-8),y));
 panel.node.style.left=x+'px';panel.node.style.top=y+'px';
 panel.node.style.right='auto';panel.node.style.bottom='auto';
 if(panel.id!=='menu')panel.node.style.transform='none';
 return {x:x/Math.max(1,innerWidth),y:y/Math.max(1,innerHeight)};
}
function apply(id){
 const panel=panels.get(id),saved=positions[id];
 if(panel&&saved&&Number.isFinite(saved.x)&&Number.isFinite(saved.y)){
  place(panel,saved.x*innerWidth,saved.y*innerHeight);
 }
}
function finish(){
 if(!drag)return;
 if(raf){cancelAnimationFrame(raf);raf=0}
 const current=drag;drag=null;
 positions[current.panel.id]=place(current.panel,current.x,current.y);save();
 document.body.classList.remove('dragging');
 try{current.handle.releasePointerCapture(current.pointerId)}catch{}
}
function resetPositions(){
 finish();positions={};save();
 for(const panel of panels.values())for(const prop of ['left','top','right','bottom','transform','width']){
  panel.node.style[prop]=panel.original[prop];
 }
 window.dispatchEvent(new Event('resize'));
}
for(const [id,selector,handleSelector] of definitions){
 const node=document.querySelector(selector);if(!node)continue;
 const original={};for(const prop of ['left','top','right','bottom','transform','width'])original[prop]=node.style[prop];
 const panel={id,node,original};panels.set(id,panel);node.dataset.layoutId=id;
 const handles=handleSelector?node.querySelectorAll(handleSelector):[node];
 for(const handle of handles){
  handle.dataset.dragHandle='true';
  handle.addEventListener('pointerdown',event=>{
   if(!editing||event.button!==0)return;
   event.preventDefault();finish();
   const rect=node.getBoundingClientRect();
   // Freeze content width before removing a right-hand anchor.
   node.style.width=node.offsetWidth+'px';
   place(panel,rect.left,rect.top);
   drag={panel,handle,pointerId:event.pointerId,dx:event.clientX-rect.left,dy:event.clientY-rect.top,x:rect.left,y:rect.top};
   handle.setPointerCapture(event.pointerId);document.body.classList.add('dragging');
  });
 }
 apply(id);
}
window.addEventListener('pointermove',event=>{
 if(!drag||event.pointerId!==drag.pointerId)return;
 drag.x=event.clientX-drag.dx;drag.y=event.clientY-drag.dy;
 if(!raf)raf=requestAnimationFrame(()=>{raf=0;if(drag)place(drag.panel,drag.x,drag.y)});
});
window.addEventListener('pointerup',finish);
window.addEventListener('pointercancel',finish);
window.addEventListener('blur',finish);
window.addEventListener('resize',()=>{for(const id of panels.keys())apply(id)});
reset.addEventListener('click',resetPositions);
function setEditing(value){
 editing=value===true;document.body.classList.toggle('layout-editing',editing);toolbar.hidden=!editing;
 if(!editing)finish();
}
window.addEventListener('message',event=>{
 let packet=event.data;if(typeof packet==='string'){try{packet=JSON.parse(packet)}catch{return}}
 if(!packet||packet.channel!=='mirage-ui-v3'||packet.action!=='layout'||!packet.value)return;
 if(resetVersion!==null&&resetVersion!==packet.value.reset)resetPositions();
 resetVersion=packet.value.reset;setEditing(packet.value.editing);
});
window.addEventListener('keydown',event=>{if(event.key==='Escape'&&editing){event.preventDefault();finish()}});
// Preview can use the same editor without Lapsus input focus.
if(new URLSearchParams(location.search).get('transport')!=='direct'){
 window.addEventListener('keydown',event=>{if(event.key==='F10'){event.preventDefault();setEditing(!editing)}else if(event.key==='Escape')setEditing(false)});
}
window.MirageLayout={apply};
})();
