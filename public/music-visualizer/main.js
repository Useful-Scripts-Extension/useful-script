// https://editor.p5js.org/jonfroehlich/sketches/d2euV09i

let stream,
  canvas,
  fps,
  analyser,
  fftTemp = [],
  fft = [],
  barWidth = 10;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  colorMode(HSB, 255);
  textAlign(CENTER, CENTER);
  frameRate(60);
  setInterval(() => {
    fps = frameRate().toFixed(0);
  }, 1000);
}

function draw() {
  if (analyser) {
    analyser.getByteFrequencyData(fftTemp);
    fft = smoothFFT(fftTemp);
  }

  background(30);

  // beginShape();
  for (let i = 0; i < width; i += barWidth) {
    let index = floor(map(i, 0, width, 0, fft.length));
    const barHeight = map(fft[index], 0, 255, 0, height);
    fill(fft[index], 255, 255);
    rect(i, height - barHeight, barWidth, barHeight);
    // vertex(i, height - barHeight);
  }
  // stroke(255);
  // noFill();
  // endShape();

  let amp = getAmplitute(fftTemp);
  let size = map(amp, 0, 255, 0, 400);
  noStroke();
  fill(255, 200);
  circle(width / 2, height / 2, size);

  if (!stream) {
    fill(255);
    text("Click to listen other tab", width / 2, height / 2);
  }

  text(fps, 30, 20);
}

function mousePressed() {
  if (!stream) {
    getStreamFromOtherTab()
      .then((_) => {
        stream = _;
        console.log("stream: ", stream);
        connectStreamToP5(stream);
      })
      .catch((e) => {
        console.log("ERROR: ", e);
      });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function getStreamFromOtherTab() {
  return navigator.mediaDevices.getDisplayMedia({
    video: {
      displaySurface: "browser",
    },
    audio: {
      suppressLocalAudioPlayback: false,
    },
    preferCurrentTab: false,
    selfBrowserSurface: "exclude",
    systemAudio: "include",
    surfaceSwitching: "include",
    monitorTypeSurfaces: "include",
  });
}

// https://stackoverflow.com/a/68326540/23648002
function connectStreamToP5(stream) {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const mediaSource = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  mediaSource.connect(analyser);

  fft = new Uint8Array(analyser.frequencyBinCount);
  fftTemp = new Uint8Array(analyser.frequencyBinCount);
}

function smoothFFT(fftArray, smoothingFactor = 0.8) {
  let smoothedFFT = [];
  smoothedFFT[0] = fftArray[0];
  for (let i = 1; i < fftArray.length; i++) {
    smoothedFFT[i] =
      fftArray[i] * smoothingFactor +
      smoothedFFT[i - 1] * (1 - smoothingFactor);
  }
  return smoothedFFT;
}

function highlightBass(fftArray, samplingRate = 44100, bassRange = [20, 200]) {
  const fftSize = fftArray.length;
  const threshold = 0.5; // Adjust threshold value as needed (0 for hard removal)

  for (let i = 0; i < fftSize; i++) {
    const freq = (i * samplingRate) / fftSize;
    if (freq < bassRange[0] || freq > bassRange[1]) {
      fftArray[i] *= threshold; // Apply threshold instead of hard removal
    }
  }

  return fftArray;
}

function logScale(fftArray, minDecibels = -60, maxDecibels = 0) {
  let minAmplitude = Math.pow(10, minDecibels / 10);
  let maxAmplitude = Math.pow(10, maxDecibels / 10);

  const scale = (val) => {
    const scaledValue =
      10 * Math.log10(Math.max(val, minAmplitude)) -
      10 * Math.log10(minAmplitude);
    return Math.min(scaledValue, maxDecibels); // Cap the output at maxDecibels
  };

  return fftArray.map((val) => scale(val));
}

const AmplituteTypes = {
  max: "max",
  avg: "avg",
};
function getAmplitute(fftArray, type = AmplituteTypes.avg) {
  switch (type) {
    case AmplituteTypes.avg:
      return fftArray.reduce((a, b) => a + b, 0) / fftArray.length;
    case AmplituteTypes.max:
      return Math.max(...fftArray);
    default:
  }
}
