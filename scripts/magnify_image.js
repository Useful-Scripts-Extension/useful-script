export default {
  icon: '<i class="fa-solid fa-magnifying-glass-plus"></i>',
  name: {
    en: "Magnify Image with Ctrl",
    vi: "Phóng to hình ảnh bằng Ctrl",
  },
  description: {
    en: "Press Ctrl twice to any image to open it in magnified window",
    vi: "Nhấn Ctrl 2 lần lên bất kỳ hình ảnh nào để xem nó trong cửa sổ phóng đại",
    img: "",
  },

  onDocumentStart: () => {
    let mouse = { x: 0, y: 0 };

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const imageUrlRegex =
      /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:bmp|gif|ico|jfif|jpe?g|png|svg|tiff?|webp))(?:\?([^#]*))?(?:#(.*))?/i;
    function extractImagesFromSelector(selector) {
      return unique(
        toArray(document.querySelectorAll(selector))
          .filter(isOverlapWithMouse)
          .map(extractImageFromElement)
          .filter(isTruthy)
          .map(relativeUrlToAbsolute)
      );
    }
    function isOverlapWithMouse(element) {
      const rect =
        UsefulScriptGlobalPageContext.DOM.getContentClientRect(element);
      return (
        mouse.x > rect.left &&
        mouse.x < rect.right &&
        mouse.y > rect.top &&
        mouse.y < rect.bottom
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

    let unsub = UsefulScriptGlobalPageContext.DOM.onDoublePress(
      "Control",
      () => {
        const srcs = extractImagesFromSelector(
          "img, image, a, [class], [style]"
        );

        console.log(srcs);
        let src = srcs?.[0];

        if (!src) {
          UsefulScriptGlobalPageContext.DOM.notify(
            "Useful-script: No image found",
            mouse.x,
            mouse.y
          );
          return;
        }

        UsefulScriptGlobalPageContext.Extension.getURL(
          "/scripts/magnify_image.html"
        ).then((url) => {
          let w = 500,
            h = 500,
            left = screen.width / 2 - w / 2,
            top = screen.height / 2 - h / 2;

          window.open(
            url + "?src=" + encodeURIComponent(src),
            "Magnify image",
            `width=${w},height=${h},top=${top},left=${left},location=no`
          );
        });
      }
    );
  },
};
