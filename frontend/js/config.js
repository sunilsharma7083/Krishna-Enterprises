// API Configuration - Shared across all frontend files
// For local development, use localhost
// For production, use Render URL
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://krishna-enterprises-9oup.onrender.com/api';
