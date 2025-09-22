import React, {useState, useRef} from "react";
import './Open.css';

export default function Open({setVideoURL}) {
  const [URL, setURL] = useState(false);
  const inputRef = useRef(null);

  async function openFileHandler() {
    let res = await window.merc.selectVideoFile();
    setVideoURL(res);
  }

  async function openURLHandler() {
    if (inputRef.current) {
      setVideoURL(inputRef.current.value);
    }
  }

  return <div id="open-buttons-container">
    <button id='open-file' onClick={openFileHandler}>Open a file</button>
    {URL ?
      <div id="input-container">
        <input type="text" id="url-input" ref={inputRef} />
        <button id='submit-url' onClick={openURLHandler}>OK</button>
      </div>
      :
      <button id='open-url' onClick={() => setURL(true)}>
        Paste a URL
      </button>
    }

  </div>
}