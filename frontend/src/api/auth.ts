import apiClient from "./client";

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  role: "client" | "provider";
}

export async function login(username: string, password: string) {
  const res = await apiClient.post("/token/", { username, password });
  localStorage.setItem("access_token", res.data.access);
  localStorage.setItem("refresh_token", res.data.refresh);
  localStorage.setItem("username", username);
  return res.data;
}

export async function register(payload: RegisterPayload) {
  const res = await apiClient.post("/users/register/", payload);
  return res.data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("username");
}

export function getStoredUsername() {
  return localStorage.getItem("username");
}
