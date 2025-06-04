// RolService.js
import axios from "axios";

class RolService {
  static BASE_URL = "http://localhost:4000/api";

  static async getAllRoles(token) {
    try {
      // Si no hay token, no envíes el header Authorization
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get(`${RolService.BASE_URL}/roles`, config);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getRoleById(rolId, token) {
    try {
      const response = await axios.get(
        `${RolService.BASE_URL}/roles/${rolId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async createRole(rolDto, token) {
    try {
      const response = await axios.post(
        `${RolService.BASE_URL}/roles`,
        rolDto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async updateRole(rolId, rolDto, token) {
    try {
      const response = await axios.put(
        `${RolService.BASE_URL}/roles/${rolId}`,
        rolDto,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async deleteRole(rolId, token) {
    try {
      const response = await axios.delete(
        `${RolService.BASE_URL}/roles/${rolId}`,
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

export default RolService;
