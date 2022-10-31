export default {
  name: {
    en: "Get all images in newfeed",
    vi: "Tải về tất cả ảnh newfeed",
  },
  description: {
    en: "Get all images in newfeed",
    vi: "Tải về tất cả ảnh đang có trên newfeed",
  },
  func: async function () {
    const getAllImgTag = () =>
      Array.from(document.querySelectorAll("img[sizes*=px]")) || [];
    const sleep = (milliseconds) => {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    };
    const img_srcs = [];
    const done = [];
    const img_queue = getAllImgTag();
    while (img_queue.length > 0) {
      const first = img_queue.shift();
      first.scrollIntoView();
      const src = first.src;
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
