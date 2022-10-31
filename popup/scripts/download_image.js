export default {
  icon: "https://lh3.googleusercontent.com/_8e79Pwdo6TDVUifSMzqFdRKQ-ecpFX_75hj2147LyRGKTHNtuL_yeT4ar72SzECS7gfItTFumowOAsxKfKGqaAS21k=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Image Downloader",
    vi: "Image Downloader - Tải hình ảnh",
  },
  description: {
    en: "Download all images in viewport",
    vi: "Tải tất cả hình ảnh đang thấy trong trang web",
  },
  func: function () {
    // images downloader: https://chrome.google.com/webstore/detail/image-downloader/cnpniohnfphhjihaiiggeabnkjhpaldj
    const imageUrlRegex =
      /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:bmp|gif|ico|jfif|jpe?g|png|svg|tiff?|webp))(?:\?([^#]*))?(?:#(.*))?/i;
    function extractImagesFromSelector(selector, onlyInViewport = false) {
      return unique(
        toArray(document.querySelectorAll(selector))
          .filter((_) =>
            onlyInViewport ? isElementIntersectViewport(_) : true
          )
          .map(extractImageFromElement)
          .filter(isTruthy)
          .map(relativeUrlToAbsolute)
      );
    }
    function extractImageFromElement(element) {
      if (element.tagName.toLowerCase() === "img") {
        const src = element.src;
        const hashIndex = src.indexOf("#");
        return hashIndex >= 0 ? src.substr(0, hashIndex) : src;
      }
      if (element.tagName.toLowerCase() === "image") {
        const src = element.getAttribute("xlink:href");
        const hashIndex = src.indexOf("#");
        return hashIndex >= 0 ? src.substr(0, hashIndex) : src;
      }
      if (element.tagName.toLowerCase() === "a") {
        const href = element.href;
        if (isImageURL(href)) {
          return href;
        }
      }
      const backgroundImage = window.getComputedStyle(element).backgroundImage;
      if (backgroundImage) {
        const parsedURL = extractURLFromStyle(backgroundImage);
        if (isImageURL(parsedURL)) {
          return parsedURL;
        }
      }
    }
    function isElementIntersectViewport(el) {
      var rect = el.getBoundingClientRect();
      //prettier-ignore
      return !(
          rect.bottom < 0 ||
          rect.right < 0 ||
          rect.top > (window.innerHeight || document.documentElement.clientHeight) ||
          rect.left > (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    function isImageURL(url) {
      return url.indexOf("data:image") === 0 || imageUrlRegex.test(url);
    }
    function extractURLFromStyle(style) {
      return style.replace(/^.*url\(["']?/, "").replace(/["']?\).*$/, "");
    }
    function relativeUrlToAbsolute(url) {
      return url.indexOf("/") === 0 ? `${window.location.origin}${url}` : url;
    }
    function unique(values) {
      return toArray(new Set(values));
    }
    function toArray(values) {
      return [...values];
    }
    function isTruthy(value) {
      return !!value;
    }

    const mode = window.prompt(
      "Choose mode:\n\n- 1: Download current image (in viewport)\n- 2: Download all images",
      1
    );

    if (mode) {
      const allImages = extractImagesFromSelector(
        "img, image, a, [class], [style]",
        mode == "1"
      );

      console.log(allImages);
    }
  },
};
