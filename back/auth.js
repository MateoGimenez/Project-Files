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

      // console.log("en strategy", payload);

      const [users] = await db.execute(
      "SELECT nombre FROM users WHERE nombre = ?",
        [payload.nombre]
        );

        // Si hay al menos un usuario reenviarlo
        if (users.length > 0) {
          // console.log(usuarios[0])
          next(null, users[0]);
        } else {
          next(null, false);
        }
    })
  );
}


authRouter.post(
  "/login",
  body("nombre").isAlphanumeric().notEmpty().isLength({ max: 25 }),
  body("password").isStrongPassword({
    minLength: 5, // Minino de 8 caracteres (letras y numeros)
    minLowercase: 1, // Al menos una letra minuscula
    minUppercase: 0, // Al menos una letra mayusculas
    minNumbers: 0, // Al menos un numero
    minSymbols: 0, // Sin simbolos
  }),
  async (req, res) => {
    // Enviar errores de validacion en caso de ocurrir alguno.
    const validacion = validationResult(req);
    if (!validacion.isEmpty()) {
      res.status(400).send({ errores: validacion.array() });
      return;
    }

    const { nombre, password } = req.body;

    // Obtener usuario
    const [users] = await db.execute(
      "select * from users where nombre=?",
      [nombre]
    );

    if (users.length === 0) {
      res.status(400).send({ error: "Usuario o contraseña inválida" });
      return;
    }

    // Verificar contraseña
    const passwordComparada = await bcrypt.compare(
      password,
      users[0].password
    );
    if (!passwordComparada) {
      res.status(400).send({ error: "Usuario o contraseña inválidaaa" });
      return;
    }

    // Crear jwt
    const payload = { nombre: users[0].nombre, rol: users[0].rol, id: users[0].idusers};
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    // Enviar jwt
    res.send({
      nombre: users[0].nombre,
      rol: users[0].rol,
      id: users[0].idusers,
      token,
      expiraEn: "2h",
    });
    
  }
);

export default authRouter;