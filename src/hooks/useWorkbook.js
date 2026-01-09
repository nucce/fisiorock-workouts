import { useEffect, useState } from 'react';
import { read } from 'xlsx';

export default function useWorkbook() {
  const [workbook, setWorkbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = new URL(`${import.meta.env.BASE_URL}fisiorock_block1.xlsx`, window.location.href);

    console.log(`Excel path: ${url.toString()}`);

    fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => setWorkbook(read(buffer)))
        .catch(setError)
        .finally(() => setLoading(false));
  }, []);

  return { workbook, loading, error };
}
