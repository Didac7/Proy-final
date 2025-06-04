import { useState, useEffect } from "react";
import MaterialService from "./service/MaterialService";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const MaterialesTable = () => {
  const [materiales, setMateriales] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMateriales, setFilteredMateriales] = useState([]);

  const fetchMateriales = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await MaterialService.getAllMateriales(token);
      setMateriales(response);
      setFilteredMateriales(response);
    } catch (error) {
      console.error("Error al obtener materiales:", error);
    }
  };

  useEffect(() => {
    fetchMateriales();
  }, []);

  useEffect(() => {
    const handleMaterialCreated = () => {
      fetchMateriales();
    };
    window.addEventListener("materialCreated", handleMaterialCreated);
    return () => window.removeEventListener("materialCreated", handleMaterialCreated);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = materiales.filter(
      (mat) =>
        (mat.nombre && mat.nombre.toLowerCase().includes(term)) ||
        (mat.descripcion && mat.descripcion.toLowerCase().includes(term))
    );
    setFilteredMateriales(filtered);
  };

  const handleDelete = async (materialId) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el material permanentemente.",
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
        await MaterialService.deleteMaterial(materialId, token);
        setMateriales((prev) => prev.filter((m) => m.id !== materialId));
        setFilteredMateriales((prev) => prev.filter((m) => m.id !== materialId));
        Swal.fire("Eliminado", "El material ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el material.", "error");
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
        <h2 className="text-xl font-semibold text-gray-100">Materiales</h2>
        <input
          type="text"
          placeholder="Buscar materiales..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredMateriales.map((mat) => (
              <motion.tr
                key={mat.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-gray-100">{mat.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{mat.descripcion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{mat.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-300">{mat.unidad}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">Editar</button>
                  <button className="text-red-400 hover:text-red-300" onClick={() => handleDelete(mat.id)}>Eliminar</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MaterialesTable;
