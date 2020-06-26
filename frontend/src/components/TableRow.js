import React from 'react';

const TableRow = ( {row, timezone} ) => {
  // timezone: Es el uso horario que devuelve el MS SQL

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
    let d = new Date(str);
    // Con estas 2 lineas trato de corregir el problema del Timezone del MS SQL
    let tzdiff = timezone + (d.getTimezoneOffset()/60);
    d.setHours(d.getHours() + tzdiff);

    let year = d.getFullYear();
    let month = (1 + d.getMonth()).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  function isNext() {
    let now = Date.now();
    let turno = new Date( Date.parse( row.fecha ) );
    if ( turno > now ) {
      return 'table-row next';
    } else {
      return 'table-row';
    }
  }

  return (
    <div className={ isNext() }>
      <div key="2" className="column-hora">{toHour(row['hora'])}</div>
      <div key="1" className="column-cliente">
        <div className="cliente"> {row['cliente']} </div>
        <div className="unidad"> {row['unidad']} ({row['patente']})</div>
      </div>
      <div key="3" className="column-fecha">{toDate(row['fecha'])}</div>
      <div key="5" className="column-entrega">{toHour(row['entrega'])}</div>
    </div>
  );
}

export default TableRow;
