import express from 'express';
import xlsx from 'xlsx';
import path from 'path';

const excelRouter = express.Router();

// excelRouter.get('/leer', (req, res) => {
//   try {
//     // Asegurate de que el archivo esté en la raíz del proyecto o ajustá la ruta
//     const filePath = path.join(process.cwd(), 'BASE CAPITAL MARZO 25.xls');
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     const jsonData = xlsx.utils.sheet_to_json(sheet);
//     res.json(jsonData);
//   } catch (error) {
//     console.log('Error al leer Excel:', error);
//     res.status(500).send({ error: 'Hubo un problema al leer el archivo excel' });
//   }
// });


excelRouter.get('/leer-excel', (req, res) => {
  try {
    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xls');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);

    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 100;
    const busqueda = (req.query.busqueda || "").toLowerCase();

    // Filtrado
    const filtrado = jsonData.filter(fila => {
      return (
        (fila["DNI"]?.toString().toLowerCase().includes(busqueda)) ||
        (fila["Apelido y Nombre"]?.toLowerCase().includes(busqueda)) ||
        (fila[" 15 - Correo Electronico "]?.toLowerCase().includes(busqueda)) ||
        (fila["Su trabajo es"]?.toLowerCase().includes(busqueda)) ||
        (fila["7 - 7 - Parentesco"]?.toLowerCase().includes(busqueda))
      );
    });

    // Paginado
    const inicio = (pagina - 1) * limite;
    const fin = inicio + limite;
    const paginado = filtrado.slice(inicio, fin);

    res.json({
      datos: paginado,
      total: filtrado.length,
      pagina,
      limite
    });
  } catch (error) {
    console.error("Error al leer Excel:", error);
    res.status(500).send({ error: 'Hubo un problema al leer el archivo excel' });
  }
});


export default excelRouter;
