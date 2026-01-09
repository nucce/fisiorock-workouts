# Fisio Rock (React + Vite + PWA)

## Istruzioni
1. Copia `fisiorock_block1.xlsx` nella cartella **public/** (manca nel pacchetto).
2. Installa dipendenze: `npm install`
3. Sviluppo: `npm run dev`
4. Build per GitHub Pages: `npm run build:gh`
5. Pubblica la cartella `dist` su GitHub Pages (o usa il workflow Actions).

Il Service Worker usa *network-first* per i CSS e *cache-first* per il resto.
Gli asset PWA sono sotto `public/icons/` e il manifest è `public/manifest.json`.
