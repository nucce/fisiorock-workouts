import React, { useState } from 'react';
import Header from './components/Header.jsx';
import Menu from './components/Menu.jsx';
import ExerciseList from './components/ExerciseList.jsx';
import useWorkbook from './hooks/useWorkbook.jsx';

const SHEETS = ["Warm Up", "Pre Workout", "Training 1", "Training 2", "Mobility"];

export default function App() {
    const { workbook, loading, error } = useWorkbook();
    const [sheetName, setSheetName] = useState(SHEETS[0]);

    if (loading) return <div>Caricamento…</div>;
    if (error) return <div>Errore: {String(error)}</div>;
    if (!workbook) return null;

    return (
        <div className="app">
            <Header />
            <Menu sheets={SHEETS} current={sheetName} onSelect={setSheetName} />
            <ExerciseList workbook={workbook} sheetName={sheetName} />
        </div>
    );
}
