import axios from "axios";

const BASE_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000/"
    : "https://cosmicclassroom.co/";

export const AxiosCosmicClassroom = axios.create({
  baseURL: BASE_URL,
});

