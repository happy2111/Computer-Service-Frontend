// src/api/api.js
import axios from "./axiosInstance";

const api = {
  get: (url) => axios.get(url),                         // вернёт response
  post: (url, data) => axios.post(url, data),           // вернёт response
  put: (url, data) => axios.put(url, data),
  patch: (url, data) => axios.patch(url, data),
  delete: (url) => axios.delete(url),                   // вернёт response
};

export default api;
