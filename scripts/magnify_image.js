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
          .sort(smallImageFirst)
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
    function smallImageFirst(a, b) {
      let aRect = UsefulScriptGlobalPageContext.DOM.getContentClientRect(a);
      let bRect = UsefulScriptGlobalPageContext.DOM.getContentClientRect(b);
      let diff = aRect.width * aRect.height - bRect.width * bRect.height;
      if (diff > 10) {
        return diff;
      }
      // natural size
      let aSize = a.naturalWidth * a.naturalHeight;
      let bSize = b.naturalWidth * b.naturalHeight;
      return bSize - aSize;
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

    function createPreview(src) {
      let id = "ufs-magnify-image";
      let exist = document.getElementById(id);
      if (exist) exist.remove();

      // container
      let overlay = document.createElement("div");
      overlay.id = id;
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 99999;
        overflow: hidden;
      `;
      overlay.onclick = (e) => {
        if (e.target == overlay) overlay.remove();
      };
      document.body.appendChild(overlay);

      // toolbar
      let toolbar = document.createElement("div");
      toolbar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        padding: 10px;
        background-color: #111;
        color: white;
      `;
      overlay.appendChild(toolbar);

      // size
      let size = document.createElement("div");
      size.innerText = "Size";
      toolbar.appendChild(size);

      // image
      let img = document.createElement("img");
      img.src = src;
      img.style.cssText = `
        top: ${window.innerHeight / 2}px;
        left: ${window.innerWidth / 2}px;
        transform: translate(-50%, -50%);
      `;
      img.onload = () => {
        let w = img.naturalWidth,
          h = img.naturalHeight;

        size.innerText = `${w} x ${h}`;

        // constrain to screen size
        let screenW = window.innerWidth / 1.5;
        let screenH = window.innerHeight / 1.5;

        if (w > screenW) {
          h = h * (screenW / w);
          w = screenW;
        }
        if (h > screenH) {
          w = w * (screenH / h);
          h = screenH;
        }

        img.style.width = `${w}px`;
        img.style.height = `${h}px`;
      };
      overlay.appendChild(img);

      UsefulScriptGlobalPageContext.DOM.enableDragAndZoom(img, overlay);
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
          UsefulScriptGlobalPageContext.DOM.notify({
            msg: "Useful-script: No image found",
            x: mouse.x,
            y: mouse.y,
            align: "left",
          });
          return;
        }

        createPreview(
          UsefulScriptGlobalPageContext.Utils.getLargestImageSrc(src)
        );
      }
    );
  },
};
