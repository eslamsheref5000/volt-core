// Global Configuration
// VITE_API_URL should be set in .env or Vercel Environment Variables
// Failover to provided Ngrok URL for production access
// Failover to local proxy for Vercel
export const API_URL = import.meta.env.VITE_API_URL || "/api/rpc"; 
