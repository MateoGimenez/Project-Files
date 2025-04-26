import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import "./excel.css";

export const TablaExcel = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [reempadronado, setReempadronado] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const obtenerDatos = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/leer-excel?busqueda=${busqueda}&reempadronado=${reempadronado}&page=${pagina}&limit=10`
      );
      const data = await res.json();
      setDatos(data.datos);
      setTotalPaginas(data.totalPages);
    } catch (error) {
      console.error("Error al obtener datos del Excel:", error);
    }
  };

  useEffect(() => {
    obtenerDatos();
  }, [busqueda, reempadronado, pagina]);

  const handleBuscar = () => {
    setBusqueda(textoBusqueda);
    setPagina(1);
  };

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setUsuarioSeleccionado(null);
  };

  return (
    <div className="excel-container">
      <h2 className="excel-title">📊 Datos del Excel</h2>

      <div className="buscador">
        <input
          type="text"
          className="buscador-input"
          value={textoBusqueda}
          onChange={(e) => setTextoBusqueda(e.target.value)}
          placeholder="Buscar por nombre, DNI..."
        />
        <button className="buscador-button" onClick={handleBuscar}>
          Buscar
        </button>
      </div>

      <div className="filtros">
        <select
          className="filtros-select"
          value={reempadronado}
          onChange={(e) => {
            setReempadronado(e.target.value);
            setPagina(1);
          }}
        >
          <option value="">Todos</option>
          <option value="SI">Reempadronado</option>
          <option value="NO">No Reempadronado</option>
        </select>
      </div>

      <table className="excel-table">
        <thead>
          <tr>
            <th className="excel-table-header">DNI</th>
            <th className="excel-table-header">Apellido y Nombre</th>
            <th className="excel-table-header">Reempadronado</th>
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, i) => (
              <tr key={i} className="excel-table-row" onClick={() => abrirModal(fila)}>
                <td className="excel-table-cell">{fila["DNI"] || "-"}</td>
                <td className="excel-table-cell">{fila["Apelido y Nombre"] || "-"}</td>
                <td className="excel-table-cell">{fila["3 - Reempadronado"] || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="excel-table-no-data">
                No se encontraron datos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setPagina((prev) => Math.max(prev - 1, 1))}
          disabled={pagina === 1}
        >
          Anterior
        </button>
        <span className="pagination-info">
          Página {pagina} de {totalPaginas}
        </span>
        <button
          className="pagination-button"
          onClick={() => setPagina((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={pagina === totalPaginas}
        >
          Siguiente
        </button>
      </div>
        
      <Modal 
      modalAbierto={modalAbierto} 
      usuarioSeleccionado={usuarioSeleccionado}
      cerrarModal={cerrarModal}
      />
      
    </div>
  );
};
