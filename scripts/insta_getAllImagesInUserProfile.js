export default {
  name: {
    en: "Get all images in insta user profile",
    vi: "Tải tất cả ảnh insta user profile",
  },
  description: {
    en: "Get all images in user profile",
    vi: "Tải tất cả ảnh có trong profile của user bất kỳ",
  },
  blackList: [],
  whiteList: ["*://*.instagram.com"],

  func: async function () {
    const WAIT_FOR_MODAL_IMG_LOAD = 5000;
    const FIND_IMG_IN_MODAL_INTERVAL = 100;
    const getOriginalVideoFromBlob = (videoEl) => {
      const instanceKey = Object.keys(videoEl).find((key) =>
        key.includes("Instance")
      );
      const $react = videoEl[instanceKey];
      const videoLink = $react.return.memoizedProps.fallbackSrc;
      return videoLink;
    };
    const getAllClickableDiv = () =>
      Array.from(document.querySelectorAll("div._9AhH0")) || [];
    const getMediaInViewport = () =>
      document.querySelector("article[role='presentation'] div.KL4Bh>img") ||
      document.querySelector("article[role='presentation'] div.E-66r>video");
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    window.onblur = function () {
      has_focus = false;
    };
    window.onfocus = function () {
      has_focus = true;
    };
    let has_focus = true;
    const queue = getAllClickableDiv();
    const done = [];
    const urls = [];
    while (queue.length > 0) {
      const first = queue.shift();
      first.scrollIntoView();
      first.click();
      done.push(first);
      const new_img = getAllClickableDiv().filter(
        (_) => done.indexOf(_) == -1 && queue.indexOf(_) == -1
      );
      queue.push(...new_img);
      let media;
      let limit = WAIT_FOR_MODAL_IMG_LOAD / FIND_IMG_IN_MODAL_INTERVAL;
      while ((!media && limit > 0) || !has_focus) {
        media = getMediaInViewport();
        limit--;
        await sleep(FIND_IMG_IN_MODAL_INTERVAL);
      }
      if (media) {
        console.log(media.tagName);
        if (media.tagName == "VIDEO") {
          const url = getOriginalVideoFromBlob(media);
          urls.push(url);
          console.log(url);
          window.open(url);
          window.focus();
        }
        if (media.tagName == "IMG") {
          urls.push(media.src);
          console.log(media.src);
        }
      }
      document.querySelector("div.Igw0E>button.wpO6b")?.click();
    }
    console.log(urls);
  },
};
