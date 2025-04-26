import { useState } from "react";

// Este componente será utilizado tanto para agregar como para editar un usuario
export const AgregarEditarUsuario = ({ usuarioSeleccionado, onClose, onSave }) => {
  const [usuario, setUsuario] = useState({
    DNI: usuarioSeleccionado?.DNI || "",
    "Apelido y Nombre": usuarioSeleccionado?.["Apelido y Nombre"] || "",
    "email": usuarioSeleccionado?.email || "",
    "3 - Reempadronado": usuarioSeleccionado?.["3 - Reempadronado"] || "",
    "10 - Domicilio": usuarioSeleccionado?.["10 - Domicilio"] || "",
    // Puedes agregar más campos según sea necesario
  });

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    onSave(usuario);
    onClose(); // Cerrar el modal después de guardar
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{usuarioSeleccionado ? "Editar Usuario" : "Agregar Usuario"}</h2>

        {/* Formulario */}
        <form>
          <label>DNI</label>
          <input
            type="text"
            name="DNI"
            value={usuario.DNI}
            onChange={handleChange}
          />
          
          <label>Apellido y Nombre</label>
          <input
            type="text"
            name="Apelido y Nombre"
            value={usuario["Apelido y Nombre"]}
            onChange={handleChange}
          />
          
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={usuario.email}
            onChange={handleChange}
          />
          
          <label>Reempadronado</label>
          <select
            name="3 - Reempadronado"
            value={usuario["3 - Reempadronado"]}
            onChange={handleChange}
          >
            <option value="SI">SI</option>
            <option value="NO">NO</option>
          </select>

          <label>Domicilio</label>
          <input
            type="text"
            name="10 - Domicilio"
            value={usuario["10 - Domicilio"]}
            onChange={handleChange}
          />
          
          {/* Agrega más campos según sea necesario */}

          <div>
            <button type="button" onClick={handleSave}>
              {usuarioSeleccionado ? "Guardar Cambios" : "Agregar Usuario"}
            </button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
