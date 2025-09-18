import React from 'react';
import {useState, useRef} from 'react';
import './App.css';
import Video from './Video.jsx'
import Control from './Control.jsx'

export default function App() {

  const [videoURL, setVideoURL] = useState();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  async function openFileHandler() {
    let res = await window.merc.selectVideoFile();
    setVideoURL(res);

    //res is undefined
    console.log('$$$ selectVideoFile() has been invoked');
    console.log(res);
  }

  return <>
    {!videoURL &&
      <button id='open-file' onClick={openFileHandler}>Open a file</button>
    }
    {videoURL &&
      <div id="frame">
        <Video videoURL={videoURL}
               videoRef={videoRef}
               setCurrentTime={setCurrentTime}
               setDuration={setDuration}
               isPlaying={isPlaying}
        />
        <Control setIsPlaying={setIsPlaying}
                 currentTime={currentTime}
                 duration={duration}
        />
      </div>

    }
  </>
}