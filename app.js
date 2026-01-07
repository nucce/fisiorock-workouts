const FILE="fisiorock_block1.xlsx";

const SHEETS = [
  "Warm Up",
  "Pre Workout",
  "Training 1",
  "Training 2",
  "Mobility"
];

let workbook;

// Carica Excel
fetch(FILE)
  .then(res => res.arrayBuffer())
  .then(data => {
    workbook = XLSX.read(data);
    createMenu();
  });

function createMenu() {
  const menu = document.getElementById("menu");

  SHEETS.forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.onclick = () => loadSheet(name);
    menu.appendChild(btn);
  });
}

function loadSheet(sheetName) {
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });

  const content = document.getElementById("content");
  content.innerHTML = `<h2>${sheetName}</h2>`;

  rows.slice(1).forEach(row => {
    if (!row["EXERCISE"]) return;

    const div = document.createElement("div");
    div.className = "exercise";

    div.innerHTML = `
      <h3>${row["EXERCISE"]}</h3>
      <p>
        <strong>Set:</strong> ${row["SET"]} |
        <strong>Reps:</strong> ${row["REPS"] || ""} |
        <strong>RIR:</strong> ${row["RIR"] || ""}
      </p>
      ${row["DESCRIPTION"] ? `<p>${row["DESCRIPTION"]}</p>` : ""}
      ${isLink(row["NOTE"]) ? `<a href="${row["NOTE"]}" target="_blank">🎥 Video</a>` : ""}
    `;

    content.appendChild(div);
  });
}

function isLink(text) {
  return typeof text === "string" && text.startsWith("http");
}
