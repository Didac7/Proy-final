import { useState, useEffect } from "react";
import OrdenService from "../components/service/OrdenService";
import ProductoService from "../components/service/ProductoService";

const AddOrdenForm = ({ onClose }) => {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estado, setEstado] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await ProductoService.getAllProductos(token);
        setProductos(response);
      } catch (err) {
        setProductos([]);
      }
    };
    fetchProductos();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productoId || !cantidad || !fechaInicio || !fechaFin || !estado) {
      setError("Todos los campos son obligatorios");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await OrdenService.createOrden(
        { producto_id: productoId, cantidad, fecha_inicio: fechaInicio, fecha_fin: fechaFin, estado },
        token
      );
      window.dispatchEvent(new Event("ordenCreated"));
      if (onClose) onClose();
    } catch (err) {
      setError("Error al crear orden");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">
        Agregar Orden de Producción
      </h3>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Producto *</label>
        <select
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
          required
        >
          <option value="">Seleccione un producto</option>
          {productos.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Cantidad *</label>
        <input
          type="number"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min="1"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Fecha Inicio *</label>
        <input
          type="date"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Fecha Fin *</label>
        <input
          type="date"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Estado *</label>
        <select
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          required
        >
          <option value="">Seleccione estado</option>
          <option value="pendiente">Pendiente</option>
          <option value="en_proceso">En Proceso</option>
          <option value="finalizada">Finalizada</option>
        </select>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="mr-2 px-4 py-2 rounded-lg bg-gray-600 text-gray-200 hover:bg-gray-500"
          onClick={onClose}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
        >
          Guardar
        </button>
      </div>
    </form>
  );
};

export default AddOrdenForm;
