Assolutamente sì: posso ridisegnare **Fisio Rock** in **React** partendo dal tuo repo. Ti propongo un’architettura moderna basata su **Vite + React** con supporto **PWA** integrato, lettura dell’Excel con **SheetJS (xlsx)**, percorsi compatibili con **GitHub Pages** e una suddivisione in componenti che ricalca la logica del tuo attuale `app.js` (menu fogli, lista esercizi, timer, toggle header). Il repo attuale contiene `index.html`, `app.js`, `style.css`, `manifest.json` e l’Excel `fisiorock_block1.xlsx`, quindi l’app è perfetta per essere portata in React come SPA. [[github.com]](https://github.com/nucce/fisiorock-workouts)

Di seguito trovi:

1.  **Struttura progetto React (Vite)**
2.  **Componenti** con snippet principali
3.  **PWA**: manifest + service worker (con strategia network‑first per CSS)
4.  **Deploy su GitHub Pages** e gestione del `base`
5.  **Step-by-step** per migrazione

Se vuoi, al termine posso generarti un **pacchetto ZIP pronto** con tutti i file (React + Vite + PWA) per fare `npm install` e deploy.

----------

## 1) Struttura progetto (Vite + React)

Useremo Vite perché: build veloce, gestione asset, configurazione semplice del **`base`** per GitHub Pages e perfetta integrazione con plugin PWA. Per la pubblicazione dentro `/fisiorock-workouts/` va impostato `base: '/fisiorock-workouts/'` in `vite.config.js`. [[vite.dev]](https://vite.dev/guide/static-deploy), [[github.com]](https://github.com/vitejs/vite/blob/main/docs/guide/build.md)

```
fisiorock-react/
├─ package.json
├─ vite.config.js
├─ public/
│  ├─ fisiorock_block1.xlsx
│  ├─ manifest.json
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  ├─ icon-512.png
│  │  ├─ icon-maskable-192.png
│  │  └─ icon-maskable-512.png
│  └─ offline.html
├─ src/
│  ├─ main.jsx
│  ├─ App.jsx
│  ├─ components/
│  │  ├─ Header.jsx
│  │  ├─ Menu.jsx
│  │  ├─ ExerciseList.jsx
│  │  └─ ExerciseItem.jsx
│  ├─ hooks/
│  │  └─ useWorkbook.js
│  ├─ utils/
│  │  └─ excel.js
│  └─ styles/
│     └─ style.css
└─ sw.js

```

### `package.json`

```
{

"name":  "fisiorock-react",

"private":  true,

"version":  "0.0.1",

"scripts":  {

"dev":  "vite",

"build":  "vite build",

"preview":  "vite preview",

"build:gh":  "vite build --base=/fisiorock-workouts/"

},

"dependencies":  {

"react":  "^18.3.1",

"react-dom":  "^18.3.1",

"xlsx":  "^0.19.3"

},

"devDependencies":  {

"@vitejs/plugin-react":  "^4.2.0",

"vite":  "^5.0.0"

}

}
```

### `vite.config.js`

> Imposta `base` per GitHub Pages così gli asset e i fetch puntano al sottopath corretto. [[vite.dev]](https://vite.dev/guide/static-deploy), [[github.com]](https://github.com/vitejs/vite/blob/main/docs/guide/build.md)

```
import  {  defineConfig  }  from  'vite';

import  react  from  '@vitejs/plugin-react';


export  default  defineConfig({

base:  '/fisiorock-workouts/',

plugins:  [react()],

});
```

----------

## 2) Componenti e logica (porting da `app.js`)

### `src/main.jsx`

```
import  React  from  'react';

import  {  createRoot  }  from  'react-dom/client';

import  App  from  './App.jsx';

import  './styles/style.css';

createRoot(document.getElementById('root')).render(<App  />);
```

### `src/App.jsx`

Riprende le sezioni: header (con toggle), menu fogli e contenuto esercizi.

```
import  React,  {  useState  }  from  'react';

import  Header  from  './components/Header.jsx';

import  Menu  from  './components/Menu.jsx';

import  ExerciseList  from  './components/ExerciseList.jsx';

import  useWorkbook  from  './hooks/useWorkbook.js';

const  SHEETS  =  ["Warm Up",  "Pre Workout",  "Training 1",  "Training 2",  "Mobility"];

export  default  function  App()  {

const  {  workbook,  loading,  error  }  =  useWorkbook();

const  [sheetName,  setSheetName]  =  useState(SHEETS[0]);


if  (loading)  return  <div>Caricamento…</div>;

if  (error)  return  <div>Errore:  {String(error)}</div>;

if  (!workbook)  return  null;


return  (

<div  className="app">

<Header  />

<Menu  sheets={SHEETS}  current={sheetName}  onSelect={setSheetName}  />

<ExerciseList  workbook={workbook}  sheetName={sheetName}  />

</div>

);

}
```

### `src/hooks/useWorkbook.js`

Legge l’Excel da `public/` via `fetch + arrayBuffer` (approccio consigliato in browser; in React non si usa `readFile` di Node). [[docs.sheetjs.com]](https://docs.sheetjs.com/docs/demos/frontend/react/), [[stackoverflow.com]](https://stackoverflow.com/questions/65564533/cant-read-excel-file-in-sheetjs-react)

```
import  {  useEffect,  useState  }  from  'react';

import  {  read  }  from  'xlsx';


export  default  function  useWorkbook()  {

const  [workbook,  setWorkbook]  =  useState(null);

const  [loading,  setLoading]  =  useState(true);

const  [error,  setError]  =  useState(null);


useEffect(()  =>  {

const  url  =  new  URL(`</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{{responseHTML}}lt;/span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">import</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">.meta</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">.env</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">.BASE_URL</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">}</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">fisiorock_block1.xlsx`,  window.location.href);

fetch(url)

.then(r  =>  r.arrayBuffer())

.then(buf  =>  setWorkbook(read(buf)))

.catch(setError)

.finally(()  =>  setLoading(false));

},  []);

return  {  workbook,  loading,  error  };

}
```

### `src/components/Header.jsx`

Replica il toggle header con `localStorage`.

```
import  React,  {  useEffect,  useState  }  from  'react';

const  STATES  =  ['header-normal',  'header-compact'];

export  default  function  Header()  {

const  [stateIndex,  setStateIndex]  =  useState(0);

useEffect(()  =>  {

const  saved  =  localStorage.getItem('headerState');

if  (saved)  {

const  idx  =  STATES.indexOf(saved);

setStateIndex(idx  >=  0 ? idx  :  0);

}

},  []);

useEffect(()  =>  {

localStorage.setItem('headerState',  STATES[stateIndex]);

},  [stateIndex]);

const  toggle  =  ()  =>  setStateIndex((stateIndex  +  1)  %  STATES.length);

return  (

<header  id="appHeader"  className={STATES[stateIndex]}>

<h1>🏋️ Fisio  Rock</h1>

<button  id="toggleHeader"  title={stateIndex  ===  0 ? "Riduci intestazione"  :  "Mostra intestazione"}  onClick={toggle}>

{stateIndex  ===  0 ? "⬆️"  :  "⬇️"}

</button>

</header>

);

}
```

### `src/components/Menu.jsx`

```
import  React  from  'react';

export  default  function  Menu({  sheets,  current,  onSelect  })  {

return  (

<nav  id="menu">

{sheets.map(name  =>  (

<button  key={name}  className={current  ===  name ? 'active'  :  ''}  onClick={()  =>  onSelect(name)}>

{name}

</button>

))}

</nav>

);

}
```

### `src/utils/excel.js`

Parsing righe come nel tuo `app.js`.

```
import  {  utils  }  from  'xlsx';

export  function  getRows(workbook,  sheetName)  {

const  sheet  =  workbook.Sheets[sheetName];

if  (!sheet)  return  [];

return  utils.sheet_to_json(sheet,  {  header:  1,  defval:  ""  });

}

export  function  isLink(text)  {

return  typeof  text  ===  "string"  &&  text.startsWith("http");

}
```

### `src/components/ExerciseList.jsx`

```
import  React  from  'react';

import  ExerciseItem  from  './ExerciseItem.jsx';

import  {  getRows  }  from  '../utils/excel.js';

export  default  function  ExerciseList({  workbook,  sheetName  })  {

const  rows  =  getRows(workbook,  sheetName);

// salta le prime 2 righe come nel tuo script

const  items  =  rows.slice(2).map((row,  idx)  =>  {

const  exerciseName  =  row[1];

if  (!exerciseName)  return  null;

const  set  =  row[2] ?? "";

const  reps  =  row[3] ?? "";

let  rir  =  "",  kg  =  "",  rest  =  60,  note  =  "",  description  =  "";

if  (sheetName  ===  "Warm Up")  {

rest  =  parseInt(row[4])  ||  60;

note  =  row[5] ?? "";

description  =  row[6] ?? "";

}  else  {

rir  =  row[4] ?? "";

kg  =  row[5] ?? "";

rest  =  parseInt(row[6])  ||  60;

note  =  row[7] ?? "";

description  =  row[8] ?? "";

}

return  {

key:  `</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{{responseHTML}}lt;/span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">sheetName</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">}</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">-</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{{responseHTML}}lt;/span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">idx</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">}</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">`,

name:  exerciseName,

set,  reps,  rir,  kg,  rest,  note,  description,

// link al nome: usa l'hyperlink della cella B (col 1)

cellAddress:  {  r:  idx  +  2,  c:  1  }  // riga reale nel foglio

};

}).filter(Boolean);

return  (

<section  id="content">

<h3>{sheetName}</h3>

{items.map(item  =>  <ExerciseItem  key={item.key}  {...item}  workbook={workbook}  />)}

</section>

);

}
```

### `src/components/ExerciseItem.jsx`

Timer + vibrazione come nel tuo script.

```
import  React,  {  useEffect,  useRef,  useState  }  from  'react';

import  {  utils  }  from  'xlsx';

function  getHyperlink(workbook,  cellAddress,  sheetName)  {

const  sheet  =  workbook.Sheets[sheetName];

const  addr  =  utils.encode_cell__(cellAddress);_

_const  cell  =  sheet?.[addr];_

_return  cell?.l?.Target ?? "";_

_}_

export  default  function  ExerciseItem({  name,  set,  reps,  rir,  kg,  rest,  note,  description,  cellAddress,  workbook  })  {

const  [done,  setDone]  =  useState(false);

const  [remaining,  setRemaining]  =  useState(null);

const  [current,  setCurrent]  =  useState(false);

const  timerRef  =  useRef(null);

const  link  =  getHyperlink(workbook,  cellAddress,  workbook.SheetNames.find(()  =>  true));

useEffect(()  =>  ()  =>  clearInterval(timerRef.current),  []);

const  startRest  =  ()  =>  {

clearInterval(timerRef.current);

setCurrent(true);

setRemaining(rest);

timerRef.current  =  setInterval(()  =>  {

setRemaining(prev  =>  {

if  (prev  ===  null)  return  null;

if  (prev  <=  1)  {

clearInterval(timerRef.current);

navigator.vibrate?.([300,  150,  300]);

return  0;

}

return  prev  -  1;

});

},  1000);

};

  

return  (

<div  className={`exercise </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{{responseHTML}}lt;/span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">done</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}"> ? </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">'done'</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}"> </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">:</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}"> </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">''</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">}</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}"> </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{{responseHTML}}lt;/span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">current</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}"> ? </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">'current'</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}"> </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">:</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}"> </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">''</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">}</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">`}>

<div  className="title">

_{link ? <a  href={link}  target="_blank"  rel="noreferrer">{name}</a>  :  name}

</div>

<div  className="meta">

<strong>Set:</strong>  {set}

{reps  &&  <> · <strong>Reps:</strong>  {reps}</>}

{rir  &&  <> · <strong>RIR:</strong>  {rir}</>}

{kg  &&  <> · <strong>Kg:</strong>  {kg}</>}

<> · <strong>Rest:</strong>  {rest}s</>

</div>

{description  &&  <p  className="desc">{description}</p>}

{note?.startsWith('http')  &&  <p><a  href={note}  target="_blank"  rel="noreferrer">🎥 Video</a></p>}

<div  className="actions">

<label><input  type="checkbox"  checked={done}  onChange={e  =>  setDone(e.target.checked)}  />  Fatto</label>

<button  className="start-rest"  onClick={startRest}>⏱ Avvia  recupero</button>

<span  className="timer">{remaining  !==  null ? `⌛ </span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{{responseHTML}}lt;/span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">{</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">remaining</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">}</span><span attribution="{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;userInfo&quot;:{&quot;name&quot;:&quot;Copilot&quot;,&quot;oid&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;,&quot;id&quot;:&quot;E64C3D4F-5E12-4514-AD9B-893A6FAFD00C&quot;},&quot;timestamp&quot;:1767950700000,&quot;dataSource&quot;:0}">s`  :  ''}</span>

</div>

</div>

);

}
```

> Nota: se nel workbook i link sono in colonna **B** (indice 1), l’estrazione con `cell.l.Target` è corretta; l’uso di `fetch + arrayBuffer` è lo standard in browser/React per caricare XLSX. [[docs.sheetjs.com]](https://docs.sheetjs.com/docs/demos/frontend/react/), [[stackoverflow.com]](https://stackoverflow.com/questions/65564533/cant-read-excel-file-in-sheetjs-react)

----------

## 3) PWA: manifest + Service Worker

### `public/manifest.json`

`display: "standalone"` garantisce una finestra dedicata; ricorda di fornire **icone 192/512** e, se possibile, anche **maskable**. [[developer….ozilla.org]](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app), [[web.dev]](https://web.dev/articles/add-manifest)

```
{

"name":  "Fisio Rock",

"short_name"__:  "FisioRock",_

_"start_url":  "/fisiorock-workouts/",

"scope":  "/fisiorock-workouts/",

"display":  "standalone",

"background_color"__:  "#111111",_

_"theme_color":  "#111111",

"icons":  [

{  "src":  "/fisiorock-workouts/icons/icon-192.png",  "sizes":  "192x192",  "type":  "image/png",  "purpose":  "any"  },

{  "src":  "/fisiorock-workouts/icons/icon-maskable-192.png",  "sizes":  "192x192",  "type":  "image/png",  "purpose":  "maskable"  },

{  "src":  "/fisiorock-workouts/icons/icon-512.png",  "sizes":  "512x512",  "type":  "image/png",  "purpose":  "any"  },

{  "src":  "/fisiorock-workouts/icons/icon-maskable-512.png",  "sizes":  "512x512",  "type":  "image/png",  "purpose":  "maskable"  }

]

}
```

### Registrazione SW nel `index.html` (Vite genera un `index.html`)

```/fisiorock-workouts/manifest.json```

```
<meta name="theme-color" content="#111111">
<script>
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/fisiorock-workouts/sw.js');
}
</script>
```

### `sw.js` — **network‑first per CSS**, cache‑first per il resto

Come ti ho già proposto: migliora l’aggiornamento degli stili evitando “CSS vecchio” in offline; manteniamo cache‑first per HTML/JS/icones. (Il plugin **vite-plugin-pwa** può automatizzare molte di queste scelte ed è compatibile con Vite 5. Se preferisci, posso integrare il plugin e configurarlo per auto‑update). [[github.com]](https://github.com/vite-pwa/vite-plugin-pwa), [[npmjs.com]](https://www.npmjs.com/package/vite-plugin-pwa), [[github.com]](https://github.com/vite-pwa/docs)

```
const  CACHE_NAME_ _=  'fisiorock-v2';_
_const  CORE_ASSETS  =  [
	'/fisiorock-workouts/',
	'/fisiorock-workouts/index.html',
	'/fisiorock-workouts/manifest.json',
	'/fisiorock-workouts/icons/icon-192.png',
	'/fisiorock-workouts/icons/icon-512.png',
	'/fisiorock-workouts/offline.html'
];

self.addEventListener('install',  (event)  =>  {
	event.waitUntil(caches.open(CACHE_NAME__).then(cache  =>  cache.addAll(CORE_ASSETS)));
	self.skipWaiting();
});

self.addEventListener('activate',  (event)  =>  {
	event.waitUntil(caches.keys().then(keys  =>  Promise.all(keys.map(k  =>  (k  !==  CACHE_NAME__)  &&  caches.delete(k)))));_
	_self.clients.claim();_
_});_

function  isCSS(request)  {
	const  url  =  new  URL(request.url);
	return  url.pathname.endsWith('.css')  ||  request.headers.get('accept')?.includes('text/css');
}

// network-first per CSS; cache-first per il resto
self.addEventListener('fetch',  (event)  =>  {
	const  {  request  }  =  event;
	if  (request.method  !==  'GET')  return;
	if  (isCSS(request))  {
		event.respondWith(
			fetch(request).then(networkResponse  =>  {
				const  copy  =  networkResponse.clone();
				_caches.open(CACHE_NAME).then(cache  =>  cache.put(request,  copy));
				return  networkResponse;
			}).catch(()  =>  caches.match(request,  {  ignoreSearch:  true  }))
		);
		return;
	}

event.respondWith(
	caches.match(request,  {  ignoreSearch:  true  }).then(cached  =>  {
		return  cached  ||  fetch(request).then(networkResponse  =>  {
			if  (networkResponse.ok  &&  new  URL(request.url).origin  ===  self.location.origin)  {
				const  copy  =  networkResponse.clone();
				caches.open(CACHE_NAME).then(cache  =>  cache.put(request,  copy));
		}
		return  networkResponse;
	}).catch(()  =>  {
		if  (request.mode  ===  'navigate')  return  caches.match('/fisiorock-workouts/offline.html');
	});
})
);
});
```

> In alternativa, puoi usare **vite-plugin-pwa** che genera automaticamente SW e manifest (con Workbox dietro). È molto comodo e “zero‑config” per Vite 5. [[github.com]](https://github.com/vite-pwa/vite-plugin-pwa), [[npmjs.com]](https://www.npmjs.com/package/vite-plugin-pwa)

----------

## 4) Deploy su **GitHub Pages** (repo `/fisiorock-workouts`)

Con Vite devi:

-   impostare **`base: '/fisiorock-workouts/'`** (già fatto),
-   buildare e pubblicare la cartella `dist` su Pages. Puoi farlo con **GitHub Actions** come da guida Vite o blog post/guide dedicate. [[vite.dev]](https://vite.dev/guide/static-deploy), [[savaslabs.com]](https://savaslabs.com/blog/deploying-vite-github-pages-single-github-action)

Esempio workflow (`.github/workflows/deploy.yml`):

```
name:  Deploy Vite React App to GitHub Pages
on:
push:
branches:  [ "main" ]
workflow_dispatch:

permissions:
contents:  read
pages:  write
id-token:  write

jobs:
build:
runs-on:  ubuntu-latest
steps:
-  uses:  actions/checkout@v4
-  uses:  actions/setup-node@v4
with:  { node-version: '18' }
-  run:  npm ci
-  run:  npm run build:gh
-  uses:  actions/upload-pages-artifact@v3
with:
path:  ./dist
deploy:
runs-on:  ubuntu-latest
needs:  build
steps:
-  uses:  actions/deploy-pages@v4
- ```

> La doc Vite consiglia di impostare `base` a `/<REPO>/` per pubblicazione sotto sottocartella; i workflow Pages/GitHub Actions sono supportati. [[vite.dev]](https://vite.dev/guide/static-deploy), [[github.com]](https://github.com/vitejs/vite/blob/main/docs/guide/build.md), [[savaslabs.com]](https://savaslabs.com/blog/deploying-vite-github-pages-single-github-action)

----------

## 5) Migrazione: step-by-step

1.  **Crea progetto React** (`npm create vite@latest fisiorock-react --template react`) e copia `public/fisiorock_block1.xlsx` dal repo. [[dev.to]](https://dev.to/fab_builder/deploying-a-static-vite-react-app-a-complete-guide-1l76)
2.  **Aggiungi SheetJS** (`npm i xlsx`) e implementa `useWorkbook` con `fetch + arrayBuffer`. [[docs.sheetjs.com]](https://docs.sheetjs.com/docs/demos/frontend/react/), [[stackoverflow.com]](https://stackoverflow.com/questions/65564533/cant-read-excel-file-in-sheetjs-react)
3.  **Porta la logica di `app.js`** nei componenti `Menu`, `ExerciseList`, `ExerciseItem`, incluse vibrazione e timer.
4.  **Aggiungi PWA** (manifest, icone, SW o `vite-plugin-pwa`). [[github.com]](https://github.com/vite-pwa/vite-plugin-pwa), [[npmjs.com]](https://www.npmjs.com/package/vite-plugin-pwa), [[github.com]](https://github.com/vite-pwa/docs)
5.  **Configura Vite per Pages** (`base`) e **workflow** di deploy. [[vite.dev]](https://vite.dev/guide/static-deploy), [[savaslabs.com]](https://savaslabs.com/blog/deploying-vite-github-pages-single-github-action)
6.  **Verifica** con DevTools → Application → Manifest e con Lighthouse PWA.
7.  **Installa** la PWA su Android: deve aprirsi in **standalone** (senza barra indirizzi). [[developer….ozilla.org]](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Create_a_standalone_app), [[web.dev]](https://web.dev/articles/add-manifest)

----------

### Vuoi il progetto React già pronto come ZIP?

Posso generare un **ZIP** con:

-   `package.json`, `vite.config.js` (base già impostato),
-   `public/` con `manifest.json`, `offline.html`, icone,
-   `sw.js`,
-   `src/` con componenti e hook,
-   `styles/style.css`.

Lo scarichi, fai `npm i` e `npm run dev` → `npm run build:gh` per pubblicare. Dimmi se preferisci **PWA “manuale”** (SW come sopra) o **vite-plugin-pwa** (auto‑update + Workbox): il secondo riduce manutenzione e segue best practice PWA su Vite. [[github.com]](https://github.com/vite-pwa/vite-plugin-pwa), [[github.com]](https://github.com/vite-pwa/docs)

Se hai esigenze particolari (es. React Router, salvataggio progressi, persistenza locale delle sessioni, o UI con Tailwind/MUI), le integriamo facilmente nella struttura proposta.

----------------------

Perfetto! Ho creato lo **ZIP del progetto React + Vite + PWA** pronto per l’uso:

**Scarica:** fisiorock-react-pwa.zip

Contenuto principale:

-   `index.html` (template Vite con **registrazione SW** e **manifest** agganciato via `import.meta.env.BASE_URL`)
-   `vite.config.js` con `base: '/fisiorock-workouts/'` per **GitHub Pages** [[eu-prod.as…rosoft.com]](https://eu-prod.asyncgw.teams.microsoft.com/v1/objects/0-weu-d17-9438e85787966d83df600bcef508acb5/views/original/fisiorock-react-pwa.zip), [[docs.sheetjs.com]](https://docs.sheetjs.com/docs/demos/frontend/react/)
-   `package.json` (script `dev`, `build`, `build:gh`)
-   `public/manifest.json`, `public/offline.html`, `public/icons/*`
-   `sw.js` con **network-first per CSS** e **cache-first per resto** (come richiesto)
-   `src/` con **React components** (`Header`, `Menu`, `ExerciseList`, `ExerciseItem`), hook `useWorkbook` che carica l’Excel via `fetch + arrayBuffer` (modalità consigliata in browser/React)
-   `src/styles/style.css` (stili base)
-   `README.md` con istruzioni

> Nota: Nel pacchetto non è incluso il file **`fisiorock_block1.xlsx`**. Copialo nel percorso `public/fisiorock_block1.xlsx` dal tuo repo originale prima di avviare l’app. [[CodeInterpreter | PowerPoint]](https://eu-prod.asyncgw.teams.microsoft.com/v1/objects/0-weu-d16-972f631b8a8baca82d2b937d498f6d33/views/original/manifest.json)

----------

## Come avviare

1.  **Estrarre** lo zip.
2.  Copiare `fisiorock_block1.xlsx` in `public/`.
3.  Installare: npm  install
4.  **Dev:** npm  run  dev L’app si apre su `http://localhost:5173`. Il manifest e il service worker usano `import.meta.env.BASE_URL` per funzionare sia in dev sia in prod.
5.  **Build GitHub Pages:** npm  run  build:gh Pubblica la cartella `dist` su Pages (consigliato via **GitHub Actions**). Impostare `base: '/<repo>/'` è la pratica corretta per pubblicare sotto sottocartella su Pages. [[eu-prod.as…rosoft.com]](https://eu-prod.asyncgw.teams.microsoft.com/v1/objects/0-weu-d17-9438e85787966d83df600bcef508acb5/views/original/fisiorock-react-pwa.zip), [[deepwiki.com]](https://deepwiki.com/vite-pwa/vite-plugin-pwa/6-examples-and-use-cases)

----------

## Perché questa impostazione è corretta

-   **BASE URL per Pages:** Vite riscrive automaticamente gli asset e i percorsi quando `base` è configurato per una pubblicazione in sottocartella; è la soluzione raccomandata dalla documentazione ufficiale. [[eu-prod.as…rosoft.com]](https://eu-prod.asyncgw.teams.microsoft.com/v1/objects/0-weu-d17-9438e85787966d83df600bcef508acb5/views/original/fisiorock-react-pwa.zip), [[docs.sheetjs.com]](https://docs.sheetjs.com/docs/demos/frontend/react/)
-   **Caricamento Excel in React:** in ambiente browser/React si usa `fetch` + `arrayBuffer` (non `readFile` di Node) per leggere l’xlsx; questo è l’approccio indicato dalle guide SheetJS.
-   **PWA Standalone:** manifest con `display: "standalone"`, icone 192/512 e registrazione SW rendono l’app installabile e apribile **senza barra degli indirizzi**.

----------

### Vuoi che aggiunga anche il **workflow GitHub Actions** nel pacchetto?

Posso generare un file `.github/workflows/deploy.yml` pronto che builda e pubblica automaticamente su Pages (branch `main`). Dimmi se vuoi che lo includa e con quale branch.