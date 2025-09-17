const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld(
  'merc',
  {
    'selectVideoFile': () => ipcRenderer.invoke('select-video-file'),
    'dummy': () => ipcRenderer.invoke('test-log', 'dummy')
  }
)
