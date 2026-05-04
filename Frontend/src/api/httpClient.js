import { API_BASE_URL } from "../config/env";
import {
  clearStoredAuth,
  getStoredRefreshToken,
  getStoredToken,
  setStoredRefreshToken,
  setStoredToken,
} from "../utils/authStorage";

class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

let refreshPromise = null;

async function requestTokenRefresh() {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new ApiError("Session expired. Please login again.", 401, null);
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const raw = await response.text();
  let payload = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { message: raw };
    }
  }

  if (!response.ok) {
    const message = payload?.message || "Session expired. Please login again.";
    throw new ApiError(message, response.status, payload);
  }

  const newAccessToken = payload?.accessToken || payload?.token || null;
  const newRefreshToken = payload?.refreshToken || refreshToken;

  if (!newAccessToken) {
    throw new ApiError("Refresh endpoint did not return access token.", 401, payload);
  }

  setStoredToken(newAccessToken);
  setStoredRefreshToken(newRefreshToken);
  return newAccessToken;
}

async function ensureFreshToken() {
  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh()
      .catch((error) => {
        clearStoredAuth();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

async function httpRequest(path, options = {}) {
  const skipAuthRefresh = options.skipAuthRefresh === true;
  const isRetry = options.isRetry === true;
  const isPublicAuthRoute =
    path === "/auth/login" || path === "/auth/register" || path === "/auth/refresh";
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  const hasBody = options.body !== undefined;

  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization") && !isPublicAuthRoute) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    skipAuthRefresh: undefined,
    isRetry: undefined,
    headers,
  });

  const raw = await response.text();
  let payload = null;
  if (raw) {
    try {
      payload = JSON.parse(raw);
    } catch {
      payload = { message: raw };
    }
  }

  if (
    response.status === 401 &&
    !skipAuthRefresh &&
    !isRetry &&
    path !== "/auth/login" &&
    path !== "/auth/refresh"
  ) {
    try {
      const freshToken = await ensureFreshToken();
      return httpRequest(path, {
        ...options,
        isRetry: true,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${freshToken}`,
        },
      });
    } catch (refreshError) {
      throw refreshError;
    }
  }

  if (!response.ok) {
    const message =
      payload?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload;
}

const apiClient = {
  get: (path, options = {}) => httpRequest(path, { ...options, method: "GET" }),
  post: (path, body, options = {}) =>
    httpRequest(path, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),
  put: (path, body, options = {}) =>
    httpRequest(path, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),
  patch: (path, body, options = {}) =>
    httpRequest(path, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: (path, options = {}) =>
    httpRequest(path, { ...options, method: "DELETE" }),
};

export { ApiError, apiClient };
