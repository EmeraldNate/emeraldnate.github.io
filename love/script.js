// CLOCKS
function updateClocks(){
  const now = new Date();
  document.getElementById('denverTime').textContent =
    new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',hour:'numeric',minute:'2-digit',second:'2-digit',hour12:true}).format(now);
  document.getElementById('denverDate').textContent =
    new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',weekday:'short',year:'numeric',month:'short',day:'numeric'}).format(now);
  document.getElementById('japanTime').textContent =
    new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',hour:'numeric',minute:'2-digit',second:'2-digit',hour12:false}).format(now);
  document.getElementById('japanDate').textContent =
    new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Tokyo',weekday:'short',year:'numeric',month:'short',day:'numeric'}).format(now);
}
updateClocks(); setInterval(updateClocks,1000);

// NIGHT MODE
const nightToggle = document.getElementById('nightToggle');
if(localStorage.getItem('nightMode')==='true'){
  document.body.classList.add('night');
  nightToggle.textContent = '☀️ Day Mode';
}
nightToggle.addEventListener('click',()=>{
  document.body.classList.toggle('night');
  const on = document.body.classList.contains('night');
  nightToggle.textContent = on ? '☀️ Day Mode':'🌙 Night Mode';
  localStorage.setItem('nightMode',on);
});

// PINPAD
const pinDisplay = document.getElementById('pinDisplay');
const feedback = document.getElementById('feedback');
let entered = "";
const correctPIN = "1018";

function refreshDisplay(){ pinDisplay.textContent = entered.replace(/./g,"•").padEnd(4,"-"); }
function clearPin(){ entered = ""; refreshDisplay(); }
function submitPin(){
  if(entered === correctPIN){ showMonths(); }
  else{ feedback.textContent = "Incorrect PIN"; setTimeout(()=>{feedback.textContent="";},2000);}
  clearPin();
}
document.querySelectorAll(".pinpad button").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const action = btn.dataset.action;
    if(action==="clear"){ clearPin(); }
    else if(action==="enter"){ submitPin(); }
    else{ if(entered.length<4){ entered+=btn.textContent; refreshDisplay(); } }
  });
});
refreshDisplay();

// MONTHS + NOTES
const monthsData = [
  {name:"September",days:30,start:17},
  {name:"October",days:31,start:1},
  {name:"November",days:30,start:1},
  {name:"December",days:31,start:1},
  {name:"January",days:31,start:1},
  {name:"February",days:14,start:1}
];

const notes = {
  "September-17":"Let's go for coffee ☕",
  "September-20":"Movie night 🎬",
  "October-1":"Birthday 🎉",
  "December-25":"Christmas 🎄",
  "February-14":"Valentine's Day 💖"
};

const icons = {
  "September-17":"💌",
  "September-20":"🎥",
  "October-1":"🎂",
  "December-25":"🎄",
  "February-14":"💖"
};

const monthsContainer = document.getElementById('monthsContainer');

function updateDayButtonStyle(button,key){
  if(notes[key]) {
    button.classList.add("marked");
    button.textContent = `${button.textContent} ${icons[key]}`;
  } else { button.classList.remove("marked"); }
}

function showMonths(){
  document.getElementById('loginCard').style.display = "none";
  document.getElementById('noteCard').style.display = "none";
  document.getElementById('monthsCard').style.display = "flex";
  monthsContainer.innerHTML="";
  
  // Add class to hide footer
  document.body.classList.add('months-active');

  monthsData.forEach(m=>{
    const mdiv=document.createElement("div"); mdiv.className="month";
    const h=document.createElement("h3"); h.textContent=m.name; mdiv.appendChild(h);
    const daysDiv=document.createElement("div"); daysDiv.className="days";
    for(let d=m.start; d<=m.days; d++){
      const b=document.createElement("button"); b.textContent=d;
      const key=`${m.name}-${d}`; updateDayButtonStyle(b,key);
      b.addEventListener("click",()=>openNote(m.name,d));
      daysDiv.appendChild(b);
    }
    mdiv.appendChild(daysDiv);
    monthsContainer.appendChild(mdiv);
  });
}

// NOTES
const noteCard=document.getElementById('noteCard');
const monthsCard=document.getElementById('monthsCard');
const noteTitle=document.getElementById('noteTitle');
const noteText=document.getElementById('noteText');

function openNote(month,day){
  const key=`${month}-${day}`;
  noteTitle.textContent=`${month} ${day}`;
  noteText.value = notes[key] || "";
  monthsCard.style.display="none";
  noteCard.style.display="flex";
  
  // Keep footer hidden while viewing a note
  document.body.classList.add('months-active');
}

document.getElementById('backBtn').addEventListener("click",()=>{
  noteCard.style.display="none";
  showMonths();
});

// Optional: reset body class when returning to login page
function showLogin(){
  document.getElementById('loginCard').style.display = "flex";
  document.getElementById('monthsCard').style.display = "none";
  document.getElementById('noteCard').style.display = "none";
  
  document.body.classList.remove('months-active');
}
