window.onload = () => {
  checkHref(location.href);
};

function checkHref(href) {
  const streamId = new URL(href).searchParams.get("streamId");
  if (streamId) {
    start(streamId);
  }
}

function start(streamId) {
  navigator.webkitGetUserMedia(
    {
      audio: {
        mandatory: {
          chromeMediaSource: "tab", // The media source must be 'tab' here.
          chromeMediaSourceId: streamId,
        },
      },
      video: false,
    },
    function (stream) {
      drawVisualizer(stream);
    },
    function (error) {
      console.error(error);
    }
  );
}

function drawVisualizer(stream) {
  // at this point the sound of the tab becomes muted with no way to unmute it
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);
  // analyser.connect(audioCtx.destination); // play stream to speaker - we dont need it, original tab already play it

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const canvas = document.createElement("canvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  canvas.style.cssText =
    "position: fixed; top: 0; left: 0; z-index: 2147483647; background: #333a;";
  document.body.appendChild(canvas);
  const canvasCtx = canvas.getContext("2d");

  function draw() {
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.beginPath();

    const data = smoothFFT(dataArray);
    const barWidth = bufferLength / canvas.width;
    for (let x = 0; x < canvas.width; x++) {
      let i = ~~(x * barWidth);
      let item = data[i];
      const barHeight = map(item, 0, 255, 0, canvas.height / 2);
      canvasCtx.lineTo(x, canvas.height / 2 - barHeight);
    }
    canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    canvasCtx.stroke();
    requestAnimationFrame(draw);
  }

  function map(x, in_min, in_max, out_min, out_max) {
    return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  requestAnimationFrame(draw);
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
