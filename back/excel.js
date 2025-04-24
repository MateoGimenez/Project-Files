import express from 'express';
import xlsx from 'xlsx';
import path from 'path';

const excelRouter = express.Router();

// Variable global para almacenar los datos
let excelData = [];

const cargarExcel = () => {
  try {
    // Leemos el archivo Excel solo una vez
    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xls');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convertimos a JSON
    excelData = xlsx.utils.sheet_to_json(sheet);

    console.log('Excel cargado correctamente.');
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
  }
};

// Cargar los datos cuando arranca el servidor
cargarExcel();

excelRouter.get('/leer-excel', (req, res) => {
  try {
    const dni = req.query.dni?.toString();
    const reempadronado = req.query.reempadronado?.toUpperCase();
    const busqueda = req.query.busqueda?.toLowerCase();

    // Función de utilidad para obtener valores seguros
    const getValue = (fila, campo) => fila[campo]?.toString().toLowerCase() || '';

    let filtrado = excelData;

    // Filtrar por DNI
    if (dni) {
      filtrado = filtrado.filter(fila => {
        const campoDNI = fila["DNI"]?.toString();
        const campoNro = fila["Nº"]?.toString();
        return campoDNI === dni || campoNro === dni;
      });
    }

    // Filtrar por Reempadronado
    if (reempadronado) {
      filtrado = filtrado.filter(fila =>
        fila["3 - Reempadronado"]?.toUpperCase() === reempadronado
      );
    }

    // Filtrar por búsqueda global
    if (busqueda) {
      filtrado = filtrado.filter(fila => {
        return (
          getValue(fila, "DNI").includes(busqueda) ||
          getValue(fila, "Apellido y Nombre").includes(busqueda) || // Corregido "Apelido"
          getValue(fila, "15 - Correo Electronico").includes(busqueda)
        );
      });
    }

    res.json({ datos: filtrado });

  } catch (error) {
    console.error("Error al procesar los datos:", error);
    res.status(500).send({ error: 'Hubo un problema al procesar los datos del Excel' });
  }
});



export default excelRouter;
