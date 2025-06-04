import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/common/Sidebar";
import OverviewPage from "./pages/OverviewPage";
import RolesPage from "./pages/Roles/RolesPage";
import EditForm from "./pages/Roles/EditForm";
import AddForm from "./pages/Roles/AddForm";
import UsersPage from "./pages/Usuarios/UsersPage";
import RegisterUserPage from "./pages/Usuarios/RegisterUserPage";
import UpdateUserPage from "./pages/Usuarios/UpdateUserPage";
import DepartamentosPage from "./pages/Departamentos/DepartamentosPage";
import AddDptoForm from "./pages/Departamentos/AddDptoForm";
import EditDptoForm from "./pages/Departamentos/EditDptoForm";
import SettingsPage from "./pages/Usuarios/SettingsPage";
import UserService from "./components/service/UserService";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import ProductosPage from "./pages/ProductosPage";
import MaterialesPage from "./pages/MaterialesPage";
import OrdenesPage from "./pages/OrdenesPage";
import ReportesPage from "./pages/ReportesPage";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userPermissions, setUserPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [authChanged, setAuthChanged] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const response = await UserService.getYourProfile(token);
          if (response.empleado) {
            setUserPermissions(response.empleado.rol.permisos);
          } else if (response.candidato) {
            setUserPermissions(response.candidato.rol.permisos);
          } else {
            console.warn("El tipo de usuario no esta definido");
            setUserPermissions([]);
          }

          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error al obtener permisos:", error);
          setIsAuthenticated(false);
        }
      }
    };
    fetchProfile();
  }, [token]);

  useEffect(() => {
    if (authChanged) {
      setIsAuthenticated(false);
      setAuthChanged(false);
    }
  }, [authChanged]);

  useEffect(() => {
    const handleReload = () => {
      navigate(location.pathname);
    };
    window.addEventListener("load", handleReload);
    return () => {
      window.removeEventListener("load", handleReload);
    };
  }, [location.pathname, navigate]);

  const hasPermission = (permissionName) => {
    return userPermissions.some((permiso) => permiso.name === permissionName);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {isAuthenticated && !authChanged && (
        <Sidebar
          userPermissions={userPermissions}
          setAuthChanged={setAuthChanged}
        />
      )}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/usuarios/register" element={<RegisterUserPage />} />
        <Route
          element={
            <ProtectedRoute isAllowed={isAuthenticated} redirectTo="/login" />
          }
        >
          <Route path="/" element={<OverviewPage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/departamentos" element={<DepartamentosPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/materiales" element={<MaterialesPage />} />
          <Route path="/ordenes" element={<OrdenesPage />} />
          <Route path="/reportes" element={<ReportesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/registeruser" element={<RegisterUserPage />} />
          <Route path="/update-user/:userId" element={<UpdateUserPage />} />
          <Route path="/createroles" element={<AddForm />} />
          <Route path="/update-rol/:rolId" element={<EditForm />} />
          <Route path="/createDepartamentos" element={<AddDptoForm />} />
          <Route path="/updateDepartamento" element={<EditDptoForm />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
