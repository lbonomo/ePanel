import React, { useState, useEffect } from 'react';
import TableRow from '../components/TableRow';

function Turnos({interval, setShow}) {

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [rows, setRows] = useState([]);

  async function getTurnos() {
    let response = await await fetch('http://localhost:5555/turnos');
    let data = await response.json()
    return data;
  }

  function checkTime(i) {
    if (i < 10) { i = "0" + i; }
    return i;
  }

  function GetDate() {
    let date = new Date()
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  function GetTime() {
    let time = new Date();
    let h = time.getHours();
    let m = checkTime(time.getMinutes());
    let s = checkTime(time.getSeconds());
    return `${h}:${m}:${s}` ;
  }

  function updateDateTime() {
    setDate(GetDate());
    setTime(GetTime());
  }

  useEffect( () => {
    if ( rows.length === 0 ) {
      // Si rows esta vacio traigo los datos (vienen despues de renderizar)
      console.log("Primer GetRows")
      window.setInterval(updateDateTime, 1000);
      getTurnos().then( (data) => {
        setRows(data);
        setTimeout( () => { setShow('media') }, interval );
      });
    }
  } );

  return(
    <div id="turnos" className="turnos">
        <div className="header">
          <div className="net">
          {/* Mostar alerta de desconexion */}
          </div>
          <div className="title">
            <h2>Agenda de turnos</h2>
          </div>
          <div className="datetime">
            <div className="date">{date}</div>
            <div className="time">{time}</div>
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
