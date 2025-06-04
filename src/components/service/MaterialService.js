// Servicio para materiales, similar a UserService
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/materiales`;

const getAllMateriales = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const createMaterial = async (material, token) => {
  const res = await axios.post(API_URL, material, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteMaterial = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const MaterialService = {
  getAllMateriales,
  createMaterial,
  deleteMaterial,
};

export default MaterialService;
