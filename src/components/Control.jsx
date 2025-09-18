import React from 'react';
import './Control.css';
import Seek from './Seek.jsx';

const PORT = import.meta.env.VITE_PORT || 9090;
const BACKEND_URL = `http://localhost:${PORT}`;

export default function Control(
  {setIsPlaying, currentTime, setCurrentTime, duration}
) {
  console.log('currentTime, Control.jsx', currentTime);
  return <div id="control-box">
    <div id="button-box">
      <button id="paly-pause"
              onClick={() => {
                setIsPlaying(i => !i)
              }}>
        <img src={`${BACKEND_URL}/public/play.svg`} alt="play-pause-image"/>
      </button>
    </div>
    <div id="seek-box">
      <Seek
        currentTime={currentTime}
        duration={duration}
        setCurrentTime={setCurrentTime}
      />
    </div>
  </div>
}