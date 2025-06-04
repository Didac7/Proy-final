// Servicio para productos, similar a UserService
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/productos`;

const getAllProductos = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const createProducto = async (producto, token) => {
  const res = await axios.post(API_URL, producto, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const deleteProducto = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const ProductoService = {
  getAllProductos,
  createProducto,
  deleteProducto,
};

export default ProductoService;
