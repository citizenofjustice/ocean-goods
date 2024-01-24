import axios from "axios";

export default axios.create({
  baseURL: import.meta.env.VITE_REACT_BASE_URL,
});

export const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_REACT_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
