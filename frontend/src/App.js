import React, { useState, useEffect } from 'react';
import Turnos from './components/Turnos';
import Media from './components/Media';
import Clock from './components/Clock';
import './css/style.css';

function App() {

  const [showTurnos, setShowTurnos] = useState(true);
  const [reloadMedia, setReloadMedia ] = useState(true)
  const [interval, setInterval] = useState(5000);
  const [sqlTimezone, setsqlTimezone] = useState(0);

  async function getConfig() {
    let response = await await fetch('http://localhost:5555/config/');
    let data = await response.json()
    return data;
  }

  useEffect( () => {

    getConfig().then( (data) => {
      // console.log(data);
      setInterval(data.interval);
      setsqlTimezone(data.timezone);
    });

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
        timezone = { sqlTimezone }
        />
    </div>
  );
}

export default App;
