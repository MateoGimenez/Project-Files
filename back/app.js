import express from 'express'
import cors from 'cors' 
import login ,{ authConfig } from './auth.js'
import { connectDB } from './db.js'
import users from './user.js'
const PORT = 3000
const app = express()

connectDB()

app.use(express.json())
app.use(cors())

authConfig()
app.use('/',login)
app.use("/",users)

app.listen(PORT , () => {
    console.log(`Servidor corriendo en el puerto: ${PORT}`)
})