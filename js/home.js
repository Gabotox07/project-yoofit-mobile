// ── Render user name from localStorage ──
const currentUserRaw = localStorage.getItem('currentUser');
if (currentUserRaw) {
  const currentUser = JSON.parse(currentUserRaw);
  const nameSpan = document.querySelector('.header-left h1 span');
  if (nameSpan) {
    nameSpan.textContent = currentUser.name;
  }
}

// ── Render day circles ──
    const circles = document.getElementById('day-circles');
    const DAYS = 7;
    const DONE = 3;

    for (let i = 1; i <= DAYS; i++) {
      const el = document.createElement('div');
      el.className = 'day-circle ' + (i <= DONE ? 'done' : 'pending');
      if (i > DONE) el.textContent = i;
      circles.appendChild(el);
    }

    // ── Donut animation on load ──
    document.querySelectorAll('.donut-fill').forEach(circle => {
      const pct = parseInt(circle.dataset.pct) / 100;
      const circumference = 2 * Math.PI * 30; // r=30
      const offset = circumference * (1 - pct);
      // Start from full (no fill) and animate to target
      circle.style.strokeDashoffset = circumference;
      requestAnimationFrame(() => {
        setTimeout(() => {
          circle.style.strokeDashoffset = offset;
        }, 200);
      });
    });