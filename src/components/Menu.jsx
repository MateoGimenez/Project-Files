import { Link, Outlet } from 'react-router-dom'
import { AuthRol } from './Auth'
import "./Menu.css"

export const Menu = () => {
  return (
    <>
      <header className="main-header">
        <nav className="nav-container">
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/perfil" className="nav-button">
                <img src="./assets/perfil.svg" alt="Perfil" />
              </Link>
            </li>

            <AuthRol superusuario={1}>
              <li className="nav-item">
                <Link to="/usuarios" className="nav-button">
                  <img src="./assets/usuarios.svg" alt="Usuarios" />
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
  )
}
