import { useState } from "react";
import './Modal.css'

export const Modal = ({ modalAbierto, usuarioSeleccionado, cerrarModal }) => {
  if (!modalAbierto || !usuarioSeleccionado) return null;

  return (
    <>
      <div className="modal-overlay" onClick={cerrarModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Detalles del Usuario</h2>

          <div className="modal-datos">
            <p><strong>Nº:</strong> {usuarioSeleccionado["Nº"]}</p>
            <p><strong>Apellido y Nombre:</strong> {usuarioSeleccionado["Apelido y Nombre"]}</p>
            <p><strong>DNI:</strong> {usuarioSeleccionado["DNI"]}</p>
            <p><strong>Control:</strong> {usuarioSeleccionado["2 - Control"]}</p>
            <p><strong>Reempadronado:</strong> {usuarioSeleccionado["3 - Reempadronado"]}</p>
            <p><strong>Departamento:</strong> {usuarioSeleccionado["4 - Depto"]}</p>
            <p><strong>Referente:</strong> {usuarioSeleccionado["5 - Referente"]}</p>
            <p><strong>Programa:</strong> {usuarioSeleccionado["6 - Programa"]}</p>
            <p><strong>Parentesco:</strong> {usuarioSeleccionado["7 - 7 - Parentesco"]}</p>
            <p><strong>Alta Programa:</strong> {usuarioSeleccionado["8 - Alta Programa"]}</p>
            <p><strong>Fecha de Reempadronamiento:</strong> {usuarioSeleccionado["9 - Fecha de Reemp"]}</p>
            <p><strong>Domicilio:</strong> {usuarioSeleccionado["10 - Domicilio"]}</p>
            <p><strong>Barrio:</strong> {usuarioSeleccionado["11 - Barrio"]}</p>
            <p><strong>Zona:</strong> {usuarioSeleccionado["12 - Zona"]}</p>
            <p><strong>Celular:</strong> {usuarioSeleccionado["13 - Celular"]}</p>
            <p><strong>Celular Tutores:</strong> {usuarioSeleccionado["14 - Cel Tutores"]}</p>
            <p><strong>Correo Electrónico:</strong> {usuarioSeleccionado[" 15 - Correo Electronico "]}</p>
            <p><strong>CUIL:</strong> {usuarioSeleccionado["16 - CUIL"]}</p>
            <p><strong>Situación Conyugal:</strong> {usuarioSeleccionado["17 - SIt. Cony"]}</p>
            <p><strong>Fecha de Nacimiento:</strong> {usuarioSeleccionado["18 - Fecha de Nac"]}</p>
            <p><strong>Edad:</strong> {usuarioSeleccionado["19 - Edad"]}</p>
            <p><strong>Último Grado:</strong> {usuarioSeleccionado["Ultimo Grado"]}</p>
            <p><strong>Turno:</strong> {usuarioSeleccionado["Turno"]}</p>
            <p><strong>Escuela:</strong> {usuarioSeleccionado["ESCUELA"]}</p>
            <p><strong>Trabajo:</strong> {usuarioSeleccionado["Su trabajo es"]}</p>
            <p><strong>En la semana:</strong> {usuarioSeleccionado["En la semana"]}</p>
            <p><strong>Ingreso:</strong> {usuarioSeleccionado["Ingreso"]}</p>
            <p><strong>Cobertura de Salud:</strong> {usuarioSeleccionado["Cobertura de Salud"]}</p>
            <p><strong>Discapacidad:</strong> {usuarioSeleccionado["Discapacidad"]}</p>
            <p><strong>Certificado:</strong> {usuarioSeleccionado["Certificado"]}</p>
            <p><strong>Embarazo:</strong> {usuarioSeleccionado["Esta Embarazada"]}</p>
            <p><strong>Meses de embarazo:</strong> {usuarioSeleccionado["Meses de embarazo"]}</p>
            <p><strong>Tipo Vivienda:</strong> {usuarioSeleccionado["Tipo Vivienda"]}</p>
            <p><strong>Piso:</strong> {usuarioSeleccionado["Piso"]}</p>
            <p><strong>Techo:</strong> {usuarioSeleccionado["Techo"]}</p>
            <p><strong>Tenencia:</strong> {usuarioSeleccionado["Tenencia"]}</p>
            <p><strong>Baño:</strong> {usuarioSeleccionado["Baño"]}</p>
            <p><strong>Total Habitaciones:</strong> {usuarioSeleccionado["Total Hab."]}</p>
            <p><strong>Tiene Cocina:</strong> {usuarioSeleccionado["Tiene Cocina"]}</p>
            <p><strong>Sistema de Cocción:</strong> {usuarioSeleccionado["SIst. Coccion"]}</p>
            <p><strong>Agua:</strong> {usuarioSeleccionado["Agua"]}</p>
            <p><strong>Electricidad:</strong> {usuarioSeleccionado["Electricidad"]}</p>
            <p><strong>Red Cloacal:</strong> {usuarioSeleccionado["Red Cloacal"]}</p>
            <p><strong>Gas Natural:</strong> {usuarioSeleccionado["Gas Nat."]}</p>
            <p><strong>Pavimento:</strong> {usuarioSeleccionado["Pavimento"]}</p>
            <p><strong>Internet:</strong> {usuarioSeleccionado["Internet"]}</p>
            <p><strong>TV:</strong> {usuarioSeleccionado["TV"]}</p>
            <p><strong>Banco Nuevo:</strong> {usuarioSeleccionado["BANCO NUEVO"]}</p>
            <p><strong>DNI Banco:</strong> {usuarioSeleccionado["DNI BANCO"]}</p>
          </div>

          <button onClick={cerrarModal} className="modal-close-button"> Cerrar </button>
        </div>
      </div>
    </>
  );
};
