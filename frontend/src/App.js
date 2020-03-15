import React, { useState, useEffect } from 'react';
import Turnos from './components/Turnos';
import Media from './components/Media';
import Clock from './components/Clock';
import './css/style.css';

function App() {

  const [showTurnos, setShowTurnos] = useState(true);
  const [reloadMedia, setReloadMedia ] = useState(true)

  // TODO - leer de la configuracion - Implemetar /config en el backend
  // const [interval, setInterval] = useState(5000);
  const interval = 60000

  useEffect( () => {

    const ShowHidden = () => {
      console.log(`ShowHidden: ${ showTurnos }`);
      if ( showTurnos ) {
        setShowTurnos(false);
        setReloadMedia(true);
      } else {
        setShowTurnos(true);
      }
    }

    setTimeout( () => { ShowHidden() }, interval )


  }, [interval, showTurnos] )


  return (
    <div id="main">
      <Media
        reloadMedia = { reloadMedia }
        setReloadMedia = { setReloadMedia }
        />
      <Clock />
      <Turnos
        showTurnos = { showTurnos }
        />
    </div>
    );
}

export default App;
