
import React, {useState, useEffect, Fragment } from 'react';

const Media = ( { setShow, interval } ) => {

  const [media, setMedia] = useState([]);
  const [start, setStart] = useState(false);
  const [load, setLoad] = useState(false);
  const [error, setError] = useState('');

  async function getMedia() {
    let response = await await fetch('http://localhost:5555/media');
    let data = await response.json()
    return data;
  }

  // La función pasada a useEffect se ejecutará después de que el renderizado
  // es confirmado en la pantalla.

  useEffect( () => {
    if (start === false ) {
      setStart(true);
      getMedia().then( (data) => {
        setLoad(true);
        setMedia(data)
      }).catch(err => {
        setError(err.message);
        setLoad(true)
      })
      setTimeout( () => { setShow('turnos') }, interval );
    }
  }, [start, interval, setShow] )


    if (load) {
      return(
        <Fragment>
          { error ? <li>{error.message}</li>  :
            <div id="image"
              style= { {'backgroundImage': `url(${media.file})` }}
              >&nbsp;</div>
          }
        </Fragment>
      );
    } else {
        return (
            <div>
                Loading...
            </div>
        );
    }

};

export default Media;
