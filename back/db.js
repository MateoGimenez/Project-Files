import mysql from 'mysql2/promise'

export let db 

export async function connectDB() {
    try{
        db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
        })    
        console.log('Conexion exitosa con la base de datos')
    }catch(error){
        console.log({ERROR : error})
    }
}