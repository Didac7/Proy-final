// RolService.js
import axios from "axios";

class DepartamentoService {
  static BASE_URL = "http://localhost:4000/api";

  static async getAllDepartamentos(token) {
    try {
      const response = await axios.get(
        `${DepartamentoService.BASE_URL}/departamentos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Asegura que siempre se retorna un objeto con 'departamentos' como array
      if (Array.isArray(response.data)) {
        return { departamentos: response.data };
      } else if (response.data && Array.isArray(response.data.departamentos)) {
        return { departamentos: response.data.departamentos };
      } else {
        return { departamentos: [] };
      }
    } catch (error) {
      this.handleError(error);
      return { departamentos: [] };
    }
  }

  static async createDepartamento(departamentoDto, token) {
    try {
      const response = await axios.post(
        `${DepartamentoService.BASE_URL}/departamentos`,
        departamentoDto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Obtener un departamento por ID
  static async getDepartamentoById(departamentoId, token) {
    try {
      const response = await axios.get(
        `${DepartamentoService.BASE_URL}/departamentos/get-departamento-by-id/${departamentoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Actualizar un departamento
  static async updateDepartamento(departamentoId, departamentoDto, token) {
    try {
      const response = await axios.put(
        `${DepartamentoService.BASE_URL}/departamentos/update/${departamentoId}`,
        departamentoDto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Eliminar un departamento
  static async deleteDepartamento(departamentoId, token) {
    try {
      const response = await axios.delete(
        `${DepartamentoService.BASE_URL}/departamentos/${departamentoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  

   // Manejador de errores
   static handleError(error) {
    if (error.response) {
      // Errores del servidor
      console.error("Error en la respuesta del servidor:", error.response.data);
      console.error("Código de estado:", error.response.status);
    } else if (error.request) {
      // Sin respuesta del servidor
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      // Errores durante la configuración
      console.error("Error al configurar la solicitud:", error.message);
    }
    throw error; // Propaga el error para manejarlo externamente si es necesario
  }
}

export default DepartamentoService;
