import { useEffect, useState } from 'react';

export function useFetchHojas() {
  const [hojas, setHojas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerHojas = async () => {
      try {
        const response = await fetch('http://localhost:3000/nombres-hojas');
        const data = await response.json();
        setHojas(data.sheetNames || []);
      } catch (err) {
        setError('Error al obtener las hojas');
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    obtenerHojas();
  }, []);

  return { hojas, cargando, error };
}
