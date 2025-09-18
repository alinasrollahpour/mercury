import React from "react";
import './Open.css';

export default function Open({setVideoURL}) {
  async function openFileHandler() {
    let res = await window.merc.selectVideoFile();
    setVideoURL(res);
  }

  return <button id='open-file' onClick={openFileHandler}>Open a file</button>
}