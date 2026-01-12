import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function Note({note}) {
    console.log(note);
    return (
        <Popup trigger={<span className="note-popup">📝</span>}
               position="right center">
            <div className="note-popup-body">{note}</div>
        </Popup>
    )
}