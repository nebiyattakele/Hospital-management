const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.trim() || "http://localhost:5001/api";

const ENABLE_MOCK_AUTH = import.meta.env.VITE_ENABLE_MOCK_AUTH === "true";

export { API_BASE_URL, ENABLE_MOCK_AUTH };
