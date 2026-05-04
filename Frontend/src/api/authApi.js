import { apiClient } from "./httpClient";

function normalizeAuthResponse(response) {
  const payload = response?.data || response;
  const dataPayload = payload?.data || {};

  const user =
    payload?.user ||
    dataPayload?.user ||
    (payload?.email ? payload : null) ||
    (dataPayload?.email ? dataPayload : null) ||
    null;

  return {
    token:
      payload?.token ||
      payload?.accessToken ||
      dataPayload?.token ||
      dataPayload?.accessToken ||
      null,
    refreshToken:
      payload?.refreshToken || dataPayload?.refreshToken || null,
    user,
  };
}

async function loginRequest(credentials) {
  const response = await apiClient.post("/auth/login", credentials);
  return normalizeAuthResponse(response);
}

async function registerRequest(payload) {
  const response = await apiClient.post("/auth/register", payload);
  return normalizeAuthResponse(response);
}

async function refreshTokenRequest(refreshToken) {
  const response = await apiClient.post("/auth/refresh", { refreshToken });
  const payload = response?.data || response;
  return {
    accessToken: payload?.accessToken || payload?.token || null,
    refreshToken: payload?.refreshToken || null,
  };
}

async function getProfileRequest(token) {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined;
  const response = await apiClient.get("/auth/profile", options);
  const payload = response?.data || response;
  return payload?.user || payload;
}

export { getProfileRequest, loginRequest, refreshTokenRequest, registerRequest };
