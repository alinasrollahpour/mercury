// This function gets the average color from a video frame and updates the state.
export const updateBackgroundColor = ({videoRef, canvasRef, setBackgroundColor}) => {
  console.log('updateBackgroundColor invoked');

  const video = videoRef.current;
  const canvas = canvasRef.current;
  if (!video || !canvas) return;

  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the current video frame onto the canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the pixel data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  let r = 0, g = 0, b = 0;
  const sampleRate = 2000;
  let count = 0;

  // Loop through a sample of pixels and sum the RGB values
  for (let i = 0; i < data.length; i += sampleRate * 4) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  // Calculate the average
  r = Math.floor(r / count);
  g = Math.floor(g / count);
  b = Math.floor(b / count);

  // Convert to a hex string
  const rgbToHex = (r, g, b) => {
    const toHex = (c) => c.toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const newColor = rgbToHex(r, g, b);
  console.log('newColor: ', newColor);
  setBackgroundColor(newColor);
};