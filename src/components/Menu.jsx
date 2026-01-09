import React from 'react';

export default function Menu({ sheets, current, onSelect }) {
  return (
    <nav id="menu">
      {sheets.map(name => (
        <button key={name} className={current === name ? 'active' : ''} onClick={() => onSelect(name)}>
          {name}
        </button>
      ))}
    </nav>
  );}
