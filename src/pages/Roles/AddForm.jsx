import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import RolService from "../../components/service/RolService";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  TextField,
  Button,
} from "@mui/material";

export default function AddForm({ closeEvent }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
  });

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
      await RolService.createRole(formData, token);
      setFormData({ nombre: "" });
      closeEvent();
      window.dispatchEvent(new Event("roleCreated"));
      Swal.fire({
        title: "Rol creado con éxito!",
        text: "El rol ha sido creado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/roles");
        }
      });
    } catch (error) {
      Swal.fire({
        title: "Error al crear el rol",
        text: "Ha ocurrido un error al crear el rol.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Registrar un nuevo Rol
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
      <Box height={20} />
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="outlined-basic"
              label="Nombre del Rol"
              variant="outlined"
              size="small"
              onChange={handleInputChange}
              value={formData.nombre}
              name="nombre"
              sx={{ minWidth: "100%" }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" sx={{ mr: 2 }}>
              Guardar
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancelar}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
