const FILE="fisiorock_block1.xlsx";
const SHEETS=["Warm Up","Pre Workout","Training 1","Training 2","Mobility"];
let workbook;
fetch(FILE).then(r=>r.arrayBuffer()).then(d=>{
workbook=XLSX.read(d);createMenu();});
function createMenu(){
const m=document.getElementById("menu");
SHEETS.forEach(s=>{
const b=document.createElement("button");
b.textContent=s;b.onclick=()=>loadSheet(s);m.appendChild(b);});}
function loadSheet(n){
const sh=workbook.Sheets[n];
const rows=XLSX.utils.sheet_to_json(sh,{defval:""});
const c=document.getElementById("content");
c.innerHTML=`<h2>${n}</h2>`;
rows.slice(1).forEach(r=>{
if(!r["EXERCISE"])return;
const d=document.createElement("div");d.className="exercise";
d.innerHTML=`<h3>${r["EXERCISE"]}</h3>
<p><b>Set:</b>${r["SET"]} <b>Reps:</b>${r["REPS"]||""}</p>
${r["NOTE"]?.startsWith("http")?`<a href="${r["NOTE"]}" target="_blank">🎥 Video</a>`:""}`;
c.appendChild(d);});}
