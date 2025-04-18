import express from "express";
import { db } from './db.js';
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Strategy, ExtractJwt } from "passport-jwt";
import passport from "passport";

const authRouter = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  if (!process.env.JWT_SECRET) {
    throw new Error("Falta definir JWT_SECRET en las variables de entorno");
  }
  
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      try {
        const [users] = await db.execute(
          "SELECT nombre, rol FROM users WHERE nombre = ?",
          [payload.nombre]
        );
  
        if (users.length > 0) {
          next(null, users[0]);
        } else {
          next(null, false);
        }
      } catch (err) {
        console.error(err);
        next(err, false);
      }
    })
  );
}


authRouter.post(
  "/login",
  body("nombre").isAlphanumeric().notEmpty().isLength({ max: 25 }),
  body("password").isStrongPassword({
    minLength: 5, // Minimo de 5 caracteres (letras y números)
    minLowercase: 1, // Al menos una letra minúscula
    minUppercase: 0, // Al menos una letra mayúscula
    minNumbers: 0, // Al menos un número
    minSymbols: 0, // Sin símbolos
  }),
  async (req, res) => {
    // Enviar errores de validación en caso de ocurrir alguno.
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const { nombre, password } = req.body;

    // Obtener usuario
    const [users] = await db.execute(
      "SELECT * FROM users WHERE nombre = ?",
      [nombre]
    );

    if (users.length === 0) {
      // No especificar si el error es de usuario o contraseña, por seguridad
      res.status(400).send({ error: "Usuario o contraseña inválida" });
      return;
    }

    // Verificar contraseña
    const passwordComparada = await bcrypt.compare(
      password,
      users[0].password
    );
    if (!passwordComparada) {
      // No especificar si el error es de usuario o contraseña, por seguridad
      res.status(400).send({ error: "Usuario o contraseña inválida" });
      return;
    }

    // Crear JWT
    const payload = { 
      nombre: users[0].nombre, 
      rol: users[0].rol, 
      id: users[0].idusers
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h", // Definir expiración del token
    });

    // Enviar JWT al cliente
    res.send({
      nombre: users[0].nombre,
      rol: users[0].rol,
      id: users[0].idusers,
      token,
      expiraEn: "2h",
    });
  }
);

authRouter.post(
  "/register",
  body("nombre").isAlphanumeric().notEmpty().isLength({ max: 25 }),
  body("apellido").notEmpty().isLength({ max: 45 }),
  body("dni").notEmpty().isLength({ max: 45 }),
  body("email").isEmail().notEmpty().isLength({ max: 45 }),
  body("password").isStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0,
  }),
  body("rol").isInt({ min: 1, max: 2 }), // 1=admin, 2=usuario
  async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }

    const { nombre, apellido, dni, email, password, rol } = req.body;

    try {
      // Verificar si el nombre ya existe
      const [existente] = await db.execute("SELECT * FROM users WHERE nombre = ?", [nombre]);
      if (existente.length > 0) {
        return res.status(400).json({ error: "El nombre de usuario ya existe" });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertar el nuevo usuario
      await db.execute(
        "INSERT INTO users (nombre, apellido, dni, email, password, rol) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, apellido, dni, email, hashedPassword, rol]
      );

      res.status(201).json({ mensaje: "Usuario registrado correctamente" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error del servidor" });
    }
  }
);


// Middleware para verificar si el usuario tiene un rol específico
export const checkRole = (roles) => {
  return (req, res, next) => {
    const userRole = req.user?.rol;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).send({ error: "Acceso denegado. No tienes el rol necesario." });
    }

    next();
  };
};

export default authRouter;
