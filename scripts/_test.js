export default {
  icon: "",
  name: {
    en: "Test",
    vi: "Test",
  },
  description: {
    en: "",
    vi: "",
  },

  // record audio when have stream: https://stackoverflow.com/a/34919194/23648002
  // https://www.youtube.com/watch?v=uk96O7N1Yo0
  // https://www.skilldrick.co.uk/fft/
  // https://stackoverflow.com/a/61301293/23648002
  // https://www.renderforest.com/music-visualisations
  // https://developer.chrome.com/docs/extensions/reference/api/tabCapture#preserving-system-audio
  // https://github.com/Douile/Chrome-Audio-Visualizer/tree/master
  // https://stackoverflow.com/questions/66217882/properly-using-chrome-tabcapture-in-a-manifest-v3-extension
  // https://groups.google.com/a/chromium.org/g/chromium-extensions/c/ffI0iNd79oo
  // https://github.dev/GoogleChrome/chrome-extensions-samples/api-samples/tabCapture

  onClickContentScript: async () => {
    try {
      const currentTabId = await UfsGlobal.Extension.runInBackground(
        "utils.getCurrentTabId"
      );

      const url = await UfsGlobal.Extension.getURL("/scripts/_test.html");
      const { tabs } = await UfsGlobal.Extension.runInBackground(
        "chrome.windows.create",
        [{ url, height: 400, width: 800 }]
      );
      const tab = tabs[0];

      await UfsGlobal.Extension.runInBackground("utils.waitForTabToLoad", [
        tab.id,
      ]);

      UfsGlobal.Extension.runInBackground("chrome.tabs.sendMessage", [
        tab.id,
        {
          targetTabId: currentTabId,
          consumerTabId: tab.id,
        },
      ]);
    } catch (e) {
      console.log(e);
    }
  },

  onClick_: async () => {
    javascript: (function () {
      var ctx;
      var width = 1000;
      var fftHeight = 250;
      var height = fftHeight + 20;
      var fftSize = 2048; // number of samples used to generate each FFT
      var frequencyBins = fftSize / 2; // number of frequency bins in FFT
      var video;

      function requestPIPCanvas(canvas) {
        const stream = canvas.captureStream();
        if (!video) {
          video = document.createElement("video");
          video.autoplay = true;
          video.style.display = "none";
        }
        video.srcObject = stream;
        document.body.appendChild(video);
        setTimeout(() => {
          video.requestPictureInPicture?.();
        }, 500);
      }

      function draggable(ele) {
        // Variables to store the position of the canvas
        var offsetX, offsetY;
        var isDragging = false;

        // Function to handle mouse down event
        ele.addEventListener("mousedown", function (event) {
          isDragging = true;
          offsetX = event.clientX - ele.offsetLeft;
          offsetY = event.clientY - ele.offsetTop;
        });

        // Function to handle mouse move event
        document.addEventListener("mousemove", function (event) {
          if (!isDragging) return;
          var x = event.clientX - offsetX;
          var y = event.clientY - offsetY;
          ele.style.left = x + "px";
          ele.style.top = y + "px";
        });

        // Function to handle mouse up event
        document.addEventListener("mouseup", function () {
          isDragging = false;
        });
      }

      function map(x, in_min, in_max, out_min, out_max) {
        return (
          ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
        );
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

      function highlightBass(
        fftArray,
        samplingRate = 44100,
        bassRange = [20, 200]
      ) {
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

      function drawLinearFFT(dataArray, canvasCtx) {
        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.beginPath();

        var sliceLength = width / frequencyBins;

        for (var i = 0; i < frequencyBins; i++) {
          var x = i * sliceLength;
          var y = fftHeight - (dataArray[i] * fftHeight) / 256;
          canvasCtx.lineTo(x, y);
        }

        canvasCtx.stroke();
      }

      function drawLogarithmicFFT(dataArray, canvasCtx) {
        canvasCtx.clearRect(0, 0, width, height);
        canvasCtx.beginPath();

        var scale = Math.log(frequencyBins - 1) / width;
        var binWidthFreq = ctx.sampleRate / (frequencyBins * 2);
        var firstBinWidthPixels = Math.log(2) / scale;

        for (var i = 1; i < frequencyBins; i++) {
          var x = Math.log(i) / scale;
          var y = fftHeight - (dataArray[i] * fftHeight) / 256;
          canvasCtx.lineTo(x, y);
        }

        canvasCtx.stroke();
      }

      function createAudioContext() {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        ctx = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = fftSize;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.cssText =
          "position: fixed; top: 0; left: 0; z-index: 2147483647; background: #333a;";
        document.body.appendChild(canvas);
        const canvasCtx = canvas.getContext("2d");
        draggable(canvas);

        canvas.onclick = function () {
          requestPIPCanvas(canvas);
        };

        function draw() {
          analyser.getByteFrequencyData(dataArray);

          canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          drawLogarithmicFFT(dataArray, canvasCtx);

          // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
          // const barWidth = ~~(bufferLength / canvas.width);

          // const arr = highlightBass(dataArray, audioContext.sampleRate);
          // canvasCtx.beginPath();
          // canvasCtx.strokeStyle = "rgba(255, 255, 255, 0.9)";

          // for (let x = 0; x < canvas.width; x++) {
          //   let i = x * barWidth;
          //   let item = arr[i];
          //   const barHeight = map(item, 0, 255, 0, canvas.height);

          //   // line
          //   canvasCtx.lineTo(x, canvas.height - barHeight);

          //   // canvasCtx.fillStyle = `rgba(255, 255, 255, ${map(item, 0, 255, 0, 1)})`;
          //   // canvasCtx.fillRect(x, canvas.height - barHeight, 1, barHeight);
          // }
          // canvasCtx.stroke();
          requestAnimationFrame(draw);
        }

        draw();

        function handleVideoAudio(videoElement) {
          const source = audioContext.createMediaElementSource(videoElement);
          source.connect(analyser);
          analyser.connect(audioContext.destination);
        }

        return { handleVideoAudio, canvas };
      }

      function startAudioAnalysis() {
        if (!window.AudioContext) {
          alert("Your browser doesn't support Web Audio API");
          return;
        }

        const videoElements = document.querySelectorAll("video");
        const contexts = [];

        videoElements.forEach((videoElement) => {
          const { handleVideoAudio, canvas } = createAudioContext();
          handleVideoAudio(videoElement);
          contexts.push({ canvas, videoElement });
        });

        // Keep checking for new videos on the page
        // setInterval(() => {
        //   const newVideos = document.querySelectorAll("video");
        //   newVideos.forEach((videoElement) => {
        //     const exists = contexts.some(
        //       (context) => context.videoElement === videoElement
        //     );
        //     if (!exists) {
        //       const { handleVideoAudio, canvas } = createAudioContext();
        //       handleVideoAudio(videoElement);
        //       contexts.push({ canvas, videoElement });
        //     }
        //   });
        // }, 2000);
      }

      startAudioAnalysis();
    })();
  },
};
