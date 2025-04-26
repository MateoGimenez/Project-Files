import express from 'express';
import xlsx from 'xlsx';
import fs from 'fs'; // Para escribir el archivo

const excelRouter = express.Router();
let excelData = [];

// Función para cargar datos
const cargarExcel = () => {
  try {
    const workbook = xlsx.readFile('./BASE CAPITAL MARZO 25.xls');
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
  xlsx.writeFile(wb, './BASE CAPITAL MARZO 25.xls');
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

// Ruta: Crear un nuevo usuario
excelRouter.post('/agregar-persona', (req, res) => {
  try {
    const nuevoUsuario = req.body;
    excelData.push(nuevoUsuario);
    guardarExcel(excelData);
    res.status(201).json({ mensaje: "Usuario creado exitosamente" });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// Ruta: Editar un usuario
excelRouter.put('/editar-usuario/:dni', (req, res) => {
  try {
    const dni = req.params.dni;
    const nuevosDatos = req.body;
    const index = excelData.findIndex(fila => fila["DNI"]?.toString() === dni);

    if (index === -1) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    excelData[index] = { ...excelData[index], ...nuevosDatos };
    guardarExcel(excelData);

    res.json({ mensaje: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.error("Error al editar usuario:", error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// Ruta: Eliminar un usuario
excelRouter.delete('/eliminar-excel/:dni', (req, res) => {
  try {
    const dni = req.params.dni;
    excelData = excelData.filter(fila => fila["DNI"]?.toString() !== dni);
    guardarExcel(excelData);

    res.json({ mensaje: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

export default excelRouter;
