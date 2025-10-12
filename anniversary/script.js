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
setInterval(updateClocks, 1000);
updateClocks();

// SPARKLES
for (let i = 0; i < 60; i++) {
  const s = document.createElement('div');
  s.className = 'sparkle';
  s.style.top = Math.random() * 100 + 'vh';
  s.style.left = Math.random() * 100 + 'vw';
  s.style.width = s.style.height = (Math.random() * 2 + 1) + 'px';
  s.style.animationDuration = (Math.random() * 5 + 3) + 's';
  document.body.appendChild(s);
}

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lightboxContent = lightbox.querySelector('.lightbox-content');
const closeBtn = lightbox.querySelector('.close');

document.querySelectorAll('.media img, .media video').forEach(media => {
  media.addEventListener('click', () => {
    const clone = media.cloneNode(true);
    clone.removeAttribute('style');
    if (clone.tagName === 'VIDEO') { clone.setAttribute('controls',''); clone.play(); }
    lightboxContent.innerHTML = '';
    lightboxContent.appendChild(clone);
    lightbox.style.display = 'flex';
  });
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
  lightboxContent.innerHTML = '';
});

lightbox.addEventListener('click', e => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
    lightboxContent.innerHTML = '';
  }
});
