import { useState, useEffect } from "react";
import ReporteService from "../components/service/ReporteService";
import ProductoService from "../components/service/ProductoService";
import OrdenService from "../components/service/OrdenService";

const AddReporteForm = ({ onClose }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [productoId, setProductoId] = useState("");
  const [ordenId, setOrdenId] = useState("");
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [error, setError] = useState("");
  const usuarioId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [prods, ords] = await Promise.all([
          ProductoService.getAllProductos(token),
          OrdenService.getAllOrdenes(token),
        ]);
        setProductos(prods);
        setOrdenes(ords);
      } catch (err) {
        setProductos([]);
        setOrdenes([]);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo || !fecha || !usuarioId) {
      setError("Título, fecha y usuario son obligatorios");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await ReporteService.createReporte(
        {
          titulo,
          descripcion,
          fecha,
          usuario_id: usuarioId,
          orden_id: ordenId || null,
          producto_id: productoId || null,
        },
        token
      );
      window.dispatchEvent(new Event("reporteCreated"));
      if (onClose) onClose();
    } catch (err) {
      setError("Error al crear reporte");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700"
    >
      <h3 className="text-lg font-semibold text-gray-100 mb-4">
        Agregar Reporte
      </h3>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Título *</label>
        <input
          type="text"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Descripción</label>
        <input
          type="text"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Fecha *</label>
        <input
          type="date"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Producto</label>
        <select
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={productoId}
          onChange={(e) => setProductoId(e.target.value)}
        >
          <option value="">Seleccione un producto (opcional)</option>
          {productos.map((prod) => (
            <option key={prod.id} value={prod.id}>
              {prod.nombre}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Orden de Producción</label>
        <select
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={ordenId}
          onChange={(e) => setOrdenId(e.target.value)}
        >
          <option value="">Seleccione una orden (opcional)</option>
          {ordenes.map((ord) => (
            <option key={ord.id} value={ord.id}>
              {`#${ord.id} - ${ord.estado}`}
            </option>
          ))}
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

export default AddReporteForm;
