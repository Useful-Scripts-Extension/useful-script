export default {
  icon: "",
  name: {
    en: "Enable download instagram photos/videos",
    vi: "Cho phép chuột phải tải ảnh/video instagram",
  },
  description: {
    en: "Right click to download instagram photos/videos",
    vi: "Bấm chuột phải và tải ảnh/video instagram dễ dàng",
  },
  blackList: [],
  whiteList: ["*://*.instagram.com"],

  func: function () {
    const allImgs = Array.from(document.querySelectorAll("img[sizes*=px]"));
    const allImageMasks = Array.from(document.querySelectorAll("div._aagw"));
    const allVideos = Array.from(document.querySelectorAll("video"));
    const allVideoMasks = Array.from(
      document.querySelectorAll("div[aria-label='Control']")
    );
    const allVideoMasks2 = Array.from(document.querySelectorAll("._aakh"));

    [...allImageMasks, ...allVideoMasks, ...allVideoMasks2].forEach((mask) => {
      mask.remove();
    });

    allImgs.forEach((img) => {
      img.style.zIndex = 9999;
    });

    allVideos.forEach((video) => {
      console.log(video);
      window._video = video;
      video.controls = true;
      // video.controlslist.value = "nofullscreen noremoteplayback";
      video.style.zIndex = 9999;
    });

    alert("Done! can be download photo using right click now!");
  },
};
