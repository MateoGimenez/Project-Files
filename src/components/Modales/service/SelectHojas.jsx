import React from 'react';
import { useFetchHojas } from '../../../hooks/useFetchHojas';

export default function SelectHojas({ valorSeleccionado, onChange }) {
  const { hojas, cargando, error } = useFetchHojas();

  if (cargando) return <p>Cargando hojas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <select name="Hoja" value={valorSeleccionado} onChange={onChange}>
      <option value="">Seleccione una hoja</option>
      {hojas?.map((hoja) => (
        <option key={hoja} value={hoja}>
          {hoja}
        </option>
      ))}
    </select>
  );
}

