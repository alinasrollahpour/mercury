import React from 'react';
import {useEffect, useRef} from "react";
import {updateBackgroundColor} from "../utils/updateBackgroundColor.js";

export default function Video(
  {videoURL, videoRef, isPlaying, setCurrentTime, setDuration, setBackgroundColor}) {

  const canvasRef = useRef(null);

  //this part is not calling setCurrentTime and setDuration, properly
  function syncPlayPause() {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.play();
      } else {
        video.pause();
      }
    }
  }

  useEffect(() => {
    syncPlayPause();
  }, [isPlaying]);

  const handleSeek = (time) => {
    const video = videoRef.current;
    if (video) video.currentTime = time;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      //update accent bg color
      updateBackgroundColor({videoRef, canvasRef, setBackgroundColor});
      console.log('handleTimeUpdate invoked');
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Event handler to set the video duration once it's loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  return <>
    <video
      ref={videoRef}
      id='main-video'
      src={videoURL}
      crossOrigin="anonymous"
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
    />
    <canvas ref={canvasRef} style={{display: 'none'}}/>
  </>
}