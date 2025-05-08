import { Link, Outlet } from 'react-router-dom'
import { AuthRol } from './components/Auth/Auth.jsx'
import "./Layout.css"
export const Layout = () => {
  return (
    <>
      <header className="main-header">
        <nav className="nav-container">
          <ul className="nav-list">

            <li className='nav-button'>
              <Link to="/Registros" className="nav-link">Registros</Link>
            </li>

            <li className="nav-item">
              <Link to="/perfil" className="nav-button">
                <p>Imagen del perfil</p>
              </Link>
            </li>

            <AuthRol superusuario={1}>
              <li className="nav-item">
                <Link to="/usuarios" className="nav-button">
                <p>Imagen de admin</p>
                </Link>
              </li>
            </AuthRol>
          </ul>
        </nav>
      </header>

      <main className="content">
        <Outlet />
      </main>
    </>
  );
};