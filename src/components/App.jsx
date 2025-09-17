import React from 'react';
import {useState} from 'react';



export default function App() {

  const [videoURL, setVideoURL] = useState();

  async function openFileHandler() {
    let res = await window.merc.selectVideoFile();
    setVideoURL(res);

    //res is undefined
    console.log('$$$ selectVideoFile() has been invoked');
    console.log(res);
  }

  return <>
    <button id='open-file' onClick={openFileHandler}>Open a file</button>
    { videoURL &&
      <video controls width={300} height={200} src={videoURL} />
    }
  </>
}