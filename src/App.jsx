import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { PerfilPage } from "./components/PerfilPage.jsx"
import { LoginPage } from "./components/Login.jsx";
import { SinRuta } from "./components/SinRuta.jsx";
import { AuthPage } from "./components/Auth.jsx";
import "./app.css"

function App() {
  return (
    <>
      <Routes>
      <Route
        path="/"
        element={
          <AuthPage>
            <Layout />
          </AuthPage>
        }
      >
        <Route
          index
          element={<PerfilPage />}
        />
        <Route
          path="perfil"
          element={<PerfilPage />}
        />
        <Route path="*" element={<SinRuta />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </>
  )
}

export default App;