import React, {useEffect} from 'react';
import './Seek.css';

export default function Seek({
                               currentTime,
                               duration
                             }) {

  let w = ()=>(currentTime * 100 / duration);
  console.log('w, Seek.jsx', w());
  return <div id="seek-container">
    <div style={{width : `${w()}%`}} id="passed-line"/>
    <div id="remaining-line"/>
  </div>
}