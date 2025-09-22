import React, {useEffect, useState, useRef} from 'react';
import './App.css';
import Video from './Video.jsx';
import Control from './Control.jsx';
import Open from './Open.jsx';

export default function App() {

  const [videoURL, setVideoURL] = useState();
  const videoRef = useRef(null);

  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMouseInControlArea, setIsMouseInControlArea] = useState(false);

  //handle shortkeys
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        console.log('Enter pressed');
        //todo: full screen

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
      if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
        //todo: open file component
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, []);
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

  return <div id="frame" style={{ backgroundColor, transition: 'background-color 0.5s ease'}}>
    {videoURL ?
      <div>
        <Video setBackgroundColor={setBackgroundColor}
               videoURL={videoURL}
               videoRef={videoRef}
               setCurrentTime={setCurrentTime}
               setDuration={setDuration}
               isPlaying={isPlaying}
        />
        <Control isMouseInControlArea={isMouseInControlArea}
                 videoRef={videoRef}
                 isPlaying={isPlaying}
                 setIsPlaying={setIsPlaying}
                 currentTime={currentTime}
                 setCurrentTime={setCurrentTime}
                 duration={duration}

        />
      </div>
      :
      <Open setVideoURL={setVideoURL} videoURL={videoURL}/>
    }
  </div>
}