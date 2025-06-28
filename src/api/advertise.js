import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";


export const requestAdvertise = (data) => axios.post(`${baseURL}/api/v1/advertisement-request`, data);

