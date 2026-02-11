/**
 * Global API Configuration
 * Centralizing endpoints for the SOC Command System
 */
export const API_CONFIG = {
  // Base URL for your n8n or backend instance
  BASE_URL: "https://n8n.tenear.com",
  
  // Specific SOC endpoints
  ENDPOINTS: {
    LOGIN: "webhook/bank/auth/login",
    FETCH_INCIDENTS: "webhook/bank/incidents",
    REPORT_INCIDENT: "webhook/bank/log-incident",
    USER_LOGS: "webhook/bank/auth/audit-logs"
  },

  // Request timeout in milliseconds (10s)
  TIMEOUT: 10000,
};
