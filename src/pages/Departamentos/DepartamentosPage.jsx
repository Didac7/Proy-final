import Header from "../../components/common/Header";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Edit, Search, Trash2 } from "lucide-react"; 
import DepartamentoService from "../../components/service/DepartamentoService";
import Swal from "sweetalert2";
import Modal from "@mui/material/Modal";
import { AddCircle } from "@mui/icons-material";
import AddDptoForm from "../../pages/Departamentos/AddDptoForm";
import EditDptoForm from "../../pages/Departamentos/EditDptoForm";
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

export default function DepartamentosPage({userPermissions}) {
  const [departamentos, setDepartamentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartamentos, setFilteredDepartamentos] = useState([]);
  const [formid, setFormid] = useState("");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleEditOpen = () => setEditOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  // Cargar departamentos al montar el componente
  useEffect(() => {
    fetchDepartamentos();
  }, []);

  useEffect(() => {
    if (!open) fetchDepartamentos();
  }, [open]);

  // Para refrescar la tabla al crear departamento desde el modal
  useEffect(() => {
    const handleDepartamentoCreated = () => {
      fetchDepartamentos();
    };
    window.addEventListener("departamentoCreated", handleDepartamentoCreated);
    return () => window.removeEventListener("departamentoCreated", handleDepartamentoCreated);
  }, []);

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

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = departamentos.filter((departamento) =>
      (departamento.nombre || "").toLowerCase().includes(term)
    );
    setFilteredDepartamentos(filtered);
  };

  // Mostrar siempre las acciones de editar y eliminar (solo para pruebas o desarrollo)
  const hasPermission = () => true;

  const eliminarDpto = async (departamentoId) => {
    if (!hasPermission("ELIMINAR_DEPARTAMENTO")) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "No tienes permiso para eliminar departamentos.",
      });
      return;
    }
    const confirmDelete = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer. ¿Deseas eliminar este departamento?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (confirmDelete.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await DepartamentoService.deleteDepartamento(departamentoId, token);
        fetchDepartamentos(); // Actualizar la lista de departamentos
        Swal.fire({
          icon: "success",
          title: "Departamento eliminado",
          text: "El departamento ha sido eliminado con éxito.",
        });
      } catch (error) {
        console.error("Error al eliminar el departamento:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo eliminar el departamento. Intenta nuevamente.",
        });
      }
    }
  };

  const handleUpdateDepartamento = (updatedDepartamento) => {
    setDepartamentos((prev) =>
      prev.map((dpto) =>
        dpto.id === updatedDepartamento.id ? updatedDepartamento : dpto
      )
    );
    setFilteredDepartamentos((prev) =>
      prev.map((dpto) =>
        dpto.id === updatedDepartamento.id ? updatedDepartamento : dpto
      )
    );
  };

  const editData = (departamentoId) => {
    setFormid(departamentoId);
    handleEditOpen();
  };
  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Departamentos" />

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
                <AddDptoForm closeEvent={handleClose} />
              </Box>
            </Modal>

            <Modal
              open={editOpen}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <EditDptoForm 
                   closeEvent={handleEditClose} 
                   departamentoId={formid} 
                   onUpdate={handleUpdateDepartamento}
                   />
              </Box>
            </Modal>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search departamentos..."
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
                      {departamento.nombre}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {hasPermission("ACTUALIZAR_DEPARTAMENTO") && (
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() => {
                            editData(departamento.id);
                          }}
                        >
                          <Edit size={18} />
                        </button>
                      )}
                      {hasPermission("ELIMINAR_DEPARTAMENTO") && (
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => eliminarDpto(departamento.id)}
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
