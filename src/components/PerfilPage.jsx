import { AuthRol, useAuth } from "./Auth.jsx";
import { useNavigate } from "react-router-dom";
import "./PerfilPage.css"; // Importamos los estilos

export const PerfilPage = () => {
  const { sesion, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(() => navigate("/"));
  };

  return (
    <div className="perfil-contenedor">
      <h1 className="perfil-titulo">Perfil de Usuario 👤</h1>

      <div className="perfil-datos">
        <p><span className="etiqueta">Nombre:</span> {sesion?.nombre} {sesion?.apellido}</p>
      </div>

      <AuthRol rolRequerido={1}>
        <p className="rol rol-admin">Rol: Administrador</p>
      </AuthRol>

      <AuthRol rolRequerido={2}>
        <p className="rol rol-usuario">Rol: Usuario</p>
      </AuthRol>

      <button onClick={handleLogout} className="boton-salir">
        Cerrar Sesión
      </button>
    </div>
  );
};
