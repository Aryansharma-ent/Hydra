// Centralized API Base URL config that dynamically uses VITE_API_URL in production or falls back to http://localhost:8000 in development.
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 
  import.meta.env.VITE_API_BASE_URL || 
  "http://localhost:8000"
).replace(/\/$/, "");
