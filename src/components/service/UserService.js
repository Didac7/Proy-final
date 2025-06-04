import axios from "axios";

class UserService {
  static BASE_URL = "http://localhost:4000/api";

  static async login(email, password) {
    try {
      const response = await axios.post(`${UserService.BASE_URL}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /** REGISTRO */
  static async register(userData, token) {
    try {
      const response = await axios.post(
        `${UserService.BASE_URL}/auth/register`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getAllUsers(token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/usuarios`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data; // El backend responde con un array de usuarios
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getUserById(userId, token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/usuarios/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async deleteUser(userId, token) {
    try {
      const response = await axios.delete(
        `${UserService.BASE_URL}/usuarios/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async updateUser(userId, userData, token) {
    try {
      const response = await axios.put(
        `${UserService.BASE_URL}/usuarios/${userId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getAllRoles(token) {
    try {
      const response = await axios.get(`${UserService.BASE_URL}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getAllDepartments(token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/departamentos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  static async getAllPermissionUser(token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/usuarios/permisos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener permisos:", error);
      throw error;
    }
  }

  static async hasPermission(permissionName, token) {
    try {
      const response = await axios.get(
        `${UserService.BASE_URL}/usuarios/permisos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userPermissions = response.data.permisos.map(
        (permiso) => permiso.name
      );
      return userPermissions.includes(permissionName);
    } catch (error) {
      console.error("Error al comprobar el permiso:", error);
      return false;
    }
  }

  // Agrega esta función para evitar el error en App.jsx
  static async getYourProfile(token) {
    try {
      // Ajusta el endpoint según tu backend, aquí se asume /usuarios/perfil
      const response = await axios.get(`${UserService.BASE_URL}/usuarios/perfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**AUTHENTICATION CHECKER */
  static logout() {
    localStorage.removeItem("token");
  }
  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token; // Retorna true si existe un token
  }

  /** MANEJO DE ERRORES */
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
export default UserService;
