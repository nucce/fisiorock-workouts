import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/style.css';
import { registerSW } from 'virtual:pwa-register';

registerSW({immediate: true}); //registrazione SW gestita dal plugin

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);