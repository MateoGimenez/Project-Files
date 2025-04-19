import express from 'express';
import xlsx from 'xlsx';
import path from 'path';

const excelRouter = express.Router();

excelRouter.get('/leer-excel', (req, res) => {
  try {
    // Asegurate de que el archivo esté en la raíz del proyecto o ajustá la ruta
    const filePath = path.join(process.cwd(), 'BASE CAPITAL MARZO 25.xls');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(sheet);
    res.json(jsonData);
  } catch (error) {
    console.log('Error al leer Excel:', error);
    res.status(500).send({ error: 'Hubo un problema al leer el archivo excel' });
  }
});

export default excelRouter;
