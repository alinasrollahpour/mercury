import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import Video from './Video.jsx';
import Control from './Control.jsx';
import Open from './Open.jsx';

export default function App() {

  const [videoURL, setVideoURL] = useState(null);
  const videoRef = useRef(null);

  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMouseInControlArea, setIsMouseInControlArea] = useState(true);

  //todo:
  function resetAllStates() {
    setBackgroundColor('#000000');
    setIsFullScreen(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsFullScreen(true);
    console.log('@@@ resetAllStates invoked');
  }

  useEffect(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      videoRef.current.load();
    }
  }, [videoRef, videoURL]);

  //handle hotkeys
  useEffect(() => {
    function handleKeyDown(event) {
      //util
      function seekSeconds(seconds, ref) {
        if (ref.current) {
          console.log('inside if in seekSeconds...')
          const target = ref.current.currentTime + seconds;
          if (target > 0 && target < duration) {
            ref.current.currentTime = target;
          }
        }
      }

      if (event.key === 'Enter') {
        console.log('Enter pressed');
        if (videoRef.current) {
          if (isFullScreen) { //already is fullscreen
            if (document.exitFullscreen) {
              document.exitFullscreen();
            }
          } else {
            if (document.documentElement.requestFullscreen) {
              //method to apply fullscreen
              document.documentElement.requestFullscreen();
            }
          }
        }
        setIsFullScreen(i => !i);
      }
      if (event.key === ' ') {
        console.log('Space pressed');
        setIsPlaying(i => !i);
      }
      if (event.key === 'ArrowRight') {
        console.log('ArrowRight pressed');
        seekSeconds(+5, videoRef);
      }
      if (event.key === 'ArrowLeft') {
        console.log('ArrowLeft pressed');
        seekSeconds(-5, videoRef);
      }
      if (event.key === '=') {

      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [videoRef, videoURL, duration]);
  //adds event listener to manage isMouseInControlArea
  useEffect(() => {
    const handleMouseMove = (e) => {
      const viewportHeight = window.innerHeight;
      const threshold = viewportHeight - 140; // start of bottom third
      setIsMouseInControlArea(e.clientY >= threshold);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div id="frame" style={{backgroundColor, transition: 'background-color 0.5s ease'}}>
    {videoURL ?
      <div>
        <Video setBackgroundColor={setBackgroundColor}
               videoURL={videoURL}
               videoRef={videoRef}
               setCurrentTime={setCurrentTime}
               setDuration={setDuration}
               isPlaying={isPlaying}
               style={{ width: '100%', height: '100%' }}
        />
        <Control resetAllStates={resetAllStates}
                 setVideoURL={setVideoURL}
                 isMouseInControlArea={isMouseInControlArea}
                 videoRef={videoRef}
                 isPlaying={isPlaying}
                 setIsPlaying={setIsPlaying}
                 currentTime={currentTime}
                 setCurrentTime={setCurrentTime}
                 duration={duration}

        />
      </div>
      :
      <Open resetAllStates={resetAllStates} videoRef={videoRef} setVideoURL={setVideoURL} videoURL={videoURL}/>
    }
  </div>
}