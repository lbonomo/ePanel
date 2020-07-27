import React, { useState, useEffect } from 'react';
import Data from './components/Data';
import Media from './components/Media';
import Footer from './components/Footer';
import './css/style.css';

function App() {

  const [showData, setshowData] = useState(true);
  const [reloadMedia, setReloadMedia ] = useState(true)
  const [interval, setInterval] = useState(5000);
  const [sqlTimezone, setsqlTimezone] = useState(0);

  async function getConfig() {
    let response = await await fetch('http://localhost:5555/config/');
    let config = await response.json()
    return config;
  }

  useEffect( () => {

    getConfig().then( (data) => {
      // console.log(data);
      setInterval(data.interval);
      setsqlTimezone(data.timezone);
    });

    const ShowHidden = () => {
      console.log(`ShowHidden: ${ showData }`);
      if ( showData ) {
        setshowData(false);
        setReloadMedia(true);
      } else {
        setshowData(true);
      }
    }

    setTimeout( () => { ShowHidden() }, interval )

  }, [interval, showData] )

  return (
    <div id="main">
      <Media
        reloadMedia = { reloadMedia }
        setReloadMedia = { setReloadMedia }
        />
      <Footer />
      <Data
        showData = { showData }
        timezone = { sqlTimezone }
        />
    </div>
  );
}

export default App;
