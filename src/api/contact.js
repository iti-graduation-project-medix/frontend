import axios from "axios";

const baseURL = "http://localhost:3000";

export const requestContact = (data) =>
  axios.post(`${baseURL}/api/v1/contact-us`, data);
