import React, {useEffect} from 'react';
import {useState, useRef} from 'react';
import './App.css';
import Video from './Video.jsx';
import Control from './Control.jsx';
import Open from './Open.jsx';

export default function App() {

  const [videoURL, setVideoURL] = useState();
  const videoRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  return <div id="frame">
    {videoURL ?
      <div>
        <Video videoURL={videoURL}
               videoRef={videoRef}
               setCurrentTime={setCurrentTime}
               setDuration={setDuration}
               isPlaying={isPlaying}
        />
        <Control setIsPlaying={setIsPlaying}
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