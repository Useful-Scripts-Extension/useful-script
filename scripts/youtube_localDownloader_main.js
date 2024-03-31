function formatSize(size) {
  size = Number(size);

  if (!size) return "?";

  // format to KB, MB, GB
  if (size < 1024) {
    return size + "B";
  }
  if (size < 1024 * 1024) {
    return (size / 1024).toFixed(2) + "KB";
  }
  if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + "MB";
  }
  return (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
}

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
    const div = document.createElement("div");
    div.innerHTML = `
      <a
        href="${video.url}"
        target="_blank">
        <p>
          ${video.qualityLabel}
          - ${video.width}x${video.height}
          - ${formatSize(video.contentLength)}
          ${video.audioQuality ? "" : " (no audio)"}
        </p>
      </a>
    `;
    document.body.appendChild(div);
  }

  // audio
  for (let audio of audios) {
    const div = document.createElement("div");
    div.innerHTML = `
      <audio src="${audio.url}" controls></audio>
      <p>
        ${audio.audioTrack?.displayName || audio.audioQuality}
         - ${formatSize(audio.contentLength)}
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
