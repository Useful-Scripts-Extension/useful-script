export default {
  name: {
    en: "Get all images in insta newfeed",
    vi: "Tải về tất cả ảnh insta newfeed",
  },
  description: {
    en: "Get all images in newfeed instagram",
    vi: "Tải về tất cả ảnh đang có trên newfeed instagram",
  },
  blackList: [],
  whiteList: ["*://*.instagram.com"],

  onClick: async function () {
    const getAllImgTag = () =>
      Array.from(document.querySelectorAll("img[sizes*=px]")) || [];
    const sleep = (milliseconds) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));

    // https://greasyfork.org/en/scripts/14755-instagram-reloaded
    function getBestImage(imgEl) {
      try {
        return imgEl.srcset.split("w,")[0].split(" ")[0];
      } catch (e) {
        return imgEl.src;
      }
    }

    const img_srcs = [];
    const done = [];
    const img_queue = getAllImgTag();
    while (img_queue.length > 0) {
      const first = img_queue.shift();
      first.scrollIntoView();
      const src = getBestImage(first);
      img_srcs.push(src);
      console.log(src);
      done.push(first);
      const new_img = getAllImgTag().filter(
        (_) => done.indexOf(_) == -1 && img_queue.indexOf(_) == -1
      );
      img_queue.push(...new_img);
      await sleep(300);
    }

    console.log(img_srcs);
  },
};
