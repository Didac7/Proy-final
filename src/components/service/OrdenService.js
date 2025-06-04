// Servicio para órdenes, similar a UserService
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/ordenes`;

const getAllOrdenes = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const createOrden = async (orden, token) => {
  const res = await axios.post(API_URL, orden, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteOrden = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const OrdenService = {
  getAllOrdenes,
  createOrden,
  deleteOrden,
};

export default OrdenService;
