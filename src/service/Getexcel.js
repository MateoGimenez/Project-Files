
export const ObtenerDatos = async() =>{
    try{
        const res = await fetch('http://localhost:3000/leer-excel')
        const data = await res.json()
        return data
    }catch(error){
        console.log(error)
    }
}


export const borrarUsuario = async (usuario) => {
  const hoja = prompt("Ingrese el nombre de la hoja de la que desea eliminar el usuario:");
  
  if (!hoja) {
    alert("Operación cancelada.");
    return;
  }

  const confirmar = window.confirm(`¿Estás seguro que quieres eliminar a ${usuario["Apelido y Nombre"]}?`);
  if (!confirmar) return;

  try {
    await fetch(`http://localhost:3000/eliminar-excel/${usuario["DNI"]}/${hoja}`, {
      method: 'DELETE'
    });

    alert('Usuario eliminado correctamente.');
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    alert('Hubo un problema al intentar eliminar el usuario.');
  }
};



export const ObtenerHojas = async() => {
  const res = await fetch('http://localhost:3000/nombres-hojas')
  const data = await res.json()
  return data
}