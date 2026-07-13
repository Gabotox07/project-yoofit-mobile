// ── Render user details from localStorage ──
const currentUserRaw = localStorage.getItem('currentUser');
if (currentUserRaw) {
  const currentUser = JSON.parse(currentUserRaw);
  const nameHeader = document.querySelector('.profile-info h2');
  const emailParagraph = document.querySelector('.profile-info p');
  if (nameHeader) {
    nameHeader.textContent = currentUser.name;
  }
  if (emailParagraph) {
    emailParagraph.textContent = currentUser.email;
  }
}

document.getElementById('btn-renew').addEventListener('click', function () {
      this.querySelector('.btn-text').textContent = 'Procesando…';
      setTimeout(() => {
        this.querySelector('.btn-text').textContent = '¡Renovado! ✓';
        this.style.background = '#22C55E';
        this.style.color = '#fff';
      }, 1200);
    });