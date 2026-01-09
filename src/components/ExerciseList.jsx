import React from 'react';
import ExerciseItem from './ExerciseItem.jsx';
import { getRows } from '../utils/excel.jsx';

export default function ExerciseList({ workbook, sheetName }) {
  const rows = getRows(workbook, sheetName);

  const items = rows.slice(2).map((row, idx) => {
    const exerciseName = row[1];
    if (!exerciseName) return null;

    const set = row[2] ?? "";
    const reps = row[3] ?? "";
    let rir = "", kg = "", rest = 60, note = "", description = "";

    if (sheetName === "Warm Up") {
      rest = parseInt(row[4]) || 60;
      note = row[5] ?? "";
      description = row[6] ?? "";
    } else {
      rir = row[4] ?? "";
      kg = row[5] ?? "";
      rest = parseInt(row[6]) || 60;
      note = row[7] ?? "";
      description = row[8] ?? "";
    }

    return {
      key: `${sheetName}-${idx}`,
      name: exerciseName,
      set, reps, rir, kg, rest, note, description,
      cellAddress: { r: idx + 2, c: 1 }
    };
  }).filter(Boolean);

  return (
    <section id="content">
      <h3>{sheetName}</h3>
      {items.map(item => <ExerciseItem key={item.key} {...item} workbook={workbook} sheetName={sheetName} />)}
    </section>
  );
}
