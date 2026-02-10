import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://interview-platform-sooty.vercel.app/api",
  withCredentials: true,
});

export default axiosInstance;