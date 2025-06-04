import { useState, useEffect } from "react";
import ProductoService from "../components/service/ProductoService";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const ProductosTable = () => {
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProductos, setFilteredProductos] = useState([]);

  const fetchProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await ProductoService.getAllProductos(token);
      setProductos(response);
      setFilteredProductos(response);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  useEffect(() => {
    const handleProductoCreated = () => {
      fetchProductos();
    };
    window.addEventListener("productoCreated", handleProductoCreated);
    return () => window.removeEventListener("productoCreated", handleProductoCreated);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = productos.filter(
      (prod) =>
        (prod.nombre && prod.nombre.toLowerCase().includes(term)) ||
        (prod.descripcion && prod.descripcion.toLowerCase().includes(term))
    );
    setFilteredProductos(filtered);
  };

  const handleDelete = async (productoId) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await ProductoService.deleteProducto(productoId, token);
        setProductos((prev) => prev.filter((p) => p.id !== productoId));
        setFilteredProductos((prev) => prev.filter((p) => p.id !== productoId));
        Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Productos</h2>
        <input
          type="text"
          placeholder="Buscar productos..."
          className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProductos.map((prod) => (
              <motion.tr
                key={prod.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{prod.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{prod.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{prod.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{prod.precio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">Editar</button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(prod.id)}>Eliminar</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ProductosTable;
