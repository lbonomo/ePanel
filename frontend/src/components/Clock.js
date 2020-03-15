import React, {useState, useEffect } from 'react';

const Clock = () => {

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

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
    if ( date === '' ) {
      // Si rows esta vacio traigo los datos (vienen despues de renderizar)
      window.setInterval(updateDateTime, 1000);
    }
  } );

  return (
    <div className="datetime">
      {date} {time}
    </div>
  )
}
export default Clock;
