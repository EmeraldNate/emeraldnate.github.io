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

function refreshDisplay() {
  pinDisplay.textContent = entered.replace(/./g, "•").padEnd(4, "-");
}
function clearPin() {
  entered = "";
  refreshDisplay();
}
function submitPin() {
  if (entered === correctPIN) {
    showMonths();
  } else {
    feedback.textContent = "Incorrect PIN";
    setTimeout(() => { feedback.textContent = ""; }, 2000);
  }
  clearPin();
}
document.querySelectorAll(".pinpad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const action = btn.dataset.action;
    if (action === "clear") { clearPin(); }
    else if (action === "enter") { submitPin(); }
    else {
      if (entered.length < 4) {
        entered += btn.textContent;
        refreshDisplay();
      }
    }
  });
});
refreshDisplay();

// MONTHS STRUCTURE
const monthsData = [
  { name: "September", days: 30, start: 18 },
  { name: "October", days: 31, start: 1 },
  { name: "November", days: 30, start: 1 },
  { name: "December", days: 31, start: 1 },
  { name: "January", days: 31, start: 1 },
  { name: "February", days: 14, start: 1 }
];
const reversedMonths = monthsData.slice().reverse();

// NOTES & ICONS (loaded from JSON)
let notes = {};
let icons = {};
let todayNote = null;

// Fetch external JSON
fetch("notes.json")
  .then(res => res.json())
  .then(data => {
    notes = data.notes || {};
    icons = data.icons || {};
    todayNote = data.todayNote || null;
  })
  .catch(err => console.error("Failed to load notes:", err));

// Show featured note
function showTodayNote() {
  if (!todayNote) return;
  const title = document.getElementById('todayNoteTitle');
  const text = document.getElementById('todayNoteText');
  title.textContent = `${todayNote.month} ${todayNote.day}`;
  text.textContent = todayNote.message;
}

// Show months page
function showMonths() {
  // If notes not loaded yet, wait a moment
  if (!todayNote || Object.keys(notes).length === 0) {
    setTimeout(showMonths, 100);
    return;
  }

  document.getElementById('loginCard').style.display = "none";
  document.getElementById('noteCard').style.display = "none";
  document.getElementById('monthsSection').style.display = "flex";
  document.body.classList.add('months-active');

  // Featured note
  showTodayNote();

  // Populate archive
  const archiveContainer = document.getElementById('archiveContainer');
  archiveContainer.innerHTML = "";

  reversedMonths.forEach(m => {
    for (let d = m.days; d >= m.start; d--) {
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
function showMonths() {
  if (!todayNote || Object.keys(notes).length === 0) {
    setTimeout(showMonths, 100);
    return;
  }

  const loginCard = document.getElementById('loginCard');
  const monthsSection = document.getElementById('monthsSection');

  // Apply fade-out to login card
  loginCard.classList.add('fade-out');

  // After fade-out duration, hide login and show months section
  setTimeout(() => {
    loginCard.style.display = "none";

    monthsSection.style.display = "flex";
    monthsSection.classList.add('fade-in');
    document.body.classList.add('months-active');

    // Featured note
    showTodayNote();

    // Populate archive
    const archiveContainer = document.getElementById('archiveContainer');
    archiveContainer.innerHTML = "";

    reversedMonths.forEach(m => {
      for (let d = m.days; d >= m.start; d--) {
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
  }, 750); // duration matches the CSS transition
}
