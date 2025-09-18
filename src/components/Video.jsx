import React from 'react';
import {useEffect} from "react";

export default function Video({videoURL, videoRef, isPlaying, setCurrentTime, setDuration}) {

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

  return <video
    ref={videoRef}
    id='main-video'
    src={videoURL}
    onTimeUpdate={handleTimeUpdate}
    onLoadedMetadata={handleLoadedMetadata}
  />
}