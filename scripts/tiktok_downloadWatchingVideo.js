import {
  openWebAndRunScript,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";
import * as tiktok_downloadVideoNoWM from "./tiktok_downloadVideoNoWM.js";

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
  runInExtensionContext: true,

  func: async function () {
    async function getWatchingVideoNoWM() {
      let videoId = await runScriptInCurrentTab(() =>
        document
          .querySelector("video")
          ?.parentElement?.id?.split?.("-")
          ?.at?.(-1)
      );

      return await tiktok_downloadVideoNoWM.shared.getVideoNoWaterMark(
        videoId,
        true
      );
    }

    function getWatchingVideo() {
      let el = document.querySelector("video")?.parentElement.parentElement,
        keyFiber = "",
        keyProp = "";
      for (let k of Object.keys(el)) {
        if (k.startsWith("__reactFiber")) keyFiber = k;
        if (k.startsWith("__reactProps")) keyProp = k;
      }
      return (
        el[keyFiber].child?.memoizedProps?.url ||
        el[keyFiber].firstEffect?.memoizedProps?.url ||
        el[keyProp].children?.[0]?.props?.url
      );
    }

    let choice = prompt(
      "Chọn loại video:\n" + " 0: Có watermark\n" + " 1: Không watermark",
      0
    );
    if (choice == null) return;

    let { closeLoading } = showLoading("Đang get link video...");
    try {
      let url;
      if (choice == 0) url = await runScriptInCurrentTab(getWatchingVideo);
      if (choice == 1) url = await getWatchingVideoNoWM();

      if (url) window.open(url);
      else throw Error("Không tìm được video");
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

async function backup() {
  // =================== Tải video (watermark) từ link video ===================
  let url = prompt("Nhập link tiktok video: ");
  if (url != null) {
    const { closeLoading } = showLoading("Đang get link video...");
    try {
      let res = await openWebAndRunScript({
        url,
        closeAfterRunScript: true,
        focusAfterRunScript: false,
        func: () => {
          return window.SIGI_STATE;
        },
      });
      if (!res) {
        alert("Không lấy được dữ liệu.");
        return;
      }
      let videoKey = Object.keys(res.ItemModule)?.[0];
      let videoData = res.ItemModule[videoKey];
      console.log(videoData);
      window.open(videoData?.video?.downloadAddr || videoData?.video?.playAddr);
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  }
}
