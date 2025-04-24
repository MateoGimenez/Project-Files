import { useEffect, useState } from "react";
import "./excel.css";

export const TablaExcel = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");  // Variable para almacenar la búsqueda
  const [textoBusqueda, setTextoBusqueda] = useState(""); // Estado para el texto de búsqueda
  const [reempadronado, setReempadronado] = useState("");  // Estado para filtro de reempadronado

  // Función para obtener los datos desde el backend
  const obtenerDatos = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/excel/leer-excel?busqueda=${busqueda}&reempadronado=${reempadronado}`
      );
      const data = await res.json();
      setDatos(data.datos);
    } catch (error) {
      console.error("Error al obtener datos del Excel:", error);
    }
  };

  // useEffect para cargar los datos al iniciar o cuando cambien los filtros
  useEffect(() => {
    obtenerDatos();  // Llamamos a la función cada vez que cambien los filtros
  }, [busqueda, reempadronado]);  // Dependemos de los filtros para obtener los datos

  // Función que maneja la acción de buscar
  const handleBuscar = () => {
    setBusqueda(textoBusqueda); // Actualiza el estado de busqueda con el texto introducido
  };

  return (
    <div className="excel-container">
      <h2 className="excel-title">📊 Datos del Excel</h2>

      <div className="buscador">
        <input
          type="text"
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          placeholder="Buscar por nombre, DNI, correo..."
        />
        <button onClick={handleBuscar}>Buscar</button>
      </div>

      <div className="filtros">
        <select
          value={reempadronado}
          onChange={(e) => setReempadronado(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="SI">Reempadronado</option>
          <option value="NO">No Reempadronado</option>
        </select>
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
            <th>Reempadronado</th>
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, i) => (
              <tr key={i}>
                <td>{fila["DNI"]}</td>
                <td>{fila["Apelido y Nombre"]}</td>
                <td>{fila[" 15 - Correo Electronico "]}</td>
                <td>{fila["18 - Fecha de Nac"]}</td>
                <td>{fila["19 - Edad"]}</td>
                <td>{fila["Su trabajo es"]}</td>
                <td>{fila["7 - 7 - Parentesco"]}</td>
                <td>{fila["3 - Reempadronado"]}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No se encontraron datos.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
