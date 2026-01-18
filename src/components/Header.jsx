import React, { useEffect, useState } from 'react';

const STATES = ['header-normal', 'header-compact'];

export default function Header() {
  const [stateIndex, setStateIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('headerState');
    if (saved) {
      const idx = STATES.indexOf(saved);
      setStateIndex(idx >= 0 ? idx : 0);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('headerState', STATES[stateIndex]);
  }, [stateIndex]);

  const toggle = () => setStateIndex((stateIndex + 1) % STATES.length);

  return (
    <header id="appHeader" className={STATES[stateIndex]}>
      <h1>🏋️ Fisio Rock</h1>
      <button id="toggleHeader" title={stateIndex === 0 ? "Riduci intestazione" : "Mostra intestazione"} onClick={toggle}>
        {stateIndex === 0 ? "⬆️" : "⬇️"}
      </button>
    </header>
  );
}
