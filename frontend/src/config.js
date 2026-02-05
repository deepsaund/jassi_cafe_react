// frontend/src/config.js
export const API_BASE = window.location.origin.includes('localhost:5173')
    ? '/api'
    : '/WEBSITE/public/api';
