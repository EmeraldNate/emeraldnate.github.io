// Load photos from photos.json
async function loadPhotos() {
  try {
    const res = await fetch('photos.json');
    const photos = await res.json();
    const gallery = document.getElementById('gallery');

    photos.forEach(photo => {
      const img = document.createElement('img');
      img.src = photo.url;
      img.alt = photo.title || "Photo";
      img.addEventListener('click', () => openLightbox(photo));
      gallery.appendChild(img);
    });
  } catch (err) {
    console.error("Error loading photos:", err);
  }
}

// Lightbox functions
function openLightbox(photo) {
  const lightbox = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const caption = document.getElementById('lightboxCaption');

  img.src = photo.url;
  caption.textContent = `${photo.title || ''}${photo.caption ? ' - ' + photo.caption : ''}`;

  lightbox.classList.remove('hidden');
}

function closeLightbox() {
  document.getElementById('lightbox').classList.add('hidden');
}

document.getElementById('closeBtn').addEventListener('click', closeLightbox);
window.addEventListener('click', e => {
  if (e.target.id === 'lightbox') closeLightbox();
});

// Dark Mode Toggle with persistence
const toggleBtn = document.getElementById('darkModeToggle');

// Initialize dark mode based on localStorage
if (localStorage.getItem('darkMode') === 'enabled') {
  document.body.classList.add('dark-mode');
  toggleBtn.textContent = '☀️';
} else {
  toggleBtn.textContent = '🌙';
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
});

// Initialize gallery
loadPhotos();
