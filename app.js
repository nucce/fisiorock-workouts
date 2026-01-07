const FILE="fisiorock_block1.xlsx";

const SHEETS = [
  "Warm Up",
  "Pre Workout",
  "Training 1",
  "Training 2",
  "Mobility"
];

let workbook;

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

  // 🔑 leggiamo come array di array
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: ""
  });

  const content = document.getElementById("content");
  content.innerHTML = `<h2>${sheetName}</h2>`;

  // saltiamo le prime 2 righe (titolo + header visivo)
  rows.slice(2).forEach(row => {
    const exercise = row[1];
    if (!exercise) return;

    const set = row[2] || "";
    const reps = row[3] || "";
    const rir = row[4] || "";
    const note = row[6] || "";
    const description = row[7] || "";

    const div = document.createElement("div");
    div.className = "exercise";

    div.innerHTML = `
      <h3>${exercise}</h3>
      <p>
        <strong>Set:</strong> ${set}
        ${reps ? ` | <strong>Reps:</strong> ${reps}` : ""}
        ${rir ? ` | <strong>RIR:</strong> ${rir}` : ""}
      </p>
      ${description ? `<p>${description}</p>` : ""}
      ${isLink(note) ? `<a href="${note}" target="_blank">🎥 Video</a>` : ""}
    `;

    content.appendChild(div);
  });
}

function isLink(text) {
  return typeof text === "string" && text.startsWith("http");
}
