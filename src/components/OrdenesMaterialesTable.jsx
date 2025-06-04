import { useState, useEffect } from "react";
import MaterialService from "../components/service/MaterialService";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const OrdenesMaterialesTable = () => {
  const [ordenesMateriales, setOrdenesMateriales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrdenes, setFilteredOrdenes] = useState([]);

  // Aquí deberías tener un servicio específico para órdenes de materiales,
  // pero como ejemplo, se usa MaterialService.getAllMateriales
  // Reemplaza por el servicio correcto si tienes uno.
  const fetchOrdenesMateriales = async () => {
    try {
      const token = localStorage.getItem("token");
      // TODO: Cambia esto por el servicio real de órdenes de materiales
      const response = await MaterialService.getAllMateriales(token);
      setOrdenesMateriales(response);
      setFilteredOrdenes(response);
    } catch (error) {
      console.error("Error al obtener órdenes de materiales:", error);
    }
  };

  useEffect(() => {
    fetchOrdenesMateriales();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ordenesMateriales.filter(
      (orden) =>
        (orden.nombre && orden.nombre.toLowerCase().includes(term)) ||
        (orden.descripcion && orden.descripcion.toLowerCase().includes(term))
    );
    setFilteredOrdenes(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mt-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Órdenes de Materiales</h2>
        <input
          type="text"
          placeholder="Buscar órdenes de materiales..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Unidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredOrdenes.map((orden) => (
              <motion.tr
                key={orden.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{orden.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{orden.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{orden.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{orden.unidad}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default OrdenesMaterialesTable;
