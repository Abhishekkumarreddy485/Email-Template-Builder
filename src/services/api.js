import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const getEmailLayout = () => API.get("/getEmailLayout");
export const uploadImage = (formData) => API.post("/uploadImage", formData);
export const uploadEmailConfig = (data) => API.post("/uploadEmailConfig", data);
export const renderAndDownloadTemplate = (data) => API.post("/renderAndDownloadTemplate", data, { responseType: "blob" });
