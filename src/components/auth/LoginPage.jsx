import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserService from "../service/UserService";
import logo from "../../assets/pic/logo.png";
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Limpiar errores previos

    if (!validateEmail(email)) {
      setError("Correo electrónico inválido");
      return;
    }

    if (password.length < 6) {
      setError("Contraseña demasiado corta");
      return;
    }

    try {
      // Llamada al servicio de login
      const userData = await UserService.login(email, password);
      if (userData.token) {
        localStorage.setItem("token", userData.token);
        if (userData.user && userData.user.id) {
          localStorage.setItem("userId", userData.user.id);
        }
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        setError(userData.message || "Credenciales invalidas");
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      setError("Error al iniciar sesión");
    }
  };

  // Validación de correo electrónico
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <div className="container">
      <img src={logo} alt="Logo" />
      <h2>Bienvenido</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Email"
          autoComplete="email"
        />
        <label htmlFor="password">Password</label>
        <div className="password-wrapper">
          <input
            id="password"
            type={verPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            autoComplete="current-password"
          />
          <span
            className="toggle-password"
            onClick={() => setVerPassword(!verPassword)}
            role="button"
            tabIndex={0}
          >
            {verPassword ? "Ø" : "👁"}
          </span>
        </div>
        <button type="submit">
          <span>Login</span>
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-gray-300">¿No tienes cuenta?</span>
        <Link
          to="/usuarios/register"
          className="text-blue-400 hover:underline ml-2"
        >
          Crear cuenta
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
