import { BADGES } from "./helpers/badge.js";

export default {
  name: {
    en: "Remove images",
    vi: "Xoá mọi hình ảnh",
  },
  description: {
    en: "Remove all images from website.<br/> Click again to undo.",
    vi: "Chỉ để lại văn bản, giúp tập trung hơn.<br/>Bấm lại để hoàn tác.",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-05-01": "can undo",
  },

  contentScript: {
    onClick_: function () {
      var images,
        img,
        key = "data-ufs-remove-image";
      images = Array.from(
        document.querySelectorAll("img, picture, image, source")
      );
      for (var i = 0; i < images.length; ++i) {
        img = images[i];
        if (img.style.display == "none" && img.hasAttribute(key)) {
          img.style.display = img.getAttribute(key);
          img.removeAttribute(key);
        } else {
          let oldDisplay = img.style.display || "";
          img.setAttribute(key, oldDisplay);
          img.style.display = "none";
        }
      }
    },
  },
};
