import axios from "axios";

export const api = axios.create({
  baseURL: "https://hireflow-backend.onrender.com",
});
