import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getProfileRequest, loginRequest, registerRequest } from "../api/authApi";
import { ApiError } from "../api/httpClient";
import { ENABLE_MOCK_AUTH } from "../config/env";
import {
  clearStoredAuth,
  getStoredRefreshToken,
  getStoredToken,
  getStoredUser,
  setStoredRefreshToken,
  setStoredToken,
  setStoredUser,
} from "../utils/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const normalizeRole = (role) => {
    const rawRole = String(role || "").trim().toLowerCase();

    if (!rawRole) return "patient";
    if (rawRole.includes("admin")) return "admin";
    if (rawRole.includes("doctor")) return "doctor";
    if (rawRole.includes("patient")) return "patient";

    return "patient";
  };

  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const resolveRoleFromEmail = (email) => {
    const normalizedEmail = email.toLowerCase();

    if (normalizedEmail.includes("admin")) {
      return "admin";
    }

    if (normalizedEmail.includes("doctor")) {
      return "doctor";
    }

    return "patient";
  };

  const buildMockUser = ({ name, email, role }) => {
    const userName = name || email.split("@")[0];
    const finalRole = normalizeRole(role || resolveRoleFromEmail(email));

    return {
      id: crypto.randomUUID(),
      name: userName,
      email,
      role: finalRole,
    };
  };

  const persistAuth = ({ user, token = null, refreshToken = null }) => {
    const safeUser = {
      ...user,
      role: normalizeRole(user?.role),
    };

    setCurrentUser(safeUser);
    setStoredUser(safeUser);
    setStoredToken(token);
    setStoredRefreshToken(refreshToken);
  };

  const resolveUserWithFallback = async (userFromAuth, token, fallbackInput) => {
    if (userFromAuth) {
      return userFromAuth;
    }

    if (token) {
      try {
        const profile = await getProfileRequest(token);
        if (profile) {
          return profile;
        }
      } catch {
        // If profile lookup fails, fallback user will be used below.
      }
    }

    return buildMockUser(fallbackInput);
  };

  const login = async ({ email, password }) => {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");

    if (!normalizedEmail || !normalizedPassword) {
      return { ok: false, message: "Please fill all fields." };
    }

    try {
      const { user, token, refreshToken } = await loginRequest({
        email: normalizedEmail,
        password: normalizedPassword,
      });
      const resolvedUser = await resolveUserWithFallback(user, token, { email: normalizedEmail });

      persistAuth({ user: resolvedUser, token, refreshToken });
      return {
        ok: true,
        role: normalizeRole(resolvedUser.role || resolveRoleFromEmail(normalizedEmail)),
      };
    } catch (error) {
      if (ENABLE_MOCK_AUTH) {
        const user = buildMockUser({ email });
        persistAuth({
          user,
          token: `mock-token-${user.id}`,
          refreshToken: `mock-refresh-token-${user.id}`,
        });
        return { ok: true, role: user.role, isMock: true };
      }

      const message =
        error instanceof ApiError
          ? error.message
          : "Login failed. Please try again later.";
      return { ok: false, message };
    }
  };

  const register = async ({ name, email, password, role }) => {
    if (!name || !email || !password) {
      return { ok: false, message: "Please fill all fields." };
    }

    try {
      const { user, token, refreshToken } = await registerRequest({
        name,
        email,
        password,
      });
      const resolvedUser = await resolveUserWithFallback(user, token, {
        name,
        email,
        role: role || "patient",
      });

      persistAuth({ user: resolvedUser, token, refreshToken });
      return {
        ok: true,
        role: normalizeRole(resolvedUser.role || role || "patient"),
      };
    } catch (error) {
      if (ENABLE_MOCK_AUTH) {
        const user = buildMockUser({ name, email, role });
        persistAuth({
          user,
          token: `mock-token-${user.id}`,
          refreshToken: `mock-refresh-token-${user.id}`,
        });
        return { ok: true, role: user.role, isMock: true };
      }

      const message =
        error instanceof ApiError
          ? error.message
          : "Registration failed. Please try again later.";
      return { ok: false, message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    clearStoredAuth();
  };

  useEffect(() => {
    let isMounted = true;

    const bootstrapAuth = async () => {
      const token = getStoredToken();
      const refreshToken = getStoredRefreshToken();
      const storedUser = getStoredUser();

      if ((!token && !refreshToken) || !storedUser) {
        if (isMounted) {
          setIsAuthLoading(false);
        }
        return;
      }

      try {
        const profile = await getProfileRequest();
        if (isMounted) {
          persistAuth({ user: profile, token: getStoredToken(), refreshToken: getStoredRefreshToken() });
        }
      } catch {
        if (!ENABLE_MOCK_AUTH && isMounted) {
          clearStoredAuth();
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      isAuthLoading,
      login,
      register,
      logout,
    }),
    [currentUser, isAuthLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
