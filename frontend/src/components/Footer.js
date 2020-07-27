import React from 'react';
import Brand from './Brand';
import Timer from './Timer';
import Clock from './Clock';

const Footer = () => {
  return (
    <div className="footer">
      <Clock/>
      <Timer/>
      <Brand/>
    </div>
  )
}
export default Footer;
