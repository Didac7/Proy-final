import { useState, useEffect } from "react";
import UserService from "../service/UserService";
import RolService from "../service/RolService";
import Swal from "sweetalert2";

const AddUserForm = ({ onUserCreated }) => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesData = await RolService.getAllRoles();
        setRoles(rolesData);
      } catch (error) {
        setRoles([]);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await UserService.register(form, token);
      Swal.fire("Usuario creado", "El usuario fue registrado exitosamente", "success");
      setForm({ nombre: "", email: "", password: "", rol_id: "" });
      if (onUserCreated) onUserCreated();
      // Dispara un evento global para refrescar la tabla de usuarios
      window.dispatchEvent(new Event("userCreated"));
    } catch (error) {
      Swal.fire("Error", "No se pudo registrar el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md mx-auto border border-gray-700"
      style={{ minWidth: 320 }}
    >
      <div>
        <label className="block text-gray-200 font-semibold mb-1">Nombre</label>
        <input
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-1">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-1">Contraseña</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-gray-200 font-semibold mb-1">Rol</label>
        <select
          name="rol_id"
          value={form.rol_id}
          onChange={handleChange}
          required
          className="w-full p-2 rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona un rol</option>
          {roles.map((rol) => (
            <option key={rol.id} value={rol.id}>{rol.nombre}</option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold w-full transition-colors duration-200"
      >
        {loading ? "Creando..." : "Crear Usuario"}
      </button>
    </form>
  );
};

export default AddUserForm;
