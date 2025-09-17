import React from 'react';

async function openFileHandler() {
  let res = await window.merc.selectVideoFile();
  console.log(res);
}

export default function App() {
  return <>
    <button id='open-file' onClick={openFileHandler}>Open a file</button>
    <video controls width={300} height={200}/>
  </>
}