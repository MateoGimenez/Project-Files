import { body, param, validationResult } from "express-validator";
import passport from "passport";


export const verificarValidaciones = (req, res, next) => {
  // Enviar errores de validacion en caso de ocurrir alguno.
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    return res.status(400).send({ errores: validacion.array() });
  }
  next();
};

export const validarId = param("id").isInt({ min: 1 });

export const validarJwt = passport.authenticate("jwt", {
  session: false,
});

export const validarRol = (req,res,next) =>{
if (req.user.rol != 1) {
  return res.status(401).send({mensaje: "No autorizado"})
}
next();
}

export const ValidarPost = [
  body('Apelido y Nombre').notEmpty().withMessage('El apellido y nombre es obligatorio')
  .isLength({min : 3}).matches(/^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑ, ]+$/).withMessage('Debe contener solo letras, comas y espacios.'),

  body('DNI')
  .notEmpty().withMessage('El DNI es obligatorio.')
  .isInt({ min: 1000000, max: 99999999 }).withMessage('Debe ser un número válido entre 7 y 8 dígitos.'),

body('3 - Reempadronado')
  .optional()
  .isIn(['SI', 'NO']).withMessage('Debe ser "SI" o "NO".'),

body('4 - Depto')
  .optional()
  .isString().withMessage('Debe ser un texto.')
  .isLength({ max: 50 }).withMessage('No debe superar los 50 caracteres.'),

body('13 - Celular')
  .optional()
  .matches(/^\d{3}\s\d{3}-\d{4}\s-\s\d{3}\s\d{3}-\d{4}\s-\s\d{3}\s\d{3}-\d{4}$/)
  .withMessage('Debe seguir el formato: "380 424-7190 - 380 410-0745 - 380 489-7623".'),

body(' 15 - Correo Electronico ')
  .optional()
  .isEmail().withMessage('Debe ser un correo electrónico válido.'),

body('16 - CUIL')
  .notEmpty().withMessage('El CUIL es obligatorio.')
  .isInt().withMessage('Debe ser un número.')
  .isLength({ min: 11, max: 11 }).withMessage('Debe tener exactamente 11 dígitos.'),

body('18 - Fecha de Nac')
  .optional()
  .isInt({ min: 1 }).withMessage('Debe ser un número entero positivo.')
  .custom((value) => {
    const date = new Date(1899, 11, 30);
    date.setDate(date.getDate() + parseInt(value));
    if (date > new Date()) {
      throw new Error('La fecha de nacimiento no puede ser futura.');
    }
    return true;
  }),

body('19 - Edad')
  .optional()
  .isInt({ min: 0, max: 150 }).withMessage('Debe ser un número válido entre 0 y 150.'),

body('Ingreso')
  .optional()
  .isFloat({ min: 0 }).withMessage('Debe ser un número positivo.'),

body('Cobertura de Salud')
  .optional()
  .isInt({ min: 0, max: 5 }).withMessage('Debe ser un valor entre 0 y 5.')
]