import { app, dialog, Menu, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import express from 'express';
import fs from 'fs';
import isDev from 'electron-is-dev';
import cors from 'cors';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const PORT = process.env.VITE_PORT || 9090;
let mainWindow;

// This variable will hold the path to the currently selected video.
// It starts as null.
let videoPath = null;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setTitle("Mercury");
  Menu.setApplicationMenu(null);

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }
  // mainWindow.webContents.openDevTools();
};

// 1. Create the express app ONCE.
const appExpress = express();
appExpress.use(cors({
  origin: /http:\/\/localhost:\d+/
}));

// In your main process file...

// 2. Define the /video route ONCE.
appExpress.get("/video", (req, res) => {
  if (!videoPath) {
    console.log("Request for /video, but no file is selected.");
    return res.status(404).send('No video file selected.');
  }

  fs.stat(videoPath, (err, stats) => {
    if (err) {
      console.error(`File not found at path: ${videoPath}`, err);
      return res.sendStatus(404);
    }

    const fileSize = stats.size;
    const range = req.headers.range;

    if (!range) {
      // No range header, send the whole file.
      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      });
      return fs.createReadStream(videoPath).pipe(res);
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    // --- ⬇️ THIS IS THE FIX ⬇️ ---
    // Handle cases where the browser asks for a start point beyond the file's size.
    if (start >= fileSize) {
      console.warn(
        `Browser requested an invalid start range (${start}) for a file of size ${fileSize}.`
      );
      res.writeHead(416, {
        "Content-Range": `bytes */${fileSize}`,
      });
      return res.end();
    }
    // --- ⬆️ END OF FIX ⬆️ ---

    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  });
});

// 3. Start the server ONCE.
appExpress.listen(PORT, () => {
  console.log(`✅ Video streaming server is running at http://localhost:${PORT}/video`);
});


// 4. The IPC handler's only job is to update the videoPath variable.
ipcMain.handle('select-video-file', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Select a Video File',
    buttonLabel: 'Select',
    properties: ['openFile'],
    filters: [
      { name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'mov', 'webm'] }
    ]
  });

  if (canceled || !filePaths || filePaths.length === 0) {
    return null;
  }

  // Update the global 'videoPath' variable with the new selection.
  videoPath = filePaths[0];
  console.log(`New video path set to: ${videoPath}`);

  // Update the window title.
  mainWindow.setTitle(`Mercury: ${path.basename(videoPath)}`);

  // Return the fixed URL to the renderer process.
  return `http://localhost:${PORT}/video`;
});

// --- App Lifecycle Events ---
app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});