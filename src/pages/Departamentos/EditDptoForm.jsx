import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DepartamentoService from "../../components/service/DepartamentoService";
import Swal from "sweetalert2";
import { Box, Typography, IconButton, TextField, Button } from "@mui/material";
export default function EditDptoForm({ departamentoId, closeEvent, onUpdate }) {
//   const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchDptoDataById(departamentoId);
  }, [departamentoId]);

  const fetchDptoDataById = async (departamentoId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await DepartamentoService.getDepartamentoById(
        departamentoId,
        token
      );
      setFormData({
        name: response.departamento.name,
      });
    } catch (error) {
      console.error("Error al obtener departamento:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información del departamento.",
      });
    }
  };

  // Manejar cambios en el campo de texto del nombre del departamento
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Validación",
        text: "El nombre del departamento no puede estar vacío.",
      });
      return;
    }
    closeEvent();
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro de guardar los cambios?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar cambios",
        cancelButtonText: "Cancelar",
      });

      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const updatedDepartamento = await DepartamentoService.updateDepartamento(
          departamentoId,
          formData,
          token
        );
        Swal.fire({
          title: "Cambios guardados con éxito!",
          text: "Los cambios se han guardado correctamente.",
          icon: "success",
          confirmButtonText: "Aceptar",
        });
        // Llama la función de actualización
        onUpdate(updatedDepartamento.departamento);        
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Swal.fire({
        title: "Error al guardar cambios",
        text: "Ha ocurrido un error al guardar los cambios.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Editar un Departamento
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <form onSubmit={handleSubmit}>
      <TextField
        id="name"
        label="Nombre del Departamento"
        variant="outlined"
        size="small"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        fullWidth
        sx={{ mb: 2 }}
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" sx={{ mr: 2 }}>
          Guardar Cambios
        </Button>
        <Button variant="outlined" color="error" onClick={closeEvent}>
          Cancelar
        </Button>
      </Box>
    </form>
    </>
  );
}
