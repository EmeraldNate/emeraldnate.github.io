const PHOTOS_JSON = "photos/photos.json"; // path to your JSON file
const gallery = document.getElementById("gallery");

// Lightbox elements
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbClose = document.getElementById("lbClose");
const lbCaption = document.getElementById("lightboxCaption");

let photos = [];
let activeIdx = null;

// DARK MODE TOGGLE WITH EMOJI
const toggleBtn = document.querySelector(".dark-toggle");

function updateToggleEmoji() {
  if (document.body.classList.contains("dark-mode")) {
    toggleBtn.textContent = "🌙"; // dark mode active
  } else {
    toggleBtn.textContent = "🌞"; // light mode active
  }
}

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  updateToggleEmoji();
});

// initialize emoji on page load
updateToggleEmoji();

// LOAD PHOTOS
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

// RENDER GALLERY
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

// LIGHTBOX
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

// CLOSE LIGHTBOX EVENTS
lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

// KEYBOARD NAVIGATION
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

// INIT
loadPhotos();
