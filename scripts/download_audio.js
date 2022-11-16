export default {
  icon: `<i class="fa-solid fa-music"></i>`,
  name: {
    en: "Download audio in webpage",
    vi: "Tải nhạc/âm thanh đang phát",
  },
  description: {
    en: "Will display all audio in website, easy to download/get link.",
    vi: "Hiển thị tất cả audio trong trang web, giúp dễ dàng tải xuống/lấy link.",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    let id = "useful-scripts-download-audio";

    let olddiv = document.querySelector("#" + id);
    if (olddiv) {
      olddiv.remove();
    }

    let audios = document.querySelectorAll("audio");

    if (!audios.length) {
      alert("Audio not found / Không tìm thấy âm thanh audio nào trong web.");
    } else {
      let div = document.createElement("div");
      div.id = id;
      div.style.position = "fixed";
      div.style.bottom = 0;
      div.style.left = 0;
      div.style.zIndex = 9999;
      div.style.backgroundColor = "#0005";
      document.body.appendChild(div);

      for (let audio of Array.from(audios)) {
        let src = audio.src;
        if (src) {
          let audioTag = document.createElement("audio");
          audioTag.src = src;
          audioTag.controls = "controls";
          div.appendChild(audioTag);
          div.innerHTML += "<br/>";

          let link = document.createElement("a");
          link.href = src;
          link.target = "_blank";
          link.textContent = "Open in new tab";
          div.appendChild(link);
          div.innerHTML += "<br/>";
        }
      }
    }
  },
};
