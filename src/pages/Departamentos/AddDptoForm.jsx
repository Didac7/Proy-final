import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import DepartamentoService from "../../components/service/DepartamentoService";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
} from "@mui/material";

export default function AddDptoForm({ closeEvent }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCancelar = () => {
    navigate("/departamentos");
    closeEvent();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await DepartamentoService.createDepartamento(formData, token);
      setFormData({
        nombre: "",
      });

      closeEvent(); // Cierra el modal
      // Dispara un evento global para refrescar la tabla de departamentos
      window.dispatchEvent(new Event("departamentoCreated"));
      Swal.fire({
        title: "Departamemto creado con éxito!",
        text: "El departamento ha sido creado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/departamentos"); // Redirecciona a la página de departamentos
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error al crear el departamento",
        text: "Ha ocurrido un error al crear el departamento.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Registrar un nuevo Departamento
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            label="Nombre del Departamento"
            variant="outlined"
            size="small"
            onChange={handleInputChange}
            value={formData.nombre}
            name="nombre"
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={handleSubmit} sx={{ mr: 2 }}>
              Guardar
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleCancelar()}
            >
              Cancelar
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}
