import React from 'react';
import './Control.css';
import Seek from './Seek.jsx';

export default function Control({setIsPlaying, currentTime, duration}) {
  return <div id="control-box">
    <div id="button-box">
      <button id="paly-pause"
              onClick={() => {
                setIsPlaying(i => !i)
              }}
      >
        Play/Pause
      </button>
    </div>
    <div id="seek-box">
      <Seek/>
    </div>
  </div>
}