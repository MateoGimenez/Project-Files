import express from 'express';
import xlsx from 'xlsx';
import { ValidarPost , validarJwt , validarRol , validarId } from './validaciones.js';

const excelRouter = express.Router();
let excelData = [];

// Función para cargar datos
const cargarExcel = () => {
  try {
    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xlsx');
    const data = [];

    workbook.SheetNames.forEach(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const sheetData = xlsx.utils.sheet_to_json(sheet, { defval: '' });
      sheetData.forEach(row => data.push(row));
    });

    return data;
  } catch (error) {
    console.error('Error al leer el archivo Excel:', error);
    return [];
  }
};

// Función para guardar datos
const guardarExcel = (data) => {
  const ws = xlsx.utils.json_to_sheet(data);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, 'Datos');
  xlsx.writeFile(wb, './BASE CAPITAL MARZO 25.xlsx');
};

// Cargar datos iniciales
excelData = cargarExcel();

// Ruta: Listar datos (ya existente)
excelRouter.get('/leer-excel', (req, res) => {
  try {
    const dni = req.query.dni?.toString();
    const reempadronado = req.query.reempadronado?.toUpperCase();
    const busqueda = req.query.busqueda?.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    let filtrado = excelData;

    if (dni) {
      filtrado = filtrado.filter(fila => fila["DNI"]?.toString() === dni);
    }

    if (reempadronado) {
      filtrado = filtrado.filter(fila => {
        const valor = (fila["3 - Reempadronado"] || "").toUpperCase();
        if (reempadronado === "SI") return valor === "SI";
        if (reempadronado === "NO") return valor !== "SI";
        return true;
      });
    }

    if (busqueda) {
      filtrado = filtrado.filter(fila => {
        return (
          fila["DNI"]?.toString().toLowerCase().includes(busqueda) ||
          fila["Apelido y Nombre"]?.toLowerCase().includes(busqueda)
        );
      });
    }

    const total = filtrado.length;
    const startIndex = (page - 1) * limit;
    const paginatedData = filtrado.slice(startIndex, startIndex + limit);

    res.json({
      datos: paginatedData,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error("Error al procesar los datos:", error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

excelRouter.get('/nombres-hojas', (req, res) => {
  try {
    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xlsx');
    const nombresDeHojas = workbook.SheetNames;
    res.json({ sheetNames: nombresDeHojas });
  } catch (error) {
    console.error("Error al obtener nombres de hojas:", error);
    res.status(500).send({ error: "Error al obtener nombres de hojas" });
  }
});


// Ruta: Obtener un usuario por DNI
excelRouter.get('/leer-excel/:dni', (req, res) => {
  try {
    const dni = req.params.dni;
    const usuario = excelData.find(fila => fila["DNI"]?.toString() === dni);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

const HOJAS_PERMITIDAS = [
  "Vale la Pena",
  "Familias",
  "Formadores",
  "Vivir",
  "Asist Dom",
  "BECAS DEP",
  "CONTRATADOS",
  "Flia de Acog",
  "FES",
  "HOGAR SAN JOSE",
  "HONRAR LA VIDA",
  "INT DIF ARTE",
  "OP CONV",
  "Por una vida S",
  "Prom Com",
  "PROSOCA",
  "Res Nuev Vida",
  "Subsec NAYF",
  "UNIV 3ra Edad"
];

excelRouter.post('/agregar-persona-hoja', ValidarPost, (req, res) => {
  try {
    const { Hoja, datos } = req.body;

    if (!Hoja || !datos) {
      return res.status(400).json({ error: 'Faltan el nombre de la hoja o los datos' });
    }

    // Verificar si la hoja está en la lista permitida
    if (!HOJAS_PERMITIDAS.includes(Hoja)) {
      return res.status(400).json({ error: `La hoja "${Hoja}" no está permitida o no existe` });
    }

    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xlsx');

    if (!workbook.SheetNames.includes(Hoja)) {
      return res.status(404).json({ error: `La hoja "${Hoja}" no existe en el archivo` });
    }

    const sheet = workbook.Sheets[Hoja];
    const existingData = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // Estandarizamos las propiedades antes de agregar
    const datosEstandarizados = {};
    Object.keys(datos).forEach(key => {
      const claveNormalizada = key.trim().replace(/\s+/g, '_');
      datosEstandarizados[claveNormalizada] = datos[key];
    });

    // Agregar los nuevos datos
    existingData.push(datosEstandarizados);

    // Actualizar la hoja
    const nuevaHoja = xlsx.utils.json_to_sheet(existingData);
    workbook.Sheets[Hoja] = nuevaHoja;

    // Guardar el archivo
    xlsx.writeFile(workbook, './BASE CAPITAL MARZO 25.xlsx');

    res.status(201).json({ mensaje: `Persona agregada correctamente a la Hoja "${Hoja}"` });

  } catch (error) {
    console.error("Error al agregar persona a la Hoja:", error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});



// Ruta: Eliminar un usuario de una hoja específica
excelRouter.delete('/eliminar-excel/:dni', (req, res) => {
  try {
    const dni = req.params.dni;

    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xlsx');

    if (!workbook.SheetNames.includes(hoja)) {
      return res.status(404).json({ error: `La hoja "${hoja}" no existe en el archivo` });
    }

    const sheet = workbook.Sheets[hoja];
    const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

    // Filtrar los datos para eliminar el usuario
    const updatedData = data.filter(fila => fila["DNI"]?.toString() !== dni);

    if (data.length === updatedData.length) {
      return res.status(404).json({ error: `No se encontró el usuario con DNI "${dni}" en la hoja "${hoja}"` });
    }

    // Actualizar la hoja con los datos filtrados
    const nuevaHoja = xlsx.utils.json_to_sheet(updatedData);
    workbook.Sheets[hoja] = nuevaHoja;

    // Guardar el archivo
    xlsx.writeFile(workbook, './BASE CAPITAL MARZO 25.xlsx');

    res.json({ mensaje: `Usuario con DNI "${dni}" eliminado de la hoja "${hoja}" correctamente` });

  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});


export default excelRouter;
