export default {
  name: {
    en: "Toggle light video",
    vi: "Tắt/Mở đèn video",
  },
  description: {
    en: "Toggle light on/off to focus to video",
    vi: "Tắt/Mở đèn để tập trung xem video",
  },
  blackList: [],
  whiteList: ["www.youtube.com"],

  func: function () {
    let id = "useful-scripts-toogleLight-overlay";

    let old_overlays = Array.from(document.querySelectorAll("#" + id));
    if (old_overlays.length) {
      old_overlays.forEach((_) => _.remove());
    } else {
      let videos = document.querySelectorAll("video");
      let largestVideo = Array.from(videos).sort(
        (a, b) => a.videoWidth * a.videoHeight > b.videoWidth * b.videoHeight
      )?.[0];
      largestVideo.style.zIndex = 999;

      let overlay = document.createElement("div");
      overlay.id = id;
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.right = 0;
      overlay.style.bottom = 0;
      overlay.style.backgroundColor = "#000c";
      overlay.style.zIndex = 999;
      overlay.onclick = () => overlay.remove();
      document.body.appendChild(overlay);
    }
  },
};
