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
    // #region get image src at mouse

    let mouse = { x: 0, y: 0 };
    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const imageUrlRegex =
      /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:bmp|gif|ico|jfif|jpe?g|png|svg|tiff?|webp))(?:\?([^#]*))?(?:#(.*))?/i;
    const bgRegex = /.*url\(\s*["']?(.+?)["']?\s*\)([^'"].*|$)/i;
    function isImageURL(url) {
      return url.indexOf("data:image") === 0 || imageUrlRegex.test(url);
    }
    function relativeUrlToAbsolute(url) {
      return url.indexOf("/") === 0 ? `${window.location.origin}${url}` : url;
    }
    function hasBg(node) {
      if (
        node.nodeName.toUpperCase() == "HTML" ||
        node.nodeName == "#document"
      ) {
        return false;
      }
      let nodeStyle = window.getComputedStyle(node);
      let bg =
        node &&
        nodeStyle.backgroundRepeatX != "repeat" &&
        nodeStyle.backgroundRepeatY != "repeat" &&
        nodeStyle.backgroundImage;
      if (!bg || bg == "none") return false;
      return (
        bg.length > 200 || // base64
        (node.clientWidth > 1 &&
          node.clientHeight > 1 &&
          /^\s*url\(\s*['"]?\s*[^ad\s'"]/.test(bg))
      );
    }
    const lazyImgAttr = [
      "src",
      "_src",
      "data-lazy-src",
      "org_src",
      "data-lazy",
      "data-url",
      "data-orig-file",
      "zoomfile",
      "file",
      "original",
      "load-src",
      "imgsrc",
      "real_src",
      "src2",
      "origin-src",
      "data-lazyload",
      "data-lazyload-src",
      "data-lazy-load-src",
      "data-ks-lazyload",
      "data-ks-lazyload-custom",
      "data-src",
      "data-defer-src",
      "data-actualsrc",
      "data-cover",
      "data-original",
      "data-thumb",
      "data-imageurl",
      "data-placeholder",
      "lazysrc",
    ];
    function getImgSrcFromElement(ele) {
      if (!ele) return null;

      let fn = [
        () => {
          if (!ele.srcset) return null;
          var srcs = ele.srcset.split(/[xw],/i),
            largeSize = -1,
            largeSrc = null;
          srcs.forEach((srci) => {
            let srcInfo = srci.trim().split(" "),
              curSize = parseInt(srcInfo[1] || 0);
            if (srcInfo[1] && curSize > largeSize) {
              largeSize = curSize;
              largeSrc = srcInfo[0];
            }
          });
          return largeSrc;
        },
        () => {
          if (hasBg(ele)) {
            let bg = window
              .getComputedStyle(ele)
              .backgroundImage.replace(bgRegex, "$1")
              .replace(/\\"/g, '"');
            return bg;
          }
          return null;
        },
        () => {},
        () => {
          if (/img|picture|image|a/i.test(ele.tagName))
            for (let i in lazyImgAttr) {
              let attrName = lazyImgAttr[i];
              let attrValue = ele.getAttribute(attrName);
              if (/\bimagecover\.\w+$/i.test(attrValue)) continue;
              if (attrValue) {
                return attrValue;
              }
            }
        },
      ];

      for (let f of fn) {
        try {
          let src = f();
          src && console.log(src);
          if (src) return relativeUrlToAbsolute(src);
        } catch (e) {
          console.log("error", e);
        }
      }
      return null;
    }

    function getImgAtMouse() {
      let eles = Array.from(document.elementsFromPoint(mouse.x, mouse.y));
      console.log(eles);

      for (let i = 0; i < eles.length; i++) {
        let ele = eles[i];
        let src = getImgSrcFromElement(ele);
        if (src) return src;
      }

      return null;
    }

    // #endregion

    // #region create UI
    function resize(curW, curH, maxW, maxH) {
      // if (curW <= maxW && curH <= maxH) return { width: curW, height: curH };

      let ratio = curW / curH;
      let newRatio = maxW / maxH;
      if (ratio > newRatio) {
        return { width: maxW, height: maxW / ratio };
      } else {
        return { width: maxH * ratio, height: maxH };
      }
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

      // size
      let size = document.createElement("div");
      size.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        padding: 10px;
        background-color: #111;
        color: white;
        z-index: 2;
        cursor: pointer;
      `;
      size.innerText = "Size";
      size.title = "Show original size";
      size.onclick = () => {
        img.style.width = img.naturalWidth + "px";
        img.style.height = img.naturalHeight + "px";
        img.style.left = window.innerWidth / 2 + "px";
        img.style.top = window.innerHeight / 2 + "px";
      };
      overlay.appendChild(size);

      // image
      let img = document.createElement("img");
      img.src = src;
      img.style.cssText = `
        top: ${window.innerHeight / 2}px;
        left: ${window.innerWidth / 2}px;
        transform: translate(-50%, -50%) !important;
        background:
          linear-gradient( 45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 255, 255, 0.4) 100% ) 0 0 / 20px 20px,
          linear-gradient( 45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 255, 255, 0.4) 100% ) 10px 10px / 20px 20px !important;
      `;
      let isFirstLoad = false;
      img.onload = () => {
        let curW = img.naturalWidth,
          curH = img.naturalHeight;

        size.innerText = `${curW} x ${curH}`;

        // first load - original image
        if (!isFirstLoad) {
          isFirstLoad = true;

          let newSize = resize(
            curW,
            curH,
            Math.max(window.innerWidth - 100, 400),
            Math.max(window.innerHeight - 100, 400)
          );

          img.style.width = `${newSize.width}px`;
          img.style.height = `${newSize.height}px`;
        }

        // second+ load -> usually largest image
        else {
          let newRatio = curW / curH;
          img.style.height = `${parseInt(img.style.width) / newRatio}px`;
        }
      };
      overlay.appendChild(img);

      // loading
      let loading = document.createElement("div");
      loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        padding: 10px;
        background-color: #111;
        color: white;
        z-index: 1;
      `;
      loading.innerText = "Loading...";
      overlay.appendChild(loading);

      UfsGlobal.DOM.enableDragAndZoom(img, overlay);

      return {
        setSrc: (src) => {
          img.src = src;
        },
      };
    }

    // #endregion

    // #region main

    let unsub = UfsGlobal.DOM.onDoublePress("Control", async () => {
      let src = getImgAtMouse();

      if (!src) {
        UfsGlobal.DOM.notify({
          msg: "Useful-script: No image found",
          x: mouse.x,
          y: mouse.y,
          align: "left",
        });
        return;
      }

      const { setSrc } = createPreview(src);
      UfsGlobal.Utils.getLargestImageSrc(src, location.href).then((_src) => {
        if (_src && src !== _src) {
          let tempImg = new Image();
          tempImg.src = _src;
          tempImg.onload = () => {
            setSrc(_src);
          };
        }
      });
    });
    // #endregion
  },
};
