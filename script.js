// =====================
// CONFIGURATION
// =====================
const PHOTOS_JSON = "photos/photos.json"; // Path to your photos.json
const gallery = document.getElementById("gallery");

// Lightbox elements
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
const lbCaption = document.getElementById("lightboxCaption");

let photos = [];
let activeIdx = null;

// =====================
// DARK MODE TOGGLE
// =====================
const toggleBtn = document.querySelector(".dark-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// =====================
// HEADER SHRINK ON SCROLL
// =====================
const header = document.querySelector("header");
const title = document.querySelector(".hero-title");
window.addEventListener("scroll", () => {
  const scroll = window.scrollY;
  const maxFont = 8; // rem
  const minFont = 3; // rem
  const fontSize = Math.max(minFont, maxFont - scroll / 100);
  title.style.fontSize = fontSize + "rem";

  const maxPadding = 40;
  const minPadding = 10;
  const padding = Math.max(minPadding, maxPadding - scroll / 5);
  header.style.padding = padding + "px 20px";
});

// =====================
// LOAD PHOTOS
// =====================
async function loadPhotos() {
  try {
    const res = await fetch(PHOTOS_JSON);
    if (!res.ok) throw new Error("Failed to load photos.json");
    const data = await res.json();
    photos = Array.isArray(data.items) ? data.items : data;
    renderGallery();
  } catch (err) {
    console.error("Error loading photos:", err);
    gallery.innerHTML = `<p style="color:red;">Failed to load photos.</p>`;
  }
}

// =====================
// RENDER GALLERY
// =====================
function renderGallery() {
  gallery.innerHTML = "";
  photos.forEach((p, idx) => {
    const img = document.createElement("img");
    img.src = p.url;
    img.alt = p.title || "Photo";
    img.loading = "lazy";
    img.addEventListener("click", () => openLightbox(idx));
    gallery.appendChild(img);
  });
}

// =====================
// LIGHTBOX FUNCTIONS
// =====================
function openLightbox(idx) {
  activeIdx = idx;
  updateLightbox();
  lightbox.classList.remove("hidden");
}

function updateLightbox() {
  const p = photos[activeIdx];
  if (!p) return;
  lbImg.src = p.url;
  lbCaption.textContent = p.title || "";
}

function closeLightbox() {
  lightbox.classList.add("hidden");
  activeIdx = null;
}

// Close button and click outside image
lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation for lightbox
window.addEventListener("keydown", (e) => {
  if (lightbox.classList.contains("hidden")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") navigateLightbox(1);
  if (e.key === "ArrowLeft") navigateLightbox(-1);
});

function navigateLightbox(delta) {
  if (activeIdx == null) return;
  const next = activeIdx + delta;
  if (next >= 0 && next < photos.length) {
    activeIdx = next;
    updateLightbox();
  }
}

// =====================
// INIT
// =====================
loadPhotos();
