let exerciseCount = 0;

// Map Spanish day names (option values) → English keys used in calendar.js
const DAY_MAP = {
  "lunes":     "monday",
  "martes":    "tuesday",
  "miércoles": "wednesday",
  "jueves":    "thursday",
  "viernes":   "friday",
  "sábado":    "saturday",
  "domingo":   "sunday"
};

document.addEventListener("DOMContentLoaded", () => {
  // Start with 2 exercise rows
  addExerciseRow();
  addExerciseRow();
});

// Add a new exercise row dynamically
function addExerciseRow() {
  exerciseCount++;
  const container = document.getElementById("exercises-container");

  const row = document.createElement("div");
  row.className = "exercise-row";
  row.id = `exercise-row-${exerciseCount}`;

  row.innerHTML = `
    <div class="exercise-row-header">
      <span class="exercise-row-label">Ejercicio ${exerciseCount}</span>
      <button type="button" class="remove-exercise-btn" onclick="removeExerciseRow(${exerciseCount})">Eliminar</button>
    </div>
    <div class="exercise-grid">
      <div class="form-group">
        <label class="form-label" for="ex-name-${exerciseCount}">Nombre</label>
        <input type="text" id="ex-name-${exerciseCount}"
          name="ex-name"
          placeholder="Ej: Press de Banca"
          required />
      </div>
      <div class="form-group">
        <label class="form-label" for="ex-sets-${exerciseCount}">Series</label>
        <input type="number" id="ex-sets-${exerciseCount}"
          name="ex-sets"
          placeholder="4"
          min="1" max="20"
          required />
      </div>
      <div class="form-group">
        <label class="form-label" for="ex-reps-${exerciseCount}">Reps</label>
        <input type="number" id="ex-reps-${exerciseCount}"
          name="ex-reps"
          placeholder="10"
          min="1" max="100"
          required />
      </div>
    </div>
  `;

  container.appendChild(row);
}

// Remove an exercise row by id
function removeExerciseRow(id) {
  const row = document.getElementById(`exercise-row-${id}`);
  if (!row) return;

  const container = document.getElementById("exercises-container");
  if (container.children.length <= 1) {
    showToast("⚠️ Debes tener al menos 1 ejercicio.", "#E55050");
    return;
  }

  row.style.opacity = "0";
  row.style.transform = "translateY(-8px)";
  row.style.transition = "all 0.25s ease";
  setTimeout(() => row.remove(), 250);
}

// Collect exercises from DOM
function collectExercises() {
  const container = document.getElementById("exercises-container");
  const rows = container.querySelectorAll(".exercise-row");
  const exercises = [];

  rows.forEach(row => {
    const nameInput  = row.querySelector('input[name="ex-name"]');
    const setsInput  = row.querySelector('input[name="ex-sets"]');
    const repsInput  = row.querySelector('input[name="ex-reps"]');

    const name = nameInput?.value.trim();
    const sets = parseInt(setsInput?.value) || 0;
    const reps = parseInt(repsInput?.value) || 0;

    if (name && sets > 0 && reps > 0) {
      exercises.push({ name, sets, reps });
    }
  });

  return exercises;
}

// Save routine to localStorage
function saveRoutine(e) {
  e.preventDefault();

  const name     = document.getElementById("routine-name").value.trim();
  const duration = parseInt(document.getElementById("routine-duration").value) || 0;
  const kcal     = parseInt(document.getElementById("routine-kcal").value)     || 0;
  const dayRaw   = document.getElementById("routine-day").value;
  const dayKey   = DAY_MAP[dayRaw.toLowerCase()] || dayRaw.toLowerCase();
  const exercises = collectExercises();

  // Validation
  if (!name) { showToast("⚠️ Por favor ingresa el nombre de la rutina.", "#E55050"); return; }
  if (duration <= 0) { showToast("⚠️ La duración debe ser mayor a 0 minutos.", "#E55050"); return; }
  if (kcal <= 0) { showToast("⚠️ Las calorías deben ser mayor a 0.", "#E55050"); return; }
  if (!dayRaw) { showToast("⚠️ Por favor selecciona un día.", "#E55050"); return; }
  if (exercises.length === 0) { showToast("⚠️ Agrega al menos 1 ejercicio válido.", "#E55050"); return; }

  const newRoutine = {
    id: Date.now(),
    name,
    duration,
    kcal,
    day: dayRaw,
    exercises,
    createdAt: new Date().toISOString()
  };

  // Append to existing routines
  const existing = JSON.parse(localStorage.getItem("customRoutines")) || [];
  existing.push(newRoutine);
  localStorage.setItem("customRoutines", JSON.stringify(existing));

  // Also save day-to-routine mapping for calendar
  const calendarData = JSON.parse(localStorage.getItem("calendarRoutines")) || {};
  if (!calendarData[dayKey]) calendarData[dayKey] = [];
  calendarData[dayKey].push({ id: newRoutine.id, name: newRoutine.name });
  localStorage.setItem("calendarRoutines", JSON.stringify(calendarData));

  showToast("✓ ¡Rutina guardada correctamente!");
  setTimeout(() => {
    window.location.href = "workout.html";
  }, 1400);
}

// Show a feedback toast
function showToast(message, color = "#22C55E") {
  // Remove any existing toast
  const existing = document.querySelector(".success-toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = "success-toast";
  toast.textContent = message;
  toast.style.background = color;
  toast.style.color = color === "#22C55E" ? "#000" : "#fff";

  document.querySelector(".screen").appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 350);
  }, 2500);
}
