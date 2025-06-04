import { useState, useEffect } from "react";
import ReporteService from "../components/service/ReporteService";
import ProductoService from "../components/service/ProductoService";
import OrdenService from "../components/service/OrdenService";
import UserService from "../components/service/UserService";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { exportToExcel } from "../utils/exportToExcel";

const ReportesTable = () => {
  const [reportes, setReportes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReportes, setFilteredReportes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const fetchReportes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await ReporteService.getAllReportes(token);
      setReportes(response);
      setFilteredReportes(response);
    } catch (error) {
      console.error("Error al obtener reportes:", error);
    }
  };

  useEffect(() => {
    fetchReportes();
  }, []);

  useEffect(() => {
    const handleReporteCreated = () => {
      fetchReportes();
    };
    window.addEventListener("reporteCreated", handleReporteCreated);
    return () => window.removeEventListener("reporteCreated", handleReporteCreated);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [prods, ords, usrs] = await Promise.all([
          ProductoService.getAllProductos(token),
          OrdenService.getAllOrdenes(token),
          UserService.getAllUsers(token),
        ]);
        setProductos(prods);
        setOrdenes(ords);
        setUsuarios(usrs);
      } catch (err) {
        setProductos([]);
        setOrdenes([]);
        setUsuarios([]);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reportes.filter(
      (rep) =>
        (rep.titulo && rep.titulo.toLowerCase().includes(term)) ||
        (rep.descripcion && rep.descripcion.toLowerCase().includes(term))
    );
    setFilteredReportes(filtered);
  };

  const handleDelete = async (reporteId) => {
    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el reporte permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await ReporteService.deleteReporte(reporteId, token);
        setReportes((prev) => prev.filter((r) => r.id !== reporteId));
        setFilteredReportes((prev) => prev.filter((r) => r.id !== reporteId));
        Swal.fire("Eliminado", "El reporte ha sido eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el reporte.", "error");
      }
    }
  };

  // Exportar todos los reportes filtrados a Excel
  const handleExportAll = () => {
    // Prepara los datos con nombres legibles
    const data = filteredReportes.map((rep) => {
      const usuario = usuarios.find((u) => u.id === rep.usuario_id);
      const orden = ordenes.find((o) => o.id === rep.orden_id);
      const producto = productos.find((p) => p.id === rep.producto_id);
      return {
        Título: rep.titulo,
        Descripción: rep.descripcion,
        Fecha: rep.fecha,
        Usuario: usuario ? usuario.nombre : "-",
        Orden: orden ? `#${orden.id}` : "-",
        Producto: producto ? producto.nombre : "-",
      };
    });
    exportToExcel(data, "reportes.xlsx");
  };

  // Exportar un solo reporte a Excel
  const handleExportOne = (rep) => {
    const usuario = usuarios.find((u) => u.id === rep.usuario_id);
    const orden = ordenes.find((o) => o.id === rep.orden_id);
    const producto = productos.find((p) => p.id === rep.producto_id);
    const data = [{
      Título: rep.titulo,
      Descripción: rep.descripcion,
      Fecha: rep.fecha,
      Usuario: usuario ? usuario.nombre : "-",
      Orden: orden ? `#${orden.id}` : "-",
      Producto: producto ? producto.nombre : "-",
    }];
    exportToExcel(data, `reporte_${rep.id}.xlsx`);
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Reportes</h2>
        <div>
          <input
            type="text"
            placeholder="Buscar reportes..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-4 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
            onClick={handleExportAll}
            type="button"
          >
            Exportar Excel
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orden</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredReportes.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-gray-400">
                  No hay reportes para mostrar.
                </td>
              </tr>
            ) : (
              filteredReportes.map((rep) => {
                const usuario = usuarios.find((u) => u.id === rep.usuario_id);
                const orden = ordenes.find((o) => o.id === rep.orden_id);
                const producto = productos.find((p) => p.id === rep.producto_id);
                return (
                  <motion.tr
                    key={rep.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-100">{rep.titulo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{rep.descripcion}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{rep.fecha}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{usuario ? `${usuario.nombre}` : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{orden ? `#${orden.id}` : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{producto ? producto.nombre : "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      <button className="text-indigo-400 hover:text-indigo-300 mr-2">Editar</button>
                      <button className="text-red-400 hover:text-red-300 mr-2" onClick={() => handleDelete(rep.id)}>Eliminar</button>
                      <button className="text-green-400 hover:text-green-300" onClick={() => handleExportOne(rep)} title="Exportar a Excel">
                        Excel
                      </button>
                    </td>
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ReportesTable;
