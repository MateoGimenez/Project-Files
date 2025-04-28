import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { ModalAgregarUsuario } from "./ModalAgregarUsuario";
import "./excel.css";

export const TablaExcel = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [reempadronado, setReempadronado] = useState("");
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [modalAgregarAbierto, setModalAgregarAbierto] = useState(false);
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

  const abrirModalAgregar = () => {
    setModalAgregarAbierto(true);
  };

  const cerrarModalAgregar = () => {
    setModalAgregarAbierto(false);
  };

  const guardarUsuario = (nuevoUsuario) => {
    console.log("Nuevo usuario guardado:", nuevoUsuario);
    obtenerDatos(); // Actualiza la tabla después de agregar
  };

  const borrarUsuario = async (usuario) => {
    const confirmar = window.confirm(`¿Estás seguro que quieres eliminar a ${usuario["Apelido y Nombre"]}?`);
    if (!confirmar) return;
  
    try {
      await fetch(`http://localhost:3000/eliminar-excel/${usuario["DNI"]}`, {
        method: 'DELETE'
      });

      obtenerDatos(); 
      alert('Usuario eliminado correctamente.');
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      alert('Hubo un problema al intentar eliminar el usuario.');
    }
  };

  return (
    <div className="excel-container">
      <h2 className="excel-title">📊 Datos del Excel</h2>

      {/* Buscador */}
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

      {/* Filtros */}
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

        <button className="agregar-button" onClick={abrirModalAgregar}>
          Agregar
        </button>
      </div>

      {/* Tabla */}
      <table className="excel-table">
        <thead>
          <tr>
            <th className="excel-table-header">DNI</th>
            <th className="excel-table-header">Apellido y Nombre</th>
            <th className="excel-table-header">Reempadronado</th>
            <th className="excel-table-header">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.length > 0 ? (
            datos.map((fila, i) => (
              <tr key={i} className="excel-table-row">
                <td className="excel-table-cell" onClick={() => abrirModal(fila)}>
                  {fila["DNI"] || "-"}
                </td>
                <td className="excel-table-cell" onClick={() => abrirModal(fila)}>
                  {fila["Apelido y Nombre"] || "-"}
                </td>
                <td className="excel-table-cell" onClick={() => abrirModal(fila)}>
                  {fila["3 - Reempadronado"] || "-"}
                </td>
                <td className="excel-table-cell">
                  <button
                    className="eliminar-button"
                    onClick={(e) => {
                      e.stopPropagation(); // Para que no abra el modal al borrar
                      borrarUsuario(fila);
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="excel-table-no-data">
                No se encontraron datos.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
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

      {/* Modales */}
      <Modal
        modalAbierto={modalAbierto}
        usuarioSeleccionado={usuarioSeleccionado}
        cerrarModal={cerrarModal}
      />

      <ModalAgregarUsuario
        modalAbierto={modalAgregarAbierto}
        cerrarModal={cerrarModalAgregar}
        guardarUsuario={guardarUsuario}
        usuariosExistentes={datos} 
      />

    </div>
  );
};
