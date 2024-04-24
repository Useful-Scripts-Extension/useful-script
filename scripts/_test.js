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

  // whiteList: ["https://www.google.com/*"],

  onClick: async () => {
    //https://www.youtube.com/watch?v=uk96O7N1Yo0
    javascript: (function () {
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
        ele.addEventListener("mousemove", function (event) {
          if (!isDragging) return;
          var x = event.clientX - offsetX;
          var y = event.clientY - offsetY;
          ele.style.left = x + "px";
          ele.style.top = y + "px";
        });

        // Function to handle mouse up event
        ele.addEventListener("mouseup", function () {
          isDragging = false;
        });
      }

      function map(x, in_min, in_max, out_min, out_max) {
        return (
          ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
        );
      }

      function createAudioContext() {
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const canvas = document.createElement("canvas");
        canvas.style.cssText =
          "position: fixed; top: 0; left: 0; width: 600px; height: 400px; z-index: 2147483647;";
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        draggable(canvas);

        function draw() {
          analyser.getByteFrequencyData(dataArray);
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          const barWidth = ~~(bufferLength / canvas.width);
          for (let x = 0; x < canvas.width; x++) {
            let i = x * barWidth;
            let item = dataArray[i];
            const barHeight = map(item, 0, 255, 0, canvas.height);
            ctx.fillStyle = `rgba(255, 255, 255, ${map(item, 0, 255, 0, 1)})`;
            ctx.fillRect(x, canvas.height - barHeight, 1, barHeight);
          }
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
        setInterval(() => {
          const newVideos = document.querySelectorAll("video");
          newVideos.forEach((videoElement) => {
            const exists = contexts.some(
              (context) => context.videoElement === videoElement
            );
            if (!exists) {
              const { handleVideoAudio, canvas } = createAudioContext();
              handleVideoAudio(videoElement);
              contexts.push({ canvas, videoElement });
            }
          });
        }, 2000);
      }

      startAudioAnalysis();
    })();
  },
};

// record audio when have stream: https://stackoverflow.com/a/34919194/23648002

const backup = () => {
  javascript: (function () {
    // Create a canvas element
    var canvas = document.createElement("canvas");
    canvas.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 2147483647;";
    updateSize();
    var ctx = canvas.getContext("2d");

    function updateSize() {
      let w = window.innerWidth;
      let h = window.innerHeight;
      let ratio = w / h;

      canvas.width = 600;
      canvas.height = canvas.width / ratio;
    }

    window.addEventListener("resize", updateSize);

    // Add the canvas element to the DOM
    document.body.appendChild(canvas);

    // Variables to store the position of the canvas
    var offsetX, offsetY;
    var isDragging = false;

    // Function to handle mouse down event
    canvas.addEventListener("mousedown", function (event) {
      isDragging = true;
      offsetX = event.clientX - canvas.offsetLeft;
      offsetY = event.clientY - canvas.offsetTop;
    });

    // Function to handle mouse move event
    canvas.addEventListener("mousemove", function (event) {
      if (!isDragging) return;
      var x = event.clientX - offsetX;
      var y = event.clientY - offsetY;
      canvas.style.left = x + "px";
      canvas.style.top = y + "px";
    });

    // Function to handle mouse up event
    canvas.addEventListener("mouseup", function () {
      isDragging = false;
    });

    // Function to capture the visible tab and draw it onto the canvas
    function captureAndDraw() {
      console.log("captureAndDraw");
      // Capture the visible tab
      UfsGlobal.Extension.runInBackground("chrome.tabs.captureVisibleTab", [
        null,
        { format: "png" },
      ]).then(function (dataUrl) {
        var img = new Image();
        img.src = dataUrl;
        img.onload = function () {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setTimeout(() => {
            captureAndDraw();
          }, 500);
        };
      });
    }

    captureAndDraw();
  })();
};
