    const pwInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-pw');
    const toggleImg = document.getElementById('toggle-pw-img');

    toggleBtn.addEventListener('click', () => {
      const isHidden = pwInput.type === 'password';
      pwInput.type = isHidden ? 'text' : 'password';
      toggleImg.src = isHidden ? 'assets/ocultar.png' : 'assets/vista.png';
    });

    function handleRegister() {
      const name     = document.getElementById('fullname').value.trim();
      const email    = document.getElementById('email').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const terms    = document.getElementById('terms').checked;

      if (!name || !email || !phone || !password || !terms) {
        const btn = document.getElementById('btn-register');
        btn.style.animation = 'shake .4s';
        btn.addEventListener('animationend', () => btn.style.animation = '', { once: true });
        return;
      }

      // Save user to localStorage
      const user = { name, email, phone, password };
      localStorage.setItem('registeredUser', JSON.stringify(user));

      const btn = document.getElementById('btn-register');
      btn.querySelector('.btn-text').textContent = 'Creando cuenta…';
      setTimeout(() => { window.location.href = 'index.html'; }, 900);
    }