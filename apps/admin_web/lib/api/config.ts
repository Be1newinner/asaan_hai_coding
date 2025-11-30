// API Configuration with Test/Production mode switching
// Default to test mode unless NEXT_PUBLIC_API_MODE is set to 'production'

export const API_MODE = process.env.NEXT_PUBLIC_API_MODE || "test";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const isTestMode = () => API_MODE === "test";
export const isProductionMode = () => API_MODE === "production";

export const getApiUrl = (path: string) => `${API_BASE_URL}${path}`;
