chrome.runtime.onMessage.addListener(function (request) {
  const { targetTabId, consumerTabId } = request;
  testGetMediaStreamId(targetTabId, consumerTabId);
});

function testGetMediaStreamId(targetTabId, consumerTabId) {
  chrome.tabCapture.getMediaStreamId(
    { targetTabId, consumerTabId },
    function (streamId) {
      if (!streamId) return;
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
          draw(stream);
        },
        function (error) {
          console.error(error);
        }
      );
    }
  );
}

function draw(stream) {
  // at this point the sound of the tab becomes muted with no way to unmute it
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaStreamSource(stream);
  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 200;
  canvas.style.cssText =
    "position: fixed; top: 0; left: 0; z-index: 2147483647; background: #333a;";
  document.body.appendChild(canvas);
  const canvasCtx = canvas.getContext("2d");

  function draw() {
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    canvasCtx.beginPath();
    const barWidth = ~~(bufferLength / canvas.width);
    for (let x = 0; x < canvas.width; x++) {
      let i = x * barWidth;
      let item = dataArray[i];
      const barHeight = map(item, 0, 255, 0, canvas.height);
      canvasCtx.lineTo(x, canvas.height - barHeight);
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
