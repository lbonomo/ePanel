import React, { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';

function Turnos({ showTurnos }) {

  const [rows, setRows] = useState([]);

  async function getTurnos() {
    let response = await await fetch('http://localhost:5555/turnos');
    let data = await response.json()
    return data;
  }

  useEffect( () => {
    if ( rows.length === 0 ) {
      // Si rows esta vacio traigo los datos (vienen despues de renderizar)
      getTurnos().then( (data) => {
        setRows(data);
      });
    }
  } );

  return(
    <div
      id="turnos"
      className={ showTurnos ? "turnos" :  "turnos hidden"}
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
            <div className="column-hora">Ingreso</div>
            <div className="column-cliente">Cliente/Unidad</div>
            <div className="column-fecha">Fecha</div>
            <div className="column-entrega">Entrega</div>
          </div>
            { rows.map( (row, inedex) => { return (
              <TableRow
                row={row}
                key={inedex}
              />
            )})}
        </div>

      </div>
  );
};

export default Turnos;

//
