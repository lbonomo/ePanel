import React from 'react';

const TableRow = ( {row} ) => {

  function toHour(n) {
    // n es un numero
    // console.log(typeof(n));
    let str = n.toFixed(2).toString();
    let h = ( str.split('.')[0] > 10) ? str.split('.')[0] : ( '0' + str.split('.')[0] );
    let m = str.split('.')[1]
    return `${h}:${m}`;
  }

  function toDate(str) {
    // str = 2020-06-23T00:00:00.000Z
    let d = new Date( Date.parse(str) )
    // console.log(d.getTimezoneOffset());
    let year = d.getFullYear();
    let month = (1 + d.getMonth()).toString().padStart(2, '0');
    // Uso .getUTCDate() para corregir el desvio por el uso orario
    let day = d.getUTCDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="table-row">
      <div key="2" className="column-hora">{toHour(row['hora'])}</div>
      <div key="1" className="column-cliente">
        <div className="cliente"> {row['cliente']} </div>
        <div> {row['unidad']} ({row['patente']})</div>
      </div>
      <div key="3" className="column-fecha">{toDate(row['fecha'])}</div>
      <div key="5" className="column-entrega">{toHour(row['entrega'])}</div>
    </div>
  );
}

export default TableRow;
