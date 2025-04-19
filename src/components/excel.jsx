import { useState } from "react"

export const excel = () => {
    const [info , setInfo] = useState([]);

    const getInfoExcel  = async() =>{
        const res  = await fetch('https://api.example.com/excel');
        const data = await res.json();
        setInfo(data);
    }
    <>
        <h1>Informacion excel</h1>

        {
            info.map((item, index) => {
                
            })
        }
    </>
}