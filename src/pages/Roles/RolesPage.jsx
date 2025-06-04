import Header from "../../components/common/Header";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Edit, Search, Trash2 } from "lucide-react";
import RolService from "../../components/service/RolService";
import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";
import { AddCircle } from "@mui/icons-material";
import AddForm from "../../pages/Roles/AddForm";
import EditForm from "../../pages/Roles/EditForm";
import { Box, Button } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function RolesPage({ userPermissions }) {
  const [roles, setRoles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [formid, setFormid] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleEditOpen = () => setEditOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  // Definir fetchRoles fuera del useEffect para que esté disponible globalmente
  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await RolService.getAllRoles(token);
      setRoles(Array.isArray(response) ? response : []);
      setFilteredRoles(Array.isArray(response) ? response : []);
    } catch (error) {
      setRoles([]);
      setFilteredRoles([]);
      console.error("Error al obtener roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Para refrescar la tabla al crear rol desde el modal
  useEffect(() => {
    const handleRoleCreated = () => {
      fetchRoles();
    };
    window.addEventListener("roleCreated", handleRoleCreated);
    return () => window.removeEventListener("roleCreated", handleRoleCreated);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = roles.filter((rol) =>
      (rol.nombre && rol.nombre.toLowerCase().includes(term))
    );
    setFilteredRoles(filtered);
  };

  const hasPermission = (permissionName) => {
    // Si userPermissions no está definido, retorna true para mostrar acciones
    if (!userPermissions) return true;
    return userPermissions.some((permiso) => permiso.name === permissionName);
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
        await RolService.deleteRole(rolId, token);
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

  const editData = (rolId) => {
    setFormid(rolId);
    handleEditOpen();
  };

  const handleUpdateRol = (updatedRol) => {
    setRoles((prev) =>
      prev.map((rol) => (rol.id === updatedRol.id ? updatedRol : rol))
    );
    setFilteredRoles((prev) =>
      prev.map((rol) => (rol.id === updatedRol.id ? updatedRol : rol))
    );
  };
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Roles" />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <Modal
              open={open}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <AddForm closeEvent={handleClose} />
              </Box>
            </Modal>

            <Modal
              open={editOpen}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <EditForm
                  closeEvent={handleEditClose}
                  rolId={formid}
                  onUpdate={handleUpdateRol}
                />
              </Box>
            </Modal>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search roles..."
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>
            <div className="flex justify-between mb-4">
              {/* Actualiza el botón para abrir el modal */}
              <Button
                className="text-gray-100 bg-gray-800 hover:bg-gray-700 py-2 px-4 rounded"
                endIcon={<AddCircle />}
                onClick={handleOpen}
              >
                Add
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {(filteredRoles || []).map((rol) => (
                  <motion.tr
                    key={rol.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                      {rol.nombre}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {hasPermission("ACTUALIZAR_ROL") && (
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() => {
                            editData(rol.id);
                          }}
                        >
                          <Edit size={18} />
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
        </motion.div>
      </main>
    </div>
  );
}
