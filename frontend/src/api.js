// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:5000/api"
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   console.log("API Interceptor - Token from localStorage:", token);
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//     console.log("API Interceptor - Auth header set to:", config.headers.Authorization);
//   }
//   return config;
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
