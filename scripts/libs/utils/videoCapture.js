/*!
 * @name      videoCapturer.js
 * @version   0.0.1
 * @author    Blaze
 * @date      2019/9/21 12:03
 * @github    https://github.com/xxxily
 */

async function setClipboard(blob) {
  if (navigator.clipboard) {
    navigator.clipboard
      .write([
        // eslint-disable-next-line no-undef
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ])
      .then(() => {
        console.info("[setClipboard] clipboard suc", blob.type);
      })
      .catch((e) => {
        console.error("[setClipboard] clipboard err", blob.type, e);
      });
  } else {
    console.error(
      "The current website does not support writing data to the clipboard, see:\n https://developer.mozilla.org/en-US/docs/Web/API/Clipboard"
    );
  }
}

var videoCapturer = {
  /**
   * Take a screenshot
   * @param video {dom} -必选 video dom 标签
   * @returns {boolean}
   */
  capture(video, download, title) {
    if (!video) return false;
    const t = this;
    const currentTime = `${Math.floor(video.currentTime / 60)}'${(
      video.currentTime % 60
    ).toFixed(3)}''`;
    const captureTitle = title || `${document.title}_${currentTime}`;

    /* Screenshot core logic */
    video.setAttribute("crossorigin", "anonymous");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    if (download) {
      t.download(canvas, captureTitle, video);
    } else {
      t.preview(canvas, captureTitle);
    }

    return canvas;
  },
  /**
   * Preview the captured screen content
   * @param canvas
   */
  preview(canvas, title) {
    canvas.style = "max-width:100%";
    const previewPage = window.open("", "_blank");
    previewPage.document.title = `capture previe - ${title || "Untitled"}`;
    previewPage.document.body.style.textAlign = "center";
    previewPage.document.body.style.background = "#000";
    previewPage.document.body.appendChild(canvas);
  },
  /**
   * Canvas downloads the intercepted content
   * @param canvas
   */
  download(canvas, title, video) {
    title = title || "videoCapturer_" + Date.now();

    try {
      /**
       * Try copying to clipboard
       * Note that some browsers do not support writing 'image/jpeg' type data to the clipboard. Image/jpg can, but the result of toBlob will be png data.
       * So here is a new 'image/png' to try to copy to the clipboard, instead of putting setClipboard(blob) in the try below
       * In addition, since the automatic downloading of the screenshot below will cause the page to be out of focus, it will also cause the copy to the clipboard to fail, so here we copy it to the clipboard first and then download it.
       */
      canvas.toBlob(
        function (blob) {
          setClipboard(blob);
        },
        "image/png",
        0.99
      );
    } catch (e) {
      console.error("无法将截图复制到剪贴板。", e);
    }

    try {
      canvas.toBlob(
        function (blob) {
          const el = document.createElement("a");
          el.download = `${title}.jpg`;
          el.href = URL.createObjectURL(blob);
          el.click();
        },
        "image/jpeg",
        0.99
      );
    } catch (e) {
      videoCapturer.preview(canvas, title);
      console.error(
        "The video source is restricted by the CORS logo and screenshots cannot be downloaded directly. See:\n https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
      );
      console.error(video, e);
    }
  },
};

export default videoCapturer;
