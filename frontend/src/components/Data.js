import React, { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';

function Data({ showData, timezone }) {

  const [rows, setRows] = useState([]);

  async function getData() {
    let response = await await fetch('http://localhost:5555/data');
    let data = await response.json()
    return data;
  }

  useEffect( () => {
    if ( rows.length === 0 ) {
      // Si rows esta vacio traigo los datos (vienen despues de renderizar)
      getData().then( (data) => {
        if ( data.status === 'success' ) { setRows(data.message) }
      });
    }
  } );

  return(
    <div
      id="turnos"
      className={ showData ? "turnos" :  "turnos hidden"}
      >
        <div className="header">
          <div className="net">
          {/* Mostar alerta de desconexion */}
          </div>
          <div className="title">
            <h2>Agenda de turnos</h2>
          </div>
          <div className="datetime">
          {/* Mostar alerta de desconexion */}
          </div>
        </div>

        <div className="table">
          <div className="table-header">
            <div className="column-hora column-header">Ingreso</div>
            <div className="column-cliente column-header">Cliente/Unidad</div>
            <div className="column-fecha column-header">Fecha</div>
            <div className="column-entrega column-header">Entrega</div>
          </div>
            { rows.map( (row, inedex) => { return (
              <TableRow
                row={row}
                key={inedex}
                timezone={timezone}
              />
            )})}
        </div>

      </div>
  );
};

export default Data;

//
