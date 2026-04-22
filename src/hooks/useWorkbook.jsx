import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx'; // Importazione namespace completa per evitare problemi di bundling

export default function useWorkbook() {
  const [workbook, setWorkbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usiamo un segnale di aborto per evitare update su componenti smontati
    const controller = new AbortController();

    const loadWorkbook = async () => {
      try {
        const url = new URL(`${import.meta.env.BASE_URL}fisiorock_block4.xlsx`, window.location.href);
        console.log(`Tentativo di caricamento Excel da: ${url.toString()}`);

        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Errore HTTP! stato: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array' });

        setWorkbook(wb);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("Errore nel caricamento del workbook:", err);
          setError(err.message || "Impossibile caricare il file Excel");
        }
      } finally {
        setLoading(false);
      }
    };

    loadWorkbook();

    return () => controller.abort();
  }, []);

  return { workbook, loading, error };
}
