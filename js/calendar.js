// ── Calendar Page JS ─────────────────────────────────────
//
//  Features:
//   • Renders a full month calendar grid dynamically
//   • Navigate previous/next months
//   • Marks days with saved workouts (gold dot)
//   • Highlights today and selected day
//   • Shows day-detail panel with routines
//   • Weekly summary strip
//   • Reads custom routines from localStorage ("calendarRoutines")
// ────────────────────────────────────────────────────────

const MONTHS_ES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];
const DAYS_ES = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const DAYS_SHORT = ["L","M","X","J","V","S","D"];

// Default demo data if localStorage is empty
const DEMO_ROUTINES = {
  "monday":    [{ id: 1, name: "Pecho + Tríceps" }, { id: 2, name: "Cardio HIIT" }],
  "wednesday": [{ id: 3, name: "Espalda + Bíceps" }],
  "friday":    [{ id: 4, name: "Piernas + Glúteos" }],
  "saturday":  [{ id: 5, name: "Full Body" }],
};

const DAY_KEY_MAP = {
  0: "sunday", 1: "monday", 2: "tuesday", 3: "wednesday",
  4: "thursday", 5: "friday", 6: "saturday"
};

// Map day-of-week names (spanish) to keys
const DAY_NAME_TO_KEY = {
  lunes: "monday", martes: "tuesday", miercoles: "wednesday",
  jueves: "thursday", viernes: "friday", sabado: "saturday",
  domingo: "sunday"
};

let currentDate = new Date();
let selectedCell = null;
let selectedDateObj = null;

document.addEventListener("DOMContentLoaded", () => {
  renderCalendar(currentDate);
  renderWeeklySummary();

  document.getElementById("prev-month").addEventListener("click", () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderCalendar(currentDate);
  });

  document.getElementById("next-month").addEventListener("click", () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderCalendar(currentDate);
  });
});

// ── Get routines from localStorage (merge with demo) ───────
function getAllRoutines() {
  const stored = JSON.parse(localStorage.getItem("calendarRoutines")) || {};
  // Merge demo data (demo doesn't overwrite user data)
  const merged = { ...DEMO_ROUTINES };
  Object.keys(stored).forEach(key => {
    if (!merged[key]) merged[key] = [];
    // Avoid duplicates by id
    const existingIds = new Set(merged[key].map(r => r.id));
    stored[key].forEach(r => { if (!existingIds.has(r.id)) merged[key].push(r); });
  });
  return merged;
}

// ── Render the calendar grid ───────────────────────────
function renderCalendar(date) {
  const grid  = document.getElementById("days-grid");
  const label = document.getElementById("current-month-label");
  grid.innerHTML = "";

  const year  = date.getFullYear();
  const month = date.getMonth();

  label.textContent = `${MONTHS_ES[month]} ${year}`;

  const firstDay = new Date(year, month, 1);
  const lastDay  = new Date(year, month + 1, 0);
  const today    = new Date();

  // Monday-first: 0=Mon…6=Sun
  let startOffset = firstDay.getDay(); // 0=Sun…6=Sat
  startOffset = (startOffset === 0) ? 6 : startOffset - 1;

  const routines = getAllRoutines();

  // Empty leading cells
  for (let i = 0; i < startOffset; i++) {
    const empty = document.createElement("div");
    empty.className = "day-cell empty";
    grid.appendChild(empty);
  }

  // Day cells
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const cellDate = new Date(year, month, d);
    const cell = document.createElement("div");
    cell.className = "day-cell";
    cell.dataset.day = d;
    cell.dataset.ts = cellDate.getTime();

    const dayOfWeek = cellDate.getDay(); // 0=Sun…6=Sat
    const dayKey = DAY_KEY_MAP[dayOfWeek];
    const hasWorkout = routines[dayKey] && routines[dayKey].length > 0;

    // Today highlight
    const isToday = (cellDate.toDateString() === today.toDateString());
    if (isToday) cell.classList.add("today");

    if (hasWorkout) cell.classList.add("has-workout");

    const numSpan = document.createElement("span");
    numSpan.textContent = d;
    cell.appendChild(numSpan);

    const dot = document.createElement("span");
    dot.className = "dot";
    cell.appendChild(dot);

    cell.addEventListener("click", () => selectDay(cell, cellDate, dayKey));
    grid.appendChild(cell);
  }

  // If a day was selected in this month, re-select it
  if (selectedDateObj) {
    const selYear  = selectedDateObj.getFullYear();
    const selMonth = selectedDateObj.getMonth();
    if (selYear === year && selMonth === month) {
      const cells = grid.querySelectorAll(".day-cell:not(.empty)");
      const selDay = selectedDateObj.getDate();
      if (cells[selDay - 1]) {
        cells[selDay - 1].classList.add("selected");
        selectedCell = cells[selDay - 1];
      }
    }
  }
}

// ── Select a day and show detail panel ─────────────────
function selectDay(cell, dateObj, dayKey) {
  // Deselect previous
  if (selectedCell) selectedCell.classList.remove("selected");

  cell.classList.add("selected");
  selectedCell = cell;
  selectedDateObj = dateObj;

  showDayDetail(dateObj, dayKey);
  renderWeeklySummary(dateObj);
}

function showDayDetail(dateObj, dayKey) {
  const routines = getAllRoutines();
  const dayRoutines = routines[dayKey] || [];

  const section    = document.getElementById("day-detail-section");
  const container  = document.getElementById("day-routines-container");
  const emptyHint  = document.getElementById("empty-day-hint");
  const titleEl    = document.getElementById("day-detail-title");

  const dayOfWeek  = dateObj.getDay();
  const dayName    = DAYS_ES[(dayOfWeek === 0) ? 6 : dayOfWeek - 1];
  const dayNum     = dateObj.getDate();
  const monthName  = MONTHS_ES[dateObj.getMonth()];

  titleEl.textContent = `${dayName} ${dayNum} de ${monthName}`;

  container.innerHTML = "";
  emptyHint.style.display = "none";
  section.style.display = "block";

  if (dayRoutines.length === 0) {
    container.innerHTML = `
      <div class="no-workouts-msg">
        Sin entrenamientos este día.<br/>
        <a href="create-workout.html">+ Crear uno nuevo</a>
      </div>`;
    return;
  }

  const WORKOUT_EMOJIS = ["🏋️","🚴","🏃","💪","🧘","🤸","⚡","🔥"];

  dayRoutines.forEach((routine, i) => {
    const item = document.createElement("div");
    item.className = "day-routine-item";
    item.innerHTML = `
      <div class="day-routine-icon">${WORKOUT_EMOJIS[i % WORKOUT_EMOJIS.length]}</div>
      <div class="day-routine-info">
        <h4>${escapeHTML(routine.name)}</h4>
        <p>Toca para ver detalles</p>
      </div>
      <span class="day-routine-chevron">›</span>`;
    item.addEventListener("click", () => {
      window.location.href = "workout.html";
    });
    container.appendChild(item);
  });
}

// ── Weekly summary ─────────────────────────────────────
function renderWeeklySummary(referenceDate) {
  const ref = referenceDate || new Date();
  const routines = getAllRoutines();

  // Monday of reference week
  const dayOfWeek = ref.getDay();
  const diff = (dayOfWeek === 0) ? -6 : 1 - dayOfWeek;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() + diff);

  const grid = document.getElementById("summary-grid");
  grid.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = DAY_KEY_MAP[d.getDay()];
    const dayRoutines = routines[key] || [];
    const count = dayRoutines.length;

    const cell = document.createElement("div");
    cell.className = "summary-day" + (count > 0 ? " has-workout" : "");
    cell.innerHTML = `
      <div class="s-label">${DAYS_SHORT[i]}</div>
      <span class="s-icon">${count > 0 ? "🔥" : "–"}</span>
      <div class="s-count">${count > 0 ? count : ""}</div>`;
    grid.appendChild(cell);
  }
}

// ── Utilities ──────────────────────────────────────────
function escapeHTML(str) {
  return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}
