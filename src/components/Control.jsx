import React from 'react';

export default function Control({setIsPlaying, currentTime, duration}) {
  return <div>
    <button
      onClick={() => {setIsPlaying(i => !i)}}
    >
      Play/Pause
    </button>
  </div>
}