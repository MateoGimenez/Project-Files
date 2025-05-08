import express from 'express'
import {db} from './db.js'
import { validarJwt, validarRol } from './validaciones.js'


const users = express.Router()

users.get('/users', validarJwt ,validarRol , async(req , res)=>{
    try {
        const [result] = await db.execute('SELECT * FROM users')
        if(result.length <= 0){
            return res.status(404).json({message: 'No hay usuarios en la base de datos '})
        }
        res.status(200).send(result)
    }catch(error){
        res.status(500).json({message: 'Error al obtener usuarios', error})
    }
})


export default users