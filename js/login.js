    const pwInput = document.getElementById('password');
    const toggleBtn = document.getElementById('toggle-pw');
    const toggleImg = document.getElementById('toggle-pw-img');

    toggleBtn.addEventListener('click', () => {
      const isHidden = pwInput.type === 'password';
      pwInput.type = isHidden ? 'text' : 'password';
      toggleImg.src = isHidden ? 'assets/ocultar.png' : 'assets/vista.png';
    });

    // Login handler (demo)
    function handleLogin() {
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        shakeBtn();
        return;
      }

      // Check registration details in localStorage
      const registeredUserRaw = localStorage.getItem('registeredUser');
      let loginSuccess = false;
      let userData = { name: "Juan Perez", email: "juancito_perez69@gmail.com" };

      if (registeredUserRaw) {
        const registeredUser = JSON.parse(registeredUserRaw);
        if (registeredUser.email === email && registeredUser.password === password) {
          loginSuccess = true;
          userData = registeredUser;
        }
      } else {
        // Fallback for default mockup details or any testing details
        loginSuccess = true;
        if (email !== "juancito_perez69@gmail.com") {
          userData = { name: email.split('@')[0], email: email };
        }
      }

      if (!loginSuccess && registeredUserRaw) {
        alert("Credenciales incorrectas. Inténtalo de nuevo o regístrate.");
        shakeBtn();
        return;
      }

      // Save logged in user
      localStorage.setItem('currentUser', JSON.stringify(userData));

      const btn = document.getElementById('btn-login');
      const btnText = btn.querySelector('.btn-text');
      if (btnText) {
        btnText.textContent = 'Cargando…';
      } else {
        btn.textContent = 'Cargando…';
      }
      setTimeout(() => { window.location.href = 'home.html'; }, 800);
    }

    function shakeBtn() {
      const btn = document.getElementById('btn-login');
      btn.style.animation = 'shake .4s';
      btn.addEventListener('animationend', () => btn.style.animation = '', { once: true });
    }