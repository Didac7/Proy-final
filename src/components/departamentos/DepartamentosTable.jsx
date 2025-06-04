import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import DepartamentoService from "../service/DepartamentoService";

const DepartamentosTable = ({ userPermissions }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await DepartamentoService.getAllDepartamentos(token);
        setDepartamentos(response.departamentos);
        setFilteredDepartamentos(response.departamentos);
      } catch (error) {
        console.error("Error al obtener departamentos:", error);
      }
    };

    fetchDepartamentos();
  }, []);

  const hasPermission = (permissionName) => {
    return userPermissions.some((permiso) => permiso.name === permissionName);
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = departamentos.filter(
      (departamento) =>
      departamento.name.toLowerCase().includes(term)
    );
    setFilteredDepartamentos(filtered);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Departments List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search departamentos..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}            
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredDepartamentos.map((departamento) => (
              <motion.tr
                key={departamento.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  {departamento.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {hasPermission("ACTUALIZAR_DEPARTAMENTO") && (
                  <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                    <Edit size={18} />
                  </button>)}
                  {hasPermission("ELIMINAR_DEPARTAMENTO") && (
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2 size={18} />
                  </button>)}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
export default DepartamentosTable;
