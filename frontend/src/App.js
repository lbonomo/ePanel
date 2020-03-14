import React, { useState } from 'react';
import Turnos from './pages/Turnos';
import Media from './pages/Media';
import './css/style.css';

function App() {

  const [show, setShow] = useState('turnos');
  // TODO - leer de la configuracion - Implemetar /config en el backend
  // const [interval, setInterval] = useState(5000);
  const interval = 5000


  return (
    <div id="main">
      { ( show === "turnos" ) ? (
          <Turnos
            setShow = { setShow }
            interval = { interval }
            />
        ) : (
          <Media
            setShow = { setShow }
            interval = { interval }
            />
        )
      }
    </div>
    );
}

export default App;
