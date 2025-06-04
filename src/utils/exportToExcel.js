import * as XLSX from "xlsx";

export function exportToExcel(data, fileName = "reporte.xlsx") {
  // Convierte los datos a una hoja de Excel
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Reportes");
  // Genera el archivo y lo descarga
  XLSX.writeFile(wb, fileName);
}
