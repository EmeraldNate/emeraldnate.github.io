// =====================
// CONFIGURATION
// =====================
const PHOTOS_JSON = "photos.json"; // Path to your photos.json
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
  const newSize = Math.max(3, 6 - scroll / 100); // font-size from 6rem to 3rem
  const newPadding = Math.max(10, 40 - scroll / 5); // padding from 40px to 10px
  title.style.fontSize = newSize + "rem";
  header.style.padding = newPadding + "px 20px";
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
