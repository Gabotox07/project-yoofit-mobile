let timerInterval = null;
let secondsElapsed = 0;

document.addEventListener("DOMContentLoaded", () => {
  renderCustomRoutines();
});

// Render routines created by user stored in localStorage
function renderCustomRoutines() {
  const customRoutines = JSON.parse(localStorage.getItem("customRoutines")) || [];
  const container = document.getElementById("custom-routines-container");
  const section = document.getElementById("custom-routines-section");

  if (customRoutines.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  container.innerHTML = "";

  customRoutines.forEach((routine) => {
    const card = document.createElement("div");
    card.className = "routine-card";

    // Build exercises preview HTML
    let exercisesHtml = "";
    routine.exercises.forEach((ex) => {
      exercisesHtml += `
        <div class="exercise-item">
          <span class="ex-name">${ex.name}</span>
          <span class="ex-sets">${ex.sets} series x ${ex.reps} rep.</span>
        </div>
      `;
    });

    card.innerHTML = `
      <div class="routine-header-row">
        <div class="routine-badge">Personalizada</div>
        <div class="routine-meta">
          <span>⏱ ${routine.duration} min.</span>
          <span>🔥 ${routine.kcal} kcal.</span>
        </div>
      </div>
      <h3>${routine.name}</h3>
      <p class="routine-summary">${routine.exercises.length} ejercicios • Rutina creada por ti.</p>
      <div class="exercises-preview">
        ${exercisesHtml}
      </div>
      <button class="btn-start-routine" onclick="startRoutine('${routine.name}')">Empezar Rutina ›</button>
    `;

    container.appendChild(card);
  });
}

// Start simulated workout
function startRoutine(name) {
  const overlay = document.getElementById("workout-overlay");
  const routineTitle = document.getElementById("overlay-routine-name");
  
  routineTitle.textContent = name;
  overlay.classList.add("active");

  secondsElapsed = 0;
  updateTimerDisplay();

  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    secondsElapsed++;
    updateTimerDisplay();
  }, 1000);
}

// Update overlay clock
function updateTimerDisplay() {
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const displayStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  document.getElementById("timer-display").textContent = displayStr;
}

// Close workout session overlay
function stopRoutine() {
  if (confirm("¿Estás seguro de que deseas cancelar este entrenamiento? Tu progreso no se guardará.")) {
    closeOverlay();
  }
}

// Complete workout session overlay
function finishRoutine() {
  alert("¡Felicitaciones! Has completado el entrenamiento con éxito. ¡Sigue así!");
  closeOverlay();
}

function closeOverlay() {
  const overlay = document.getElementById("workout-overlay");
  overlay.classList.remove("active");
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}
