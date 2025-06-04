import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import RolService from "../../components/service/RolService";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

export default function EditForm({ rolId, closeEvent, onUpdate }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchRolDataById(rolId);
  }, [rolId]);

  const fetchRolDataById = async (rolId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await RolService.getRoleById(rolId, token);
      setFormData({ name: response.rol.nombre || response.rol.name });
    } catch (error) {
      console.error("Error al obtener rol:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo cargar la información del rol.",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancelar = () => {
    navigate("/roles");
    closeEvent();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await RolService.updateRole(rolId, formData, token);
      Swal.fire({
        title: "Cambios guardados con éxito!",
        text: "Los cambios se han guardado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });
      if (onUpdate) onUpdate({ ...formData, id: rolId });
      closeEvent();
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
        Editar un Rol
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
          label="Nombre del Rol"
          variant="outlined"
          size="small"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          sx={{ mb: 2 }}
          required
        />
        <Box sx={{ mt: 2 }}>
          <Button type="submit" variant="contained" sx={{ mr: 2 }}>
            Guardar Cambios
          </Button>
          <Button variant="outlined" color="error" onClick={handleCancelar}>
            Cancelar
          </Button>
        </Box>
      </form>
    </>
  );
}
