import { useState } from "react";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import UserService from "../service/UserService";
import { sidebarItems } from "./SidebarData";
import Swal from "sweetalert2";

const Sidebar = ({ userPermissions, setAuthChanged }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate(); // Usa el hook useNavigate para manejar la navegación
 

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que desea cerrar sesion?",
      text: "¿Quieres cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        UserService.logout();
        setAuthChanged(true);
        navigate("/login", { replace: true });
      } else {
        return;
      }
    });
  };

  // Elimina el filtrado por permisos para mostrar todos los ítems
  const filteredSidebarItems = sidebarItems;

  return (
    <div
      className={`relative z-10 flex-shrink-0 ${
        isSidebarOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {filteredSidebarItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={(e) => {
                if (item.name === "Logout") {
                  e.preventDefault();
                  handleLogout();
                }
              }}
            >
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                <item.icon
                  size={20}
                  style={{ color: item.color, minWidth: "20px" }}
                />
                {isSidebarOpen && (
                  <span className="ml-4 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
