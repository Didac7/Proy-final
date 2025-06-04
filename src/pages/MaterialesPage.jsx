import React, { useState } from "react";
import MaterialesTable from "../components/MaterialesTable";
import AddMaterialForm from "../components/AddMaterialForm";

const MaterialesPage = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8 text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Gestión de Materiales</h1>
      <button
        className="mb-6 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500"
        onClick={() => setShowModal(true)}
      >
        Agregar Material
      </button>
      <MaterialesTable />
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-700">
            <AddMaterialForm onClose={() => setShowModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialesPage;
