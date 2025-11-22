import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/mantenimiento";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Ordenes de mantenimiento 
export const fetchOrdenesMantenimiento = async () => {
  const response = await api.get("/ordenes");
  return response.data;
};

export const fetchOrdenById = async (id) => {
  const response = await api.get(`/ordenes/${id}`);
  return response.data;
};

export const createOrdenMantenimiento = async (data) => {
  const response = await api.post("/ordenes", data);
  return response.data;
};

export const updateOrdenMantenimiento = async (id, data) => {
  const response = await api.put(`/ordenes/${id}`, data);
  return response.data;
};

export const deleteOrdenMantenimiento = async (id) => {
  const response = await api.delete(`/ordenes/${id}`);
  return response.data;
};

// Mantenimientos individuales
export const createMantenimiento = async (ordenId, data) => {
  const response = await api.post(`/ordenes/${ordenId}/mantenimientos`, data);
  return response.data;
};

export const updateMantenimiento = async (id, data) => {
  const response = await api.put(`/mantenimientos/${id}`, data);
  return response.data;
};

export const deleteMantenimiento = async (id) => {
  const response = await api.delete(`/mantenimientos/${id}`);
  return response.data;
};
