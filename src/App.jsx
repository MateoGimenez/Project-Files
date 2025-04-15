import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { PerfilPage } from "./components/PerfilPage.jsx"
import { LoginPage } from "./components/Login.jsx";
import { SinRuta } from "./components/SinRuta.jsx";
import { AuthPage } from "./components/Auth.jsx";
import {Menu} from "./components/Menu.jsx"
import "./app.css"

function App() {
  return (
    <>
      <Menu/>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <AuthPage>
                <PerfilPage/>
              </AuthPage>
            }
          />
          <Route
            path="/perfil"
            element={
              <AuthPage>
                <PerfilPage />
              </AuthPage>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<SinRuta />} />

        </Route>
          
      </Routes>
    </>
  );

}

export default App;