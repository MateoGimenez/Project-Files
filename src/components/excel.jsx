import { useEffect, useState } from "react";
import "./excel.css";

export const TablaExcel = () => {
  const [datos, setDatos] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [limite, setLimite] = useState(100);
  const [busqueda, setBusqueda] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");

  const totalPaginas = Math.ceil(total / limite);

  const obtenerDatos = async (paginaActual) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/excel/leer-excel?pagina=${paginaActual}&limite=${limite}&busqueda=${busqueda}`
      );
      const data = await res.json();
      setDatos(data.datos);
      setTotal(data.total);
    } catch (error) {
      console.error("Error al obtener datos del Excel:", error);
    }
  };

  useEffect(() => {
    obtenerDatos(pagina);
  }, [pagina, busqueda]); // se actualiza cuando cambia la página o la búsqueda

  const handleBuscar = () => {
    setPagina(1); // Reinicia a la primera página
    setBusqueda(textoBusqueda);
  };

  return (
    <div className="excel-container">
      <h2 className="excel-title">📊 Datos del Excel (Página {pagina})</h2>

      <div className="buscador">
        <input
          type="text"
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          placeholder="Buscar por nombre, DNI, correo..."
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>

      <table className="excel-table">
        <thead>
          <tr>
            <th>DNI</th>
            <th>Apellido y Nombre</th>
            <th>Correo</th>
            <th>Fecha de Nac</th>
            <th>Edad</th>
            <th>Trabajo</th>
            <th>Parentesco</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((fila, i) => (
            <tr key={i}>
              <td>{fila["DNI"]}</td>
              <td>{fila["Apelido y Nombre"]}</td>
              <td>{fila[" 15 - Correo Electronico "]}</td>
              <td>{fila["18 - Fecha de Nac"]}</td>
              <td>{fila["19 - Edad"]}</td>
              <td>{fila["Su trabajo es"]}</td>
              <td>{fila["7 - 7 - Parentesco"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)}>
          Anterior
        </button>
        <span>
          Página {pagina} de {totalPaginas}
        </span>
        <button
          disabled={pagina === totalPaginas}
          onClick={() => setPagina(pagina + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};
