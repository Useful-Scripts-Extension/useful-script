import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";
import { shared as tiktok_downloadVideoNoWM } from "./tiktok_downloadVideo.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download watching video",
    vi: "Tiktok - Tải video đang xem",
  },
  description: {
    en: "Download tiktok video you are watching (no/have watermark)",
    vi: "Tải video tiktok bạn đang xem (không/có watermark)",
  },

  onClickExtension: async function () {
    let choice = prompt(
      "Chọn loại video:\n" + " 0: Không watermark\n" + " 1: Có watermark",
      0
    );
    if (choice == null) return;

    let { closeLoading, setLoadingText } = showLoading("Đang tìm video...");
    try {
      let title = "";
      try {
        title = await runScriptInCurrentTab(shared.getWatchingVideoTitle);
      } catch (e) {}

      setLoadingText(
        `Đang get link video...` + title
          ? `<br/><br/><p style="max-width:200px;text-overflow:ellipsis;">${title}}</p>`
          : ""
      );

      let url;
      if (choice == 0) {
        let videoId = await runScriptInCurrentTab(shared.getWatchingVideoId);
        url = await tiktok_downloadVideoNoWM.getVideoNoWaterMark(videoId, true);

        if (url) window.open(url);
        else throw Error("Không tìm được video");
      }
      if (choice == 1) {
        url = await runScriptInCurrentTab(shared.getLinkWatchingVideoFromWeb);
        await shared.renderVideoInWeb(url);
      }
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  getWatchingVideoTitle: function () {
    return document.querySelector("video").parentElement.parentElement
      .previousElementSibling.alt;
  },
  getWatchingVideoId: function () {
    return document.querySelector("video").parentElement.id.split("-").at(-1);
  },
  getLinkWatchingVideoFromWeb: function () {
    let el = document.querySelector("video")?.parentElement.parentElement,
      keyFiber = "",
      keyProp = "";
    for (let k of Object.keys(el)) {
      if (k.startsWith("__reactFiber")) keyFiber = k;
      if (k.startsWith("__reactProps")) keyProp = k;
    }
    return (
      el[keyFiber].firstEffect?.memoizedProps?.url ||
      el[keyProp].children?.[0]?.props?.url ||
      el[keyFiber].child?.memoizedProps?.url
    );
  },
  renderVideoInWeb: async function (url) {
    await runScriptInCurrentTab(
      (url) => {
        let div = document.createElement("div");
        div.innerHTML = `<div class="ufs-overlay">
          <div class="ufs-modal">
            <video src="${url}" controls></video>
            <button class="ufs-close-btn"  onclick="this.parentElement.parentElement.parentElement.remove()">X</button>
          </div>
        </div>
        
        <style>
          .ufs-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #000000ab;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999999;
          }
          .ufs-modal {
            background: white;
            max-width: 90vw;
            max-height: 90vh;
            position: relative;
          }
          .ufs-modal video {
            max-width: 300px;
          }
          .ufs-close-btn {
            color: white;
            background: red;
            padding: 5px 10px;
            position: absolute;
            top: 0;
            right: -30px;
            cursor: pointer;
            border: none;
          }
        </style>
        `;
        document.body.appendChild(div);
      },
      [url]
    );
  },
};
