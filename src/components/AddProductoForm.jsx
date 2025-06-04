import { useState } from "react";
import ProductoService from "../components/service/ProductoService";

const AddProductoForm = ({ onClose }) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [stock, setStock] = useState(0);
  const [precio, setPrecio] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !precio) {
      setError("Nombre y precio son obligatorios");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await ProductoService.createProducto({ nombre, descripcion, stock, precio }, token);
      window.dispatchEvent(new Event("productoCreated"));
      if (onClose) onClose();
    } catch (err) {
      setError("Error al crear producto");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-gray-100 mb-4">Agregar Producto</h3>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Nombre *</label>
        <input
          type="text"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
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
        <label className="block text-gray-300 mb-1">Stock</label>
        <input
          type="number"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          min={0}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-1">Precio *</label>
        <input
          type="number"
          className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          min={0}
          step="0.01"
          required
          placeholder="Ej: 70"
        />
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

export default AddProductoForm;
