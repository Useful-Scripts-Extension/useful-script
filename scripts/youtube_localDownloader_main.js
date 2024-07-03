import { UfsGlobal } from "./content-scripts/ufs_global.js";

const { formatSize, promiseAllStepN } = UfsGlobal.Utils;
const { injectScriptSrc } = UfsGlobal.DOM;

const xhrDownloadUint8Array = async ({ url, contentLength }, progressCb) => {
  if (typeof contentLength === "string")
    contentLength = parseInt(contentLength);
  progressCb({
    loaded: 0,
    total: contentLength,
    speed: 0,
  });
  const chunkSize = 65536;
  const getBuffer = (start, end) =>
    fetch(url + `&range=${start}-${end ? end - 1 : ""}`).then((r) =>
      r.arrayBuffer()
    );
  const data = new Uint8Array(contentLength);
  let downloaded = 0;
  const tasks = [];
  const startTime = Date.now();

  for (let start = 0; start < contentLength; start += chunkSize) {
    const exceeded = start + chunkSize > contentLength;
    const curChunkSize = exceeded ? contentLength - start : chunkSize;
    const end = exceeded ? null : start + chunkSize;
    tasks.push(() => {
      console.log("dl start", url, start, end);
      return getBuffer(start, end)
        .then((buf) => {
          console.log("dl done", url, start, end);
          downloaded += curChunkSize;
          data.set(new Uint8Array(buf), start);
          const ds = (Date.now() - startTime + 1) / 1000;
          progressCb({
            loaded: downloaded,
            total: contentLength,
            speed: downloaded / ds,
          });
        })
        .catch((err) => {
          console.error("Download error", err);
        });
    });
  }
  await promiseAllStepN(6, tasks);
  return data;
};

window.onload = () => {
  const yt_data = JSON.parse(
    localStorage.getItem("ufs_youtube_localDownloader") ?? "{}"
  );

  console.log(yt_data);

  const streamingData = [
    ...(yt_data.streamingData?.formats || []),
    ...(yt_data.streamingData?.adaptiveFormats || []),
  ].filter((_) => _.url);

  const videoDetails = yt_data.videoDetails;
  const videos = streamingData.filter((d) => d.mimeType.includes("video"));
  const audios = streamingData.filter((d) => d.mimeType.includes("audio"));
  const captions =
    yt_data.captions?.playerCaptionsTracklistRenderer?.captionTracks || [];

  console.log(captions);

  // video details
  const detailDiv = document.createElement("div");
  const thumbs = videoDetails.thumbnail?.thumbnails || [];
  const lastThumbnail = thumbs[thumbs.length - 1];

  detailDiv.innerHTML = `
  <img src="${lastThumbnail.url}" width="500px"/>
  <h1>${videoDetails.title}</h1>
  <h2>${videoDetails.author}</h2>
  <p>${videoDetails.shortDescription}</p>`;
  document.body.appendChild(detailDiv);

  // video
  for (let video of videos) {
    const button = document.createElement("button");
    button.style = "display:block;margin-bottom:5px";
    button.innerHTML = `
          ${video.qualityLabel}
          - ${video.width}x${video.height}
          - ${formatSize(video.contentLength, 2)}
          ${video.audioQuality ? "" : " (no audio)"}`;
    button.onclick = () => {
      let data = xhrDownloadUint8Array(video, (progress) => {
        console.log(progress);
      });
      // saveAs(video.url, "video.mp4", {
      //   onprogress: (e) => {
      //     console.log(e);
      //   },
      // });
    };
    document.body.appendChild(button);
  }

  // audio
  for (let audio of audios) {
    const div = document.createElement("div");
    div.innerHTML = `
      <audio src="${audio.url}" controls></audio>
      <p>
        ${audio.audioTrack?.displayName || audio.audioQuality}
         - ${formatSize(audio.contentLength, 2)}
      </p>
    `;
    document.body.appendChild(div);
  }

  // caption
  for (let caption of captions) {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${caption.name?.simpleText}</p>
      <a
        href="${caption.baseUrl}"
        download="${caption.name.simpleText}.srt"
        target="_blank">
        Download
      </a>
    `;
    document.body.appendChild(div);
  }
};
