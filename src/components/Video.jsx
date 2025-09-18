import React from 'react';
import {useEffect} from "react";

export default function Video({videoURL, videoRef, isPlaying, setCurrentTime, setDuration}) {

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
    const video = videoRef.current;


    //to keep real-time state of video with the react states
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      syncPlayPause();
    }

    if (video) {
      video.addEventListener("timeupdate", handleTimeUpdate);
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (video) {
        video.removeEventListener("timeupdate", handleTimeUpdate);
        video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      }
    };
  }, []);


  const handleSeek = (time) => {
    const video = videoRef.current;
    if (video) video.currentTime = time;
  };

  syncPlayPause();

  return <video ref={videoRef} id='main-video' src={videoURL}/>
}