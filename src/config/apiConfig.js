/**
 * Global API Configuration
 * Centralizing endpoints for the SOC Command System
 */
export const API_CONFIG = {
  // Base URL for your n8n or backend instance
  BASE_URL: "https://n8n.tenear.com",
  
  // Specific SOC endpoints
  ENDPOINTS: {
    LOGIN: "bank/auth/login",
    FETCH_INCIDENTS: "/bank/incidents",
    REPORT_INCIDENT: "/bank/log-incident",
    USER_LOGS: "/bank/auth/audit-logs"
  },

  // Request timeout in milliseconds (10s)
  TIMEOUT: 10000,
};
