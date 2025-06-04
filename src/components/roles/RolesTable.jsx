import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Edit, Search, Trash2 } from "lucide-react";
import RolServices from "../service/RolService";
import CreateRolPage from "../../pages/Roles/CreateRolPage"; // modal para crear rol
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const RolesTable = ({userPermissions}) => {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  // Función para obtener todos los roles
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await RolServices.getAllRoles(token);
      setRoles(response.rols);
      setFilteredRoles(response.rols);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };
  // Cargar roles al montar el componente
  useEffect(() => {
    fetchRoles();
  }, []);

  // Actualizar lista de roles tras cerrar modal de creación
  // useEffect(() => {
  //   const fetchRolesAfterCreate = async () => {
  //     await fetchRoles();
  //   };
  //   fetchRolesAfterCreate();
  // }, [createModalOpen]);
  useEffect(() => {
    if (!createModalOpen) fetchRoles();
  }, [createModalOpen]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = roles.filter((rol) =>
      rol.name.toLowerCase().includes(term)
    );
    setFilteredRoles(filtered);
  };

  const hasPermission = (permissionName) => {
    return userPermissions.some((permiso) => permiso.name === permissionName);
  };
  const handleCreate = () => {
    setCreateModalOpen(true); // Abrir modal de crear
  };
   
  const closeCreateModal = () => {
    setCreateModalOpen(false); // Cerrar modal de crear
  };
  const eliminarRol = async (rolId) => {
    if (!hasPermission("ELIMINAR_ROL")) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar roles.",
      });
      return;
    }
    const confirmDelete = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. ¿Deseas eliminar este rol?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await RolServices.deleteRole(rolId, token);
        fetchRoles(); // Actualizar la lista de roles
        Swal.fire({
          icon: "success",
          title: "Rol eliminado",
          text: "El rol ha sido eliminado con éxito.",
        });
      } catch (error) {
        console.error("Error al eliminar el rol:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el rol. Intenta nuevamente.",
        });
      }
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search roles..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <div className="flex justify-between mb-4">
          {/* Actualiza el botón para abrir el modal */}
          <button
            className="text-gray-100 bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded"
            onClick={handleCreate}
          >
            Crear Rol
          </button>
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
            {filteredRoles.map((rol) => (
              <motion.tr
                key={rol.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  {rol.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {hasPermission("ACTUALIZAR_ROL") && (
                    <button className="text-indigo-400 hover:text-indigo-300 mr-2">
                      <Link to={`/update-rol/${rol.id}`}>
                        <Edit size={18} />
                      </Link>
                    </button>
                  )}
                  {hasPermission("ELIMINAR_ROL") && (
                    <button
                      className="text-red-400 hover:text-red-300"
                      onClick={() => eliminarRol(rol.id)}                      
                    >                    
                      <Trash2 size={18} />
                    </button>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal de Crear */}
      <CreateRolPage open={createModalOpen} handleClose={closeCreateModal} />
    </motion.div>
  );
};
export default RolesTable;
