// CLOCKS
function updateClocks() {
  const now = new Date();
  document.getElementById('denverTime').textContent =
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true }).format(now);
  document.getElementById('denverDate').textContent =
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(now);
  document.getElementById('japanTime').textContent =
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: false }).format(now);
  document.getElementById('japanDate').textContent =
    new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).format(now);
}
updateClocks();
setInterval(updateClocks, 1000);

// NIGHT MODE
const nightToggle = document.getElementById('nightToggle');
if (localStorage.getItem('nightMode') === 'true') {
  document.body.classList.add('night');
  nightToggle.textContent = '☀️ Day Mode';
}
nightToggle.addEventListener('click', () => {
  document.body.classList.toggle('night');
  const on = document.body.classList.contains('night');
  nightToggle.textContent = on ? '☀️ Day Mode' : '🌙 Night Mode';
  localStorage.setItem('nightMode', on);
});

// PINPAD
const pinDisplay = document.getElementById('pinDisplay');
const feedback = document.getElementById('feedback');
let entered = "";
const correctPIN = "0718";

function refreshDisplay() { pinDisplay.textContent = entered.replace(/./g, "•").padEnd(4, "-"); }
function clearPin() { entered = ""; refreshDisplay(); }
function submitPin() {
  if (entered === correctPIN) { showMonths(); }
  else { feedback.textContent = "Incorrect PIN"; setTimeout(() => { feedback.textContent = ""; }, 2000); }
  clearPin();
}
document.querySelectorAll(".pinpad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "clear") { clearPin(); }
    else if (action === "enter") { submitPin(); }
    else { if (entered.length < 4) { entered += btn.textContent; refreshDisplay(); } }
  });
});
refreshDisplay();

// MONTHS + NOTES
const monthsData = [
  { name: "September", days: 30, start: 18 },
  { name: "October", days: 31, start: 1 },
  { name: "November", days: 30, start: 1 },
  { name: "December", days: 31, start: 1 },
  { name: "January", days: 31, start: 1 },
  { name: "February", days: 14, start: 1 }
];

// Reverse months array to show February → September
const reversedMonths = monthsData.slice().reverse();

const notes = {
 "September-18": "I love you so much! I hope your first day in Japan has been going well! I can't wait to hear all about it my love! Nothing extensive today since you have a physical letter for your arrival at your apartment. I miss you so much! ʚ♡ɞ",
 "September-19": "Hello my love! I'm so sorry yesterday was so rough. You made it! You managed to say goodbye, got through both airports, managed through the trains and arrived at your apartment! This will only get easier! I saw the text about not being able to say hi to people and that's okay! Not everyone will be friendly right away! I'm sure you'll make some acquaintances on your flat soon! And i'm sure you'll make friends in classes too, that's where my besties have came from! We're all thinking of you, even my dad keeps asking me how you're doing! Have a wonderful day my love. 𐙚⋆°｡⋆♡",
 //"September-19": "Have a wonderful day today! I hope you have a lot of fun at character street today and I hope you find some super cute mofusand items! Can't wait to hear about your fantastic day, along with what you see and what you purchase. ♡",
 //"December-25": "Christmas 🎄",
 //"February-14": "Valentine's Day 💖"
};

const icons = {
  "September-18": "✈️",
  "September-19": "🏙️",
  //"September=20": "😸",
 // "December-25": "🎄",
//  "February-14": "💖"
};

// Today's predetermined note
const todayNote = {
  month: "September",
  day: 19,
  message: "Have a wonderful day today! I hope you have a lot of fun at character street today and I hope you find some super cute mofusand items! Can't wait to hear about your fantastic day, along with what you see and what you purchase. ♡"
};

// Show featured note
function showTodayNote() {
  const title = document.getElementById('todayNoteTitle');
  const text = document.getElementById('todayNoteText');
  title.textContent = `${todayNote.month} ${todayNote.day}`;
  text.textContent = todayNote.message;
}

// Show months page
function showMonths() {
  document.getElementById('loginCard').style.display = "none";
  document.getElementById('noteCard').style.display = "none";
  document.getElementById('monthsSection').style.display = "flex";
  document.body.classList.add('months-active');

  // Featured note
  showTodayNote();

  // Populate archive in descending order
  const archiveContainer = document.getElementById('archiveContainer');
  archiveContainer.innerHTML = "";

  reversedMonths.forEach(m => {
    for (let d = m.days; d >= m.start; d--) { // descending
      const key = `${m.name}-${d}`;
      if (notes[key]) {
        const archiveBtn = document.createElement("button");
        archiveBtn.textContent = `${m.name} ${d} ${icons[key] || ""}`;
        archiveBtn.style.background = "rgba(255,255,255,0.1)";
        archiveBtn.style.fontSize = "13px";
        archiveBtn.style.padding = "5px 10px";
        archiveBtn.style.color = "var(--text-color)";
        archiveBtn.style.borderRadius = "8px";
        archiveBtn.style.transition = "all 0.2s";
        archiveBtn.addEventListener("click", () => openNote(m.name, d));
        archiveContainer.appendChild(archiveBtn);
      }
    }
  });
}

// NOTE VIEWER
const noteCard = document.getElementById('noteCard');
const noteTitle = document.getElementById('noteTitle');
const noteText = document.getElementById('noteText');

function openNote(month, day) {
  const key = `${month}-${day}`;
  noteTitle.textContent = `${month} ${day}`;
  noteText.value = notes[key] || "";
  document.getElementById('monthsSection').style.display = "none";
  noteCard.style.display = "flex";
}

// BACK BUTTON
document.getElementById('backBtn').addEventListener("click", () => {
  noteCard.style.display = "none";
  showMonths();
});
