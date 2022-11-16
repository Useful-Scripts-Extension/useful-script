export default {
  icon: "",
  name: {
    en: "Download audio in webpage",
    vi: "Tải nhạc/âm thanh đang phát",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    let audios = document.querySelectorAll("audio");

    if (!audios.length) {
      alert("Audio not found / Không tìm thấy âm thanh audio nào trong web.");
    } else {
      let id = "useful-scripts-download-audio";
      let div = document.querySelector("#" + id);

      if (!div) {
        div = document.createElement("div");
        div.id = id;
        div.style.position = "fixed";
        div.style.top = 0;
        div.style.left = 0;
        div.style.width = "250px";
        div.style.height = "200px";
        div.style.zIndex = 9999;
        document.body.appendChild(div);
      } else {
        div.innerHTML = "";
      }

      for (let audio of Array.from(audios)) {
        if (audio.src) {
          let audioTag = document.createElement("audio");
          audioTag.src = audio.src;
          audioTag.controls = "controls";
          div.appendChild(audioTag);
        }
      }
    }
  },
};
