// RolService.js
import axios from "axios";

class PermissionService {
  static BASE_URL = "http://localhost:4000/api";

  static async getAllPermission(token) {
    try {
      const response = await axios.get(
        `${PermissionService.BASE_URL}/permisos/get-all-permisos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static handleError(error) {
    if (error.response) {
      // Errores del servidor
      if (error.response.status >= 200 && error.response.status < 300) {
        console.error(
          "Respuesta del servidor no esperada:",
          error.response.data
        );
      } else {
        console.error(
          "Error en la respuesta del servidor:",
          error.response.data
        );
        console.error("Código de estado:", error.response.status);
      }
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

export default PermissionService;
