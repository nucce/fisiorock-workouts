const FILE="fisiorock_block1.xlsx";
const SHEETS = ["Warm Up", "Pre Workout", "Training 1", "Training 2", "Mobility"];

let workbook;
let currentExercise = null;
let timerInterval = null;

fetch(FILE)
  .then(r => r.arrayBuffer())
  .then(data => {
    workbook = XLSX.read(data);
    createMenu();
  });

function createMenu() {
  const menu = document.getElementById("menu");
  menu.innerHTML = "";

  SHEETS.forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.onclick = () => loadSheet(name);
    menu.appendChild(btn);
  });
}

function loadSheet(sheetName) {
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: ""
  });

  const content = document.getElementById("content");
  content.innerHTML = `<h2>${sheetName}</h2>`;

  rows.slice(2).forEach((row, index) => {
    const exerciseName = row[1];
    if (!exerciseName) return;

    // 🔗 recupero link dalla cella Excel
    const cellAddress = XLSX.utils.encode_cell({ r: index + 2, c: 1 });
    const cell = sheet[cellAddress];
    const exerciseLink = cell?.l?.Target || "";

    const set = row[2] || "";
    const reps = row[3] || "";
    const rest = parseInt(row[5]) || 60;
    const note = row[6] || "";
    const description = row[7] || "";

    const div = document.createElement("div");
    div.className = "exercise";

    const exerciseHtml = exerciseLink
      ? `<a href="${exerciseLink}" target="_blank"><strong>${exerciseName}</strong></a>`
      : `<strong>${exerciseName}</strong>`;

    div.innerHTML = `
      <label>
        <input type="checkbox" class="done-check">
        ${exerciseHtml}
      </label>

      <p>
        <b>Set:</b> ${set}
        ${reps ? ` | <b>Reps:</b> ${reps}` : ""}
        | <b>Rest:</b> ${rest}s
      </p>

      ${description ? `<p>${description}</p>` : ""}
      ${isLink(note) ? `<a href="${note}" target="_blank">🎥 Video</a>` : ""}

      <button class="start-rest">⏱ Avvia recupero</button>
      <div class="timer"></div>
    `;

    div.querySelector(".done-check").onchange = e =>
      div.classList.toggle("done", e.target.checked);

    div.querySelector(".start-rest").onclick = () =>
      startRestTimer(div, rest);

    content.appendChild(div);
  });
}

function setCurrentExercise(div) {
  document.querySelectorAll(".exercise").forEach(e => e.classList.remove("current"));
  div.classList.add("current");
  currentExercise = div;
}

function startRestTimer(div, seconds) {
  clearInterval(timerInterval);

  const timerEl = div.querySelector(".timer");
  let remaining = seconds;
  timerEl.textContent = `⏳ ${remaining}s`;

  timerInterval = setInterval(() => {
    remaining--;
    timerEl.textContent = `⏳ ${remaining}s`;

    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = "✅ Recupero finito!";
      vibrate();
    }
  }, 1000);
}

function vibrate() {
  if ("vibrate" in navigator) {
    navigator.vibrate([300, 150, 300]);
  }
}

function isLink(text) {
  return typeof text === "string" && text.startsWith("http");
}
