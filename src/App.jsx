import { Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { PerfilPage } from "./components/Profile/PerfilPage.jsx"
import { LoginPage } from "./components/Auth/Login.jsx";
import { SinRuta } from "./components/SinRuta.jsx";
import { AuthPage } from "./components/Auth/Auth.jsx";
import { TablaExcel } from "./components/TablaExcel/excel.jsx";
import "./app.css"

function App() {
  return (
    <>
      <Routes>
      <Route path="/" element={<AuthPage> <Layout /> </AuthPage>}>
        <Route index element={<PerfilPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="Registros" element={<TablaExcel/>}></Route>
        <Route path="*" element={<SinRuta />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </>
  )
}

export default App;