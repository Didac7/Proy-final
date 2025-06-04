import { useState, useEffect } from "react";
import OrdenService from "../components/service/OrdenService";
import ProductoService from "../components/service/ProductoService";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const OrdenesTable = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ProductoService.getAllProductos(token);
        setProductos(response);
      } catch (err) {
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  const fetchOrdenes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await OrdenService.getAllOrdenes(token);
      setOrdenes(response);
      setFilteredOrdenes(response);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  useEffect(() => {
    const handleOrdenCreated = () => {
      fetchOrdenes();
    };
    window.addEventListener("ordenCreated", handleOrdenCreated);
    return () => window.removeEventListener("ordenCreated", handleOrdenCreated);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ordenes.filter(
      (orden) =>
        (orden.codigo && orden.codigo.toLowerCase().includes(term)) ||
        (orden.estado && orden.estado.toLowerCase().includes(term))
    );
    setFilteredOrdenes(filtered);
  };

  const handleDelete = async (ordenId) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la orden permanentemente.",
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
        await OrdenService.deleteOrden(ordenId, token);
        setOrdenes((prev) => prev.filter((o) => o.id !== ordenId));
        setFilteredOrdenes((prev) => prev.filter((o) => o.id !== ordenId));
        Swal.fire("Eliminado", "La orden ha sido eliminada.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la orden.", "error");
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
        <h2 className="text-xl font-semibold text-gray-100">Órdenes</h2>
        <input
          type="text"
          placeholder="Buscar órdenes..."
          className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrdenes.map((orden) => {
              const producto = productos.find((p) => p.id === orden.producto_id);
              return (
                <motion.tr
                  key={orden.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{producto ? producto.nombre : 'Sin producto'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-100">{orden.cantidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{orden.fecha_inicio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{orden.fecha_fin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{orden.estado}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">Editar</button>
                    <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(orden.id)}>Eliminar</button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OrdenesTable;
