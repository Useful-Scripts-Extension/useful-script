import { openWebAndRunScript, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Download watching video",
    vi: "Tiktok - Tải video đang xem",
  },
  description: {
    en: "Download tiktok video that you are watching (include watermark)",
    vi: "Tải video tiktok bạn đang xem (có watermark)",
  },
  runInExtensionContext: false,

  func: async function () {
    let el = document.querySelector("video")?.parentElement.parentElement,
      keyFiber = "",
      keyProp = "";

    for (let k of Object.keys(el)) {
      if (k.indexOf("__reactFiber") === 0) {
        keyFiber = k;
      }
      if (k.indexOf("__reactProps") === 0) {
        keyProp = k;
      }
    }

    let url =
      el[keyFiber].child?.memoizedProps?.url ||
      el[keyFiber].firstEffect?.memoizedProps?.url ||
      el[keyProp].children?.[0]?.props?.url;
    url ? window.open(url) : alert("Không tìm thấy link video");
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

  // =================== Tải về mọi video trong user tiktok ===================
  let containers = Array.from(
    document.querySelectorAll(".tiktok-x6y88p-DivItemContainerV2.e19c29qe7")
  );
  let videos = [];

  for (let c of containers) {
    // find react fiber key
    let key = "";
    for (let k of Object.keys(c)) {
      if (k.indexOf("__reactFiber") === 0) {
        key = k;
        break;
      }
    }
    let video =
      c[key].firstEffect?.memoizedProps ||
      c[key].lastEffect?.memoizedProps ||
      c[key].return?.alternate?.firstEffect?.memoizedProps;

    videos.push(video);
  }

  console.log(videos);
}
