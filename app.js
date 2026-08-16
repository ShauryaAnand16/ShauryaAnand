let current=new Date(2026,7,16),view="month";
const cal=document.getElementById("calendar"),day=document.getElementById("dayView"),title=document.getElementById("title"),info=document.getElementById("info"),date=document.getElementById("date");
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const parse=s=>{let [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
const order=d=>DAY_ORDER_BY_DATE[iso(d)]||null;
const status=d=>HOLIDAYS[iso(d)]?{holiday:true,reason:HOLIDAYS[iso(d)]}:order(d)?{working:true,day:order(d)}:{};
const events=d=>order(d)?TIMETABLE[order(d)]||[]:[];

function render(){
date.value=iso(current);
if(view==="month")month(); else if(view==="week")week(); else dayview();
}

function month(){
cal.className="grid";day.className="hidden";
title.textContent=current.toLocaleDateString("en-IN",{month:"long",year:"numeric"});
let st=status(current);info.textContent=st.working?`Day ${st.day}`:st.holiday?`Holiday • ${st.reason}`:"";
let first=new Date(current.getFullYear(),current.getMonth(),1),start=new Date(first);start.setDate(1-first.getDay());
let html=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=>`<div class="weekday">${x}</div>`).join("");
for(let i=0;i<42;i++){let d=new Date(start);d.setDate(start.getDate()+i);let s=status(d),ev="";
if(s.holiday)ev=`<div class="event holiday"><b>HOLIDAY</b><br>${s.reason}</div>`;
else if(s.working)ev=events(d).map(x=>`<div class="event ${x.type.toLowerCase()}"><div class="time">${x.time}</div><div>${x.subject}</div><div class="type">${x.type}</div><div class="loc">${x.location}</div></div>`).join("");
html+=`<div class="cell ${d.getMonth()!=current.getMonth()?"other":""} ${iso(d)===iso(new Date())?"today":""}" data-date="${iso(d)}"><div class="num">${d.getDate()}</div>${s.working?`<div class="order">Day ${s.day}</div>`:""}${ev}</div>`}
cal.innerHTML=html;document.querySelectorAll(".cell").forEach(x=>x.onclick=()=>{current=parse(x.dataset.date);view="day";render()});
}

function week(){
cal.className="grid";day.className="hidden";
let start=new Date(current);start.setDate(current.getDate()-current.getDay()),end=new Date(start);end.setDate(start.getDate()+6);
title.textContent=`${start.toLocaleDateString("en-IN",{day:"numeric",month:"short"})} – ${end.toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}`;
info.textContent="Week view • Click a day";
let html=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(x=>`<div class="weekday">${x}</div>`).join("");
for(let i=0;i<7;i++){let d=new Date(start);d.setDate(start.getDate()+i),s=status(d),ev=s.holiday?`<div class="event holiday"><b>HOLIDAY</b><br>${s.reason}</div>`:s.working?events(d).map(x=>`<div class="event ${x.type.toLowerCase()}"><div class="time">${x.time}</div><div>${x.subject}</div><div class="type">${x.type}</div></div>`).join(""):"<div class='event'><b>NO SCHEDULE</b></div>";html+=`<div class="cell" data-date="${iso(d)}"><div class="num">${d.getDate()}</div>${s.working?`<div class="order">Day ${s.day}</div>`:""}${ev}</div>`}
cal.innerHTML=html;document.querySelectorAll(".cell").forEach(x=>x.onclick=()=>{current=parse(x.dataset.date);view="day";render()});
}

function dayview(){
cal.className="hidden";day.className="daybox";
let s=status(current);title.textContent=current.toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long",year:"numeric"});info.textContent=s.working?`Day ${s.day}`:s.holiday?`Holiday • ${s.reason}`:"";
if(s.holiday){day.innerHTML=`<div class="dayrow"><div class="time">ALL DAY</div><div class="slot holiday"><div class="name">${s.reason}</div><div class="meta">University holiday</div></div></div>`;return}
let ev=events(current),html="";
for(let i=1;i<=12;i++){let x=ev.find(a=>a.slot===i);html+=`<div class="dayrow"><div class="time">Slot ${i}<br>${SLOTS[i]}</div><div class="slot ${x?x.type.toLowerCase():"free"}">${x?`<div><div class="name">${x.subject}</div><div class="meta"><b>${x.type}</b> • ${x.location}</div></div>`:`<div><div class="name">FREE</div><div class="meta">No scheduled class or lab</div></div>`}</div></div>`}
day.innerHTML=html;
}

document.getElementById("today").onclick=()=>{current=new Date();render()};
document.getElementById("prev").onclick=()=>{if(view==="month")current.setMonth(current.getMonth()-1);else if(view==="week")current.setDate(current.getDate()-7);else current.setDate(current.getDate()-1);render()};
document.getElementById("next").onclick=()=>{if(view==="month")current.setMonth(current.getMonth()+1);else if(view==="week")current.setDate(current.getDate()+7);else current.setDate(current.getDate()+1);render()};
document.querySelectorAll("[data-view]").forEach(b=>b.onclick=()=>{view=b.dataset.view;render()});
date.onchange=()=>{current=parse(date.value);render()};
render();
