// Servicio para reportes, similar a UserService
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/reportes`;

const getAllReportes = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const createReporte = async (reporte, token) => {
  const res = await axios.post(API_URL, reporte, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteReporte = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const ReporteService = {
  getAllReportes,
  createReporte,
  deleteReporte,
};

export default ReporteService;
