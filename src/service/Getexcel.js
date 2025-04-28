
export const ObtenerDatos = async() =>{
    try{
        const res = await fetch('http://localhost:3000/leer-excel')
        const data = await res.json()
        return data
    }catch(error){
        console.log(error)
    }
}