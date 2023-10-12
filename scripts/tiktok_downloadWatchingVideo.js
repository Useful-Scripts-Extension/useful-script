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

  onClickExtension: () => {
    alert("Chuột phải vào video để tải video");
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
};
