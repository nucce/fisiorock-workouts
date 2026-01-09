import React, { useEffect, useRef, useState } from 'react';
//import { utils } from 'xlsx';
import * as XLSX from 'xlsx';

function getHyperlink(workbook, cellAddress, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  const addr = XLSX.utils.encode_cell(cellAddress);
  const cell = sheet?.[addr];
  return cell?.l?.Target ?? "";
}

export default function ExerciseItem({ name, set, reps, rir, kg, rest, note, description, cellAddress, workbook, sheetName }) {
  const [done, setDone] = useState(false);
  const [remaining, setRemaining] = useState(null);
  const [current, setCurrent] = useState(false);
  const timerRef = useRef(null);

  const link = getHyperlink(workbook, cellAddress, sheetName);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startRest = () => {
    clearInterval(timerRef.current);
    setCurrent(true);
    setRemaining(rest);
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timerRef.current);
          navigator.vibrate?.([300, 150, 300]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={`exercise ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
      <div className="title">
        {link ? <a href={link} target="_blank" rel="noreferrer">{name}</a> : name}
      </div>
      <div className="meta">
        <strong>Set:</strong> {set}
        {reps && <> · <strong>Reps:</strong> {reps}</>}
        {rir && <> · <strong>RIR:</strong> {rir}</>}
        {kg  && <> · <strong>Kg:</strong> {kg}</>}
        <> · <strong>Rest:</strong> {rest}s</>
      </div>
      {description && <p className="desc">{description}</p>}
      {note?.startsWith('http') && <p><a href={note} target="_blank" rel="noreferrer">🎥 Video</a></p>}
      <div className="actions">
        <label><input type="checkbox" checked={done} onChange={e => setDone(e.target.checked)} /> Fatto</label>
        <button className="start-rest" onClick={startRest}>⏱ Avvia recupero</button>
        <span className="timer">{remaining !== null ? `⌛ ${remaining}s` : ''}</span>
      </div>
    </div>
  );
}
