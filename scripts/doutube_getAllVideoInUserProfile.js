export default {
  name: {
    en: "Get all video from user doutu.be profile",
    vi: "Tải tất cả video từ doutu.be profile",
  },
  description: {
    en: "Get all video in doutu.be user profile",
    vi: "Tải tất cả video từ profile của user doutu.be bất kỳ",
  },
  whiteList: ["https://doutu.be/*"],

  onClick: async function () {
    // https://stackoverflow.com/a/18197341/11898496
    function download(filename, text) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    const WAIT_FOR_FULL_VIDEO_LOADED = 5000;
    const FIND_FULL_VIDEO_INTERVAL = 100;
    const sleep = (m) => new Promise((r) => setTimeout(r, m));
    const getAllVideo = () =>
      Array.from(document.querySelectorAll('img[loading="lazy"].object-cover'));
    const getFullVideo = () => document.querySelector("video");
    const closeFullVideo = () =>
      document.querySelector("div.top-8.left-4")?.click();

    if (
      !confirm(
        "Tool sẽ tự động mở từng ảnh/video để lấy link.\nVui lòng không thoát trang web.\nBấm OK để bắt đầu quá trình lấy link."
      )
    ) {
      return;
    }

    let allUrls = [];

    const queue = getAllVideo();
    while (queue.length > 0) {
      const first = queue.shift();
      first.scrollIntoView();
      first.click();

      let full_video;
      let limit = WAIT_FOR_FULL_VIDEO_LOADED / FIND_FULL_VIDEO_INTERVAL;

      while (!full_video && limit > 0) {
        full_video = getFullVideo();
        limit--;
        await sleep(FIND_FULL_VIDEO_INTERVAL);
      }

      if (full_video) {
        allUrls.push(full_video.src);
        console.log(full_video.src);
      } else {
        console.log("Not found full video");
      }

      closeFullVideo();
      await sleep(500);
    }

    console.log(allUrls);
    alert("Tìm được " + allUrls.length + " videos. Bấm ok để tải xuống link.");
    download(location.pathname + ".txt", allUrls.join("\n"));
  },
};
