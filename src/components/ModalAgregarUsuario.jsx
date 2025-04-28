import { useState } from "react";
import './ModalAgregarUsuario.css';

export const ModalAgregarUsuario = ({ modalAbierto, cerrarModal, guardarUsuario, usuariosExistentes }) => {
  const [nuevoUsuario, setNuevoUsuario] = useState({
    "Nº": "",
    "Apellido y Nombre": "",
    "DNI": "",
    "2 - Control": "",
    "3 - Reempadronado": "",
    "4 - Depto": "",
    "5 - Referente": "",
    "6 - Programa": "",
    "7 - 7 - Parentesco": "",
    "8 - Alta Programa": "",
    "9 - Fecha de Reemp": "",
    "10 - Domicilio": "",
    "11 - Barrio": "",
    "12 - Zona": "",
    "13 - Celular": "",
    "14 - Cel Tutores": "",
    " 15 - Correo Electronico ": "",
    "16 - CUIL": "",
    "17 - SIt. Cony": "",
    "18 - Fecha de Nac": "",
    "19 - Edad": "",
    "Ultimo Grado": "",
    "Turno": "",
    "ESCUELA": "",
    "Su trabajo es": "",
    "En la semana": "",
    "Ingreso": "",
    "Cobertura de Salud": "",
    "Discapacidad": "",
    "Certificado": "",
    "Esta Embarazada": "",
    "Meses de embarazo": "",
    "Tipo Vivienda": "",
    "Piso": "",
    "Techo": "",
    "Tenencia": "",
    "Baño": "",
    "Total Hab.": "",
    "Tiene Cocina": "",
    "SIst. Coccion": "",
    "Agua": "",
    "Electricidad": "",
    "Red Cloacal": "",
    "Gas Nat.": "",
    "Pavimento": "",
    "Internet": "",
    "TV": "",
    "BANCO NUEVO": "",
    "DNI BANCO": ""
  });

  const [errores, setErrores] = useState({});

  if (!modalAbierto) return null;

  const limpiarFormulario = () => {
    setNuevoUsuario({
      "Nº": "",
      "Apellido y Nombre": "",
      "DNI": "",
      "2 - Control": "",
      "3 - Reempadronado": "",
      "4 - Depto": "",
      "5 - Referente": "",
      "6 - Programa": "",
      "7 - 7 - Parentesco": "",
      "8 - Alta Programa": "",
      "9 - Fecha de Reemp": "",
      "10 - Domicilio": "",
      "11 - Barrio": "",
      "12 - Zona": "",
      "13 - Celular": "",
      "14 - Cel Tutores": "",
      "15 - Correo Electronico": "",
      "16 - CUIL": "",
      "17 - SIt. Cony": "",
      "18 - Fecha de Nac": "",
      "19 - Edad": "",
      "Ultimo Grado": "",
      "Turno": "",
      "ESCUELA": "",
      "Su trabajo es": "",
      "En la semana": "",
      "Ingreso": "",
      "Cobertura de Salud": "",
      "Discapacidad": "",
      "Certificado": "",
      "Esta Embarazada": "",
      "Meses de embarazo": "",
      "Tipo Vivienda": "",
      "Piso": "",
      "Techo": "",
      "Tenencia": "",
      "Baño": "",
      "Total Hab.": "",
      "Tiene Cocina": "",
      "SIst. Coccion": "",
      "Agua": "",
      "Electricidad": "",
      "Red Cloacal": "",
      "Gas Nat.": "",
      "Pavimento": "",
      "Internet": "",
      "TV": "",
      "BANCO NUEVO": "",
      "DNI BANCO": ""
    });
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const validarDNIUnico = (dni) => {
    // Verificar si el DNI ya está registrado en los usuarios existentes
    const existe = usuariosExistentes.some(usuario => usuario.DNI === dni);
    return existe;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "18 - Fecha de Nac") {
      const edadCalculada = calcularEdad(value);
      setNuevoUsuario(prev => ({
        ...prev,
        [name]: value,
        "19 - Edad": edadCalculada.toString(),
      }));
    } else if (name === "DNI") {
      if (validarDNIUnico(value)) {
        setErrores((prev) => ({
          ...prev,
          DNI: "El DNI ingresado ya está registrado.",
        }));
      } else {
        setErrores((prev) => ({
          ...prev,
          DNI: "",
        }));
      }
      setNuevoUsuario(prev => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setErrores((prev) => ({
        ...prev,
        DNI: "",
      }));
      setNuevoUsuario(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación del DNI único
    if (validarDNIUnico(nuevoUsuario.DNI)) {
      setErrores((prev) => ({
        ...prev,
        DNI: "El DNI ingresado ya está registrado.",
      }));
      return;
    }

    try {
      // Realizamos el POST solo si la validación pasa
      const response = await fetch('http://localhost:3000/agregar-persona', {  // Aquí iría la URL del endpoint de tu API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        // Si la respuesta es exitosa, guardamos el nuevo usuario
        guardarUsuario(nuevoUsuario);
        cerrarModal();
        limpiarFormulario();
      } else {
        // Si la respuesta no es exitosa, mostramos un mensaje de error
        const errorData = await response.json();
        alert(`Error al guardar el usuario: ${errorData.message}`);
      }
    } catch (error) {
      // En caso de error en la solicitud
      console.error('Error al hacer el POST:', error);
      alert('Ocurrió un error al guardar el usuario.');
    }
  };

  return (
    <div className="modal-overlay" onClick={cerrarModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Agregar Nuevo Usuario</h2>

        <form onSubmit={handleSubmit} className="modal-formulario">

          {/* Campos */}
          <div className="modal-form-group">
            <label>Apellido y Nombre:</label>
            <input type="text" name="Apellido y Nombre" value={nuevoUsuario["Apellido y Nombre"]} onChange={handleChange} required />
          </div>

          <div className="modal-form-group">
            <label>DNI:</label>
            <input type="text" name="DNI" value={nuevoUsuario["DNI"]} onChange={handleChange} required />
          </div>

          <div className="modal-form-group">
            <label>Control:</label>
            <input type="text" name="2 - Control" value={nuevoUsuario["2 - Control"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Reempadronado:</label>
            <select name="3 - Reempadronado" value={nuevoUsuario["3 - Reempadronado"]} onChange={handleChange}>
              <option value="">Seleccione</option>
              <option value="SI">Sí</option>
              <option value="NO">No</option>
            </select>
          </div>

          <div className="modal-form-group">
            <label>Departamento:</label>
            <input type="text" name="4 - Depto" value={nuevoUsuario["4 - Depto"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Referente:</label>
            <input type="text" name="5 - Referente" value={nuevoUsuario["5 - Referente"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Programa:</label>
            <input type="text" name="6 - Programa" value={nuevoUsuario["6 - Programa"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Parentesco:</label>
            <input type="text" name="7 - 7 - Parentesco" value={nuevoUsuario["7 - 7 - Parentesco"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Alta Programa:</label>
            <input type="date" name="8 - Alta Programa" value={nuevoUsuario["8 - Alta Programa"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Fecha de Reempadronamiento:</label>
            <input type="date" name="9 - Fecha de Reemp" value={nuevoUsuario["9 - Fecha de Reemp"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Domicilio:</label>
            <input type="text" name="10 - Domicilio" value={nuevoUsuario["10 - Domicilio"]} onChange={handleChange} />
          </div>

          {/* y continúas agregando... */}

          {/* Resumimos: otros campos similares hasta completar */}

          <div className="modal-form-group">
            <label>Fecha de Nacimiento:</label>
            <input type="date" name="18 - Fecha de Nac" value={nuevoUsuario["18 - Fecha de Nac"]} onChange={handleChange} required />
          </div>

          <div className="modal-form-group">
            <label>Edad:</label>
            <input type="number" name="19 - Edad" value={nuevoUsuario["19 - Edad"]} readOnly />
          </div>

          <div className="modal-form-group">
            <label>Correo Electrónico:</label>
            <input type="email" name=" 15 - Correo Electronico " value={nuevoUsuario[" 15 - Correo Electronico "]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Celular:</label>
            <input type="tel" name="13 - Celular" value={nuevoUsuario["13 - Celular"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>Celular Tutores:</label>
            <input type="tel" name="14 - Cel Tutores" value={nuevoUsuario["14 - Cel Tutores"]} onChange={handleChange} />
          </div>

          <div className="modal-form-group">
            <label>CUIL:</label>
            <input type="text" name="16 - CUIL" value={nuevoUsuario["16 - CUIL"]} onChange={handleChange} />
          </div>

      <div className="modal-form-group">
        <label>Situación Conyugal:</label>
        <input type="text" name="17 - SIt. Cony" value={nuevoUsuario["17 - SIt. Cony"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Ultimo Grado:</label>
        <input type="text" name="Ultimo Grado" value={nuevoUsuario["Ultimo Grado"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Turno:</label>
        <input type="text" name="Turno" value={nuevoUsuario["Turno"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Escuela:</label>
        <input type="text" name="ESCUELA" value={nuevoUsuario["ESCUELA"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Trabajo:</label>
        <input type="text" name="Su trabajo es" value={nuevoUsuario["Su trabajo es"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Trabajo en la semana:</label>
        <input type="text" name="En la semana" value={nuevoUsuario["En la semana"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Ingreso Económico:</label>
        <input type="text" name="Ingreso" value={nuevoUsuario["Ingreso"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Cobertura de Salud:</label>
        <input type="text" name="Cobertura de Salud" value={nuevoUsuario["Cobertura de Salud"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Discapacidad:</label>
        <input type="text" name="Discapacidad" value={nuevoUsuario["Discapacidad"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Certificado de Discapacidad:</label>
        <input type="text" name="Certificado" value={nuevoUsuario["Certificado"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Está Embarazada:</label>
        <select name="Esta Embarazada" value={nuevoUsuario["Esta Embarazada"]} onChange={handleChange}>
          <option value="">Seleccione</option>
          <option value="Sí">Sí</option>
          <option value="No">No</option>
        </select>
      </div>

      <div className="modal-form-group">
        <label>Meses de Embarazo:</label>
        <input type="number" name="Meses de embarazo" value={nuevoUsuario["Meses de embarazo"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Tipo de Vivienda:</label>
        <input type="text" name="Tipo Vivienda" value={nuevoUsuario["Tipo Vivienda"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Piso:</label>
        <input type="text" name="Piso" value={nuevoUsuario["Piso"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Techo:</label>
        <input type="text" name="Techo" value={nuevoUsuario["Techo"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Tenencia:</label>
        <input type="text" name="Tenencia" value={nuevoUsuario["Tenencia"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Baño:</label>
        <input type="text" name="Baño" value={nuevoUsuario["Baño"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Total de Habitaciones:</label>
        <input type="number" name="Total Hab." value={nuevoUsuario["Total Hab."]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Tiene Cocina:</label>
        <input type="text" name="Tiene Cocina" value={nuevoUsuario["Tiene Cocina"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Sistema de Cocción:</label>
        <input type="text" name="SIst. Coccion" value={nuevoUsuario["SIst. Coccion"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Agua:</label>
        <input type="text" name="Agua" value={nuevoUsuario["Agua"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Electricidad:</label>
        <input type="text" name="Electricidad" value={nuevoUsuario["Electricidad"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Red Cloacal:</label>
        <input type="text" name="Red Cloacal" value={nuevoUsuario["Red Cloacal"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Gas Natural:</label>
        <input type="text" name="Gas Nat." value={nuevoUsuario["Gas Nat."]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Pavimento:</label>
        <input type="text" name="Pavimento" value={nuevoUsuario["Pavimento"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Internet:</label>
        <input type="text" name="Internet" value={nuevoUsuario["Internet"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>TV:</label>
        <input type="text" name="TV" value={nuevoUsuario["TV"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>Banco Nuevo:</label>
        <input type="text" name="BANCO NUEVO" value={nuevoUsuario["BANCO NUEVO"]} onChange={handleChange} />
      </div>

      <div className="modal-form-group">
        <label>DNI Banco:</label>
        <input type="text" name="DNI BANCO" value={nuevoUsuario["DNI BANCO"]} onChange={handleChange} />
      </div>


          {/* Botones */}
          <div className="modal-botones">
            <button type="submit" className="modal-save-button">Guardar</button>
            <button type="button" onClick={cerrarModal} className="modal-close-button">Cancelar</button>
          </div>

        </form>
      </div>
    </div>
  );
};
