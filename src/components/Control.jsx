import React from 'react';
import './Control.css';
import Seek from './Seek.jsx';
import {Play, Pause, Forward, Backward} from './Icons.jsx';

const PORT = import.meta.env.VITE_PORT || 9090;
const BACKEND_URL = `http://localhost:${PORT}`;

export default function Control(
  {isPlaying, setIsPlaying, currentTime, setCurrentTime, duration, videoRef, isMouseInControlArea}
) {
  console.log('currentTime, Control.jsx', currentTime);

  //utility function, for example: 66.2 s -> 00:01:06
  function convertSecondsToTimeDate(totalSeconds) {
    // Create a new Date object, using UTC to avoid timezone issues
    const date = new Date(null);
    date.setSeconds(totalSeconds);

    // Get the components in UTC
    const formattedHours = date.getUTCHours().toString().padStart(2, '0');
    const formattedMinutes = date.getUTCMinutes().toString().padStart(2, '0');
    const formattedSeconds = date.getUTCSeconds().toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  //seeks forward or backward, the video element, by any seconds provided
  function seekSeconds(seconds) {
    if (videoRef.current) {
      const target = videoRef.current.currentTime + seconds;
      if (target > 0 && target < duration) {
        videoRef.current.currentTime = target;
      }
    }
  }

  return <div id="control-box"
              style={{transform: isMouseInControlArea ? 'translateY(0px)' : 'translateY(130px)'}}>
    <div id="button-box">
      <button className="ctl-btn" id="play-pause-button"
              onClick={() => {
                setIsPlaying(i => !i)
              }}>
        {isPlaying ? <Pause/> : <Play/> }

      </button>
      <button className="ctl-btn" id="forward-button"
              onClick={() => seekSeconds(5)}>
        <Forward/>
      </button>
      <button className="ctl-btn" id="backward-button"
              onClick={() => seekSeconds(-5)}>
        <Backward/>
      </button>

      <label className="time-label" id="passed-time">
        {convertSecondsToTimeDate(currentTime)}
      </label>
      <label className="time-label" id="total-time">
        {convertSecondsToTimeDate(duration)}
      </label>
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