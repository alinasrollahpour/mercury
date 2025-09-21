import React, {useRef} from 'react';
import './Seek.css';

export default function Seek(
  {currentTime, duration, videoRef,}
) {

  let seekRef = useRef();

  function clickHandler(e) {

    let vid = videoRef.current;
    if (!vid || !seekRef.current) {
      console.log('videoRef or seekRef was null')
      return;
    }
    //calculate we should seek to which time
    const width = seekRef.current.offsetWidth;
    const rect = seekRef.current.getBoundingClientRect();
    const leftDistance = e.clientX - rect.left;
    console.log(`#### width: ${width}, e.clientX: ${e.clientX} rect.left ${rect.left}`);
    let targetTime = duration * leftDistance / width;
    console.log('calculated targetTime: ', targetTime);
    vid.currentTime = targetTime;
  }

  let w = () => (currentTime * 100 / duration);
  console.log('w, Seek.jsx', w());
  // the seek-container is the parent reference element to calculate seek
  return <div ref={seekRef} id="seek-container" onClick={clickHandler}>
    <div style={{width: `${w()}%`}} id="passed-line"/>
    <div style={{left: `${w()}%`}} id="seek-button"/>
  </div>
}