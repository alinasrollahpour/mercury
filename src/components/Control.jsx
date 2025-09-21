import React from 'react';
import './Control.css';
import Seek from './Seek.jsx';
import {Play} from './Icons.jsx';

const PORT = import.meta.env.VITE_PORT || 9090;
const BACKEND_URL = `http://localhost:${PORT}`;

export default function Control(
  {setIsPlaying, currentTime, setCurrentTime, duration, videoRef}
) {
  console.log('currentTime, Control.jsx', currentTime);
  return <div id="control-box">
    <div id="button-box">
      <button id="play-pause"
              onClick={() => {
                setIsPlaying(i => !i)
              }}>
        {/*<img id="play-pause" src={`${BACKEND_URL}/public/play.svg`} alt="play-pause-image"/>*/}
        <Play/>
      </button>
    </div>
    <div id="seek-box">
      <Seek
        videoRef={videoRef}
        currentTime={currentTime}
        duration={duration}
        setCurrentTime={setCurrentTime}
      />
    </div>
  </div>
}