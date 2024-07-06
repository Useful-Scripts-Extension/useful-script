import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: `https://www.youtube.com/s/desktop/ff71ea81/img/favicon_48x48.png`,
  name: {
    en: "Download youtube video/audio",
    vi: "Tải video/audio youtube",
  },
  description: {
    en: `Bypass age restriction, without login
    <ul>
      <li>Click once to download current video</li>
      <li>Enable autorun to render download button</li>
    </ul>`,
    vi: `Tải cả video giới hạn độ tuổi, không cần đăng nhập
    <ul>
      <li>Bấm 1 lần để tải video hiện tại</li>
      <li>Bật tự chạy để hiển thị nút tải</li>
    </ul>`,
    img: "/scripts/youtube_downloadVideo.png",
  },
  badges: [BADGES.new],

  whiteList: ["https://*.youtube.com/*"],

  contentScript: {
    onClick: function () {
      let choose = prompt(
        "Tải video youtube: \n\n" +
          providers.map((_, i) => `${i}: ${_.name}`).join("\n") +
          "\n\nNhập lựa chọn:",
        0
      );

      if (choose != null && choose >= 0 && choose < providers.length) {
        let url = prompt("Nhập link youtube:", location.href);
        if (url) {
          url = providers[choose].func(url);
          let myWin = window.open(
            url,
            "Download Youtube Video",
            "directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=800, height=900"
          );
        }
      }
    },

    onDocumentIdle: () => {
      const downloadIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" focusable="false" style="pointer-events:none;display:inherit;width:100%;height:100%;">
          <path d="M17 18v1H6v-1h11zm-.5-6.6-.7-.7-3.8 3.7V4h-1v10.4l-3.8-3.8-.7.7 5 5 5-4.9z"></path>
        </svg>`;

      injectCss();

      let intervalId = setInterval(function () {
        const container = document.querySelector("#above-the-fold #title > h1");
        if (!container) return;

        clearInterval(intervalId);

        document.addEventListener("click", (e) => {
          const el = document.querySelector("#ufs-ytDownloadBtn__dropdown");
          if (e.target !== el || (el && el.style.display === "flex"))
            el.style.display = "none";
        });

        const links = providers.map(
          (provider) => /* html */ `
            <a data-provider="${provider.name}" class="ufs-ytDownloadVideo__btn">
              ${provider.name}
            </a>`
        );

        const div = document.createElement("div");
        div.id = "ufs-ytDownloadBtn__container";
        div.innerHTML = /* html */ `
            <button
              class="yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading"
              style="position:relative; margin:6px 0;"
            >
              <div class="yt-spec-button-shape-next__icon">
                ${downloadIcon}
              </div>

              <div class="yt-spec-button-shape-next__button-text-content">
                <span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">
                  Tải video
                </span>
              </div>

              <div id="ufs-ytDownloadBtn__dropdown" class="ufs-ytDownloadVideo__dropdown">
                ${links.join("")}
              </div>
            </button>`;

        const button = div.querySelector("button");
        button.addEventListener("click", (e) => {
          e.stopPropagation();
          const el = document.querySelector("#ufs-ytDownloadBtn__dropdown");
          if (!el) return;
          el.style.display = el.style.display == "flex" ? "none" : "flex";
        });

        const options = div.querySelectorAll("a");
        options.forEach((option) => {
          option.addEventListener("click", (e) => {
            e.stopPropagation();
            const providerName = option.getAttribute("data-provider");
            const provider = providers.find((p) => p.name === providerName);
            if (!provider) return;
            const url = provider.func(window.location.href);
            window.open(url, "_blank");
          });
        });

        container.insertAdjacentElement("afterend", div);
      }, 500);
    },
  },
};

// https://stackoverflow.com/a/8260383/11898496
export function getIdFromYoutubeURL(url) {
  const regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length == 11 ? match[1] : false;
}

const providers = [
  {
    name: "y2mate.com",
    func: (url) => url.replace("youtube", "youtubepp"),
  },
  {
    name: "yt5s.com",
    func: (url) => url.replace("youtube", "youtube5s"),
  },
  {
    name: "yt1s.com",
    func: (url) => "https://yt1s.com/vi/youtube-to-mp4?q=" + url,
  },
  {
    name: "tubemp3.to",
    func: (url) => "https://tubemp3.to/" + url,
  },
  {
    name: "10downloader.com",
    func: (url) => "https://10downloader.com/download?v=" + url,
  },
  {
    name: "9xbuddy.com",
    func: (url) => "https://9xbuddy.com/process?url=" + url,
  },
  {
    name: "ymp4.com",
    func: (url) => "https://ymp4.download/?url=" + url,
  },
  {
    name: "savefrom.net",
    func: (url) => url.replace("youtube", "ssyoutube"),
  },
  {
    name: "10downloader.com",
    func: (url) => url.replace("youtube", "000tube"),
  },
  {
    name: "getlinks.vip",
    func: (url) =>
      "https://getlinks.vip/vi/youtube/" + getIdFromYoutubeURL(url),
  },
];

function injectCss(
  path = "/scripts/youtube_downloadVideo.css",
  id = "ufs-yt_downloadVideo-css"
) {
  if (!document.querySelector("#" + id)) {
    UfsGlobal.Extension.getURL(path).then((url) => {
      UfsGlobal.DOM.injectCssFile(url, id);
    });
  }
}
