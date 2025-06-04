import React from "react";
import { useNavigate } from "react-router-dom";
import AddUserForm from "../../components/users/AddUserForm";

const RegisterUserPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col items-center border border-gray-700">
        <h2 className="text-2xl font-bold text-white mb-6">Registrar Usuario</h2>
        <AddUserForm />
        <button
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition w-full font-semibold"
          onClick={() => navigate('/login')}
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
};

export default RegisterUserPage;