export interface AuthUser {
  id: number;
  fullName: string;
  login: string;
  role: "admin" | "manager";
}

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setUser = (user: AuthUser) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const hasRole = (roles: Array<"admin" | "manager">) => {
  const user = getUser();
  if (!user) return false;
  return roles.includes(user.role);
};
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}