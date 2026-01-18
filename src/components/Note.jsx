import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function Note({note}) {
    return (
        <Popup trigger={<span className="note-popup">📝</span>}
               position="right center" modal={true}>
            <div className="note-popup-body">{note}</div>
        </Popup>
    )
}