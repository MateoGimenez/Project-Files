import { createContext, useContext, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

// Hook personalizado para acceder a la sesión
export const useAuth = () => {
  return useContext(AuthContext);
};

// Proveedor de autenticación (envolvés tu <App /> con esto)
export const AuthProvider = ({ children }) => {
  // Estado inicial: toma el token guardado (si existe)
  const [sesion, setSesion] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("token")) ?? null;
    } catch {
      return null;
    }
  });

  // Función de login
  const login = async (nombre, password, ok, error) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, password }),
      });

      if (!response.ok) {
        error(); // Callback de error
        return;
      }

      const data = await response.json();
      setSesion(data); // Guardamos la sesión en el estado
      sessionStorage.setItem("token", JSON.stringify(data)); // También en el navegador
      ok(); // Callback de éxito
    } catch (err) {
      console.error("Error de login:", err);
      error();
    }
  };

  // Función de logout
  const logout = (ok) => {
    setSesion(null);
    sessionStorage.removeItem("token");
    ok(); // Callback después de cerrar sesión
  };

  // Valor disponible para toda la app
  const value = { sesion, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Protege una página completa si no hay sesión
export const AuthPage = ({ children }) => {
  const { sesion } = useAuth();
  const location = useLocation();

  if (!sesion) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Protege contenido específico por rol (1 = admin, 2 = usuario, etc.)
export const AuthRol = ({ rolRequerido, children }) => {
  const { sesion } = useAuth();
  if (!sesion || sesion.rol !== rolRequerido) {
    return null;
  }

  return children;
};
