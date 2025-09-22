import { app, dialog, Menu, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import express from 'express';
import fs from 'fs';
import isDev from 'electron-is-dev';
import cors from 'cors';

const rootPath = isDev
  ? app.getAppPath() // In Dev, point to the public folder in your project root
  : process.resourcesPath // In Prod, point to the public folder in the packaged app resources

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const PORT = process.env.VITE_PORT || 9090;
let mainWindow;
let server;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setTitle("Mercury");
  //to hide entire menu
  Menu.setApplicationMenu(null);

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

function startServer(videoPath) {
  const appExpress = express();
  //const videoPath = path.join(__dirname, "video.mp4"); // your large file

  let videoURL;

  appExpress.use(cors({
    origin: /http:\/\/localhost:\d+/
  }));
  //serve static assets
  console.log('rootPath', rootPath);
  appExpress.use('/public', express.static(path.join(rootPath, 'public')));

  // Route for streaming video
  appExpress.get("/video", (req, res) => {
    fs.stat(videoPath, (err, stats) => {
      if (err) {
        return res.sendStatus(404);
      }

      const range = req.headers.range;
      if (!range) {
        // Send entire file if no range is requested
        res.writeHead(200, {
          "Content-Length": stats.size,
          "Content-Type": "video/mp4",
        });
        fs.createReadStream(videoPath).pipe(res);
        return;
      }

      // Handle partial content (streaming)
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunkSize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4",
      });

      fs.createReadStream(videoPath, { start, end }).pipe(res);
    });
  });
  videoURL = `http://localhost:${PORT}/video`;

  server = appExpress.listen(PORT, () => {
    console.log("Video server running at:", videoURL);
  });
  console.log(`im returning videoURL: ${videoURL}`);
  return videoURL;
}


ipcMain.handle('select-video-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select a Video File',
    buttonLabel: 'Select',
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'mov', 'webm'] }
    ]
  });

  if (canceled) return null;
  //todo: based on filePath[0] change the title of window
  mainWindow.setTitle(`Mercury: ${filePaths[0]}`);
  return startServer(filePaths[0]);
});

app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
