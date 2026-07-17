import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Attach the JWT access token to every outgoing request, if we have one
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;