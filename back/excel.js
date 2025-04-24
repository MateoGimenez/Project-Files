import express from 'express';
import xlsx from 'xlsx';

const excelRouter = express.Router();

// Cargar el archivo Excel y extraer solo los campos necesarios
const cargarExcel = () => {
  try {
    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xls');
    const data = [];

    // Iterar sobre todas las hojas del libro
    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const sheetData = xlsx.utils.sheet_to_json(sheet, {
        header: 1,
        defval: ''
      }).map(row => ({
        DNI: row[0],
        "Apelido y Nombre": row[1],
        "3 - Reempadronado": row[2]
      }));

      data.push(...sheetData);
    });

    return data; // Retornar los datos cargados
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
    return [];
  }
};

// Cargar los datos cuando arranca el servidor
const excelData = cargarExcel();

excelRouter.get('/leer-excel', (req, res) => {
  try {
    const dni = req.query.dni?.toString();
    const reempadronado = req.query.reempadronado?.toUpperCase();
    const busqueda = req.query.busqueda?.toLowerCase();
    const page = parseInt(req.query.page) || 1; // Número de página
    const limit = parseInt(req.query.limit) || 10; // Límites por página

    let filtrado = excelData;

    // Filtrar por DNI
    if (dni) {
      filtrado = filtrado.filter(fila => fila["DNI"]?.toString() === dni);
    }

    // Filtrar por Reempadronado
    if (reempadronado) {
      filtrado = filtrado.filter(fila => fila["3 - Reempadronado"]?.toUpperCase() === reempadronado);
    }

    // Filtrar por búsqueda global
    if (busqueda) {
      filtrado = filtrado.filter(fila => {
        return (
          fila["DNI"]?.toString().toLowerCase().includes(busqueda) ||
          fila["Apelido y Nombre"]?.toLowerCase().includes(busqueda)
        );
      });
    }

    // Implementar paginación
    const total = filtrado.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtrado.slice(startIndex, endIndex);

    // Responder con los datos filtrados y paginados
    res.json({
      datos: paginatedData,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error("Error al procesar los datos:", error);
    res.status(500).send({ error: 'Hubo un problema al procesar los datos del Excel' });
  }
});

export default excelRouter;