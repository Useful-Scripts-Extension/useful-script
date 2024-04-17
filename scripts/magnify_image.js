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
      var anchor = document.createElement("a");
      anchor.href = url;
      return anchor.href;
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
        (node.clientWidth > 5 &&
          node.clientHeight > 5 &&
          /^\s*url\(\s*['"]?\s*[^ad\s'"]/.test(bg))
      );
    }
    const lazyImgAttr = [
      "src",
      "_src",
      "xlink:href", // facebook
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
      ];

      for (let f of fn) {
        try {
          let src = f();
          src && console.log(src);
          if (
            src &&
            // exclude base64 image that too small
            !(/data:image/.test(src) && src.length < 100)
          )
            return relativeUrlToAbsolute(src);
        } catch (e) {
          console.log("error", e);
        }
      }
      return null;
    }

    function getAllChildElements(element) {
      let childElements = [];

      // Get all direct child elements of the current element
      let children = element.children;
      if (children?.length) {
        childElements = childElements.concat(children);

        // Loop through each child element
        for (let child of children) {
          // Recursively call the function to get all descendants of the child element
          let descendants = getAllChildElements(child);

          // Add the descendants to the array
          childElements = childElements.concat(descendants);
        }
      }

      return childElements;
    }

    function getAllParentElements(element) {
      let parentElements = [];
      while (element.parentElement) {
        parentElements.push(element.parentElement);
        element = element.parentElement;
      }
      return parentElements;
    }

    let lastTarget = null;
    document.addEventListener("mouseover", (e) => {
      lastTarget = e.target;
    });
    function getImgAtMouse() {
      // if (lastTarget) {
      //   let eles = [
      //     lastTarget,
      //     ...getAllChildElements(lastTarget),
      //     ...getAllParentElements(lastTarget),
      //   ];
      //   for (let ele of eles) {
      //     let src = getImgSrcFromElement(ele);
      //     if (src) {
      //       console.log(ele);
      //       return src;
      //     }
      //   }
      // }

      let eles = Array.from(document.elementsFromPoint(mouse.x, mouse.y));
      console.log(eles);

      for (let ele of eles) {
        let src = getImgSrcFromElement(ele);
        if (src) {
          console.log(ele);
          return src;
        }
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
      overlay.onclick = (e) => {
        e.preventDefault();
        if (e.target == overlay) overlay.remove();
      };
      document.body.appendChild(overlay);

      const style = document.createElement("style");
      style.textContent = `
        #${id} {
          font-family: "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif !important;
          font-size: 1em !important;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.8);
          z-index: 99999;
          overflow: hidden;
        }
        #${id + "-toolbar"} {
          position: fixed;
          display: flex;
          justify-content: center;
          align-items: center;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: #111a;
          color: white;
          z-index: 2;
          text-align: center;
        }
        #${id} img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
          cursor: zoom-out;
        }
        #${id} .ufs-btn {
          cursor: pointer;
          padding: 10px;
          background-color: #111;
        }
        #${id} .ufs-btn:hover {
          background: #555a;
        }
        #${id} .ufs-desc {
          position: absolute;
          top: 100%;
          background: #333;
          padding: 0 10px 5px;
          border-radius: 0 0 5px 5px;
        }
        #${id} img {
          transition: transform 0.15s ease;
        }
        `;
      overlay.appendChild(style);

      // image
      let img = document.createElement("img");
      img.src = src;
      img.style.cssText = `
        top: ${window.innerHeight / 2}px;
        left: ${window.innerWidth / 2}px;
        transform-origin: center;
        transform: translate(-50%, -50%) !important;
        min-width: 200px;
        min-height: 200px;
        max-width: 100vw;
        max-height: 100vh;
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

      // toolbar
      let toolbar = document.createElement("div");
      toolbar.id = id + "-toolbar";
      overlay.appendChild(toolbar);

      let transformStatus = {
        flip_horizontal: false,
        flip_vertical: false,
        rotate: 0,
      };

      // size
      let size = document.createElement("div");
      size.classList.add("ufs-btn");
      size.innerText = "Size";
      size.title = "Show original size";
      size.onclick = () => {
        img.style.width = img.naturalWidth + "px";
        img.style.height = img.naturalHeight + "px";
        img.style.left = window.innerWidth / 2 + "px";
        img.style.top = window.innerHeight / 2 + "px";
        size.innerText = `${img.naturalWidth} x ${img.naturalHeight}`;
      };
      toolbar.appendChild(size);

      UfsGlobal.DOM.enableDragAndZoom(img, overlay, (data) => {
        if (data?.type === "scale") {
          let scale = img.clientWidth / img.naturalWidth;
          size.innerText =
            size.innerText.replace(/ \(\d+%\)/, "") +
            ` (${(scale * 100).toFixed(0)}%)`;
        }
      });

      // toggle background
      const BgState = {
        none: "none",
        transparent: "transparent",
        dark: "dark",
        light: "light",
      };
      let bgStates = [
        BgState.none,
        BgState.transparent,
        BgState.dark,
        BgState.light,
      ];
      let curBgState =
        (Number(localStorage.getItem("ufs-magnify-image-bg")) || 0) - 1;

      let toggleBg = document.createElement("div");
      toggleBg.classList.add("ufs-btn");
      toggleBg.innerText = "B";
      toggleBg.title = "Change background";
      toggleBg.onclick = () => {
        curBgState = (curBgState + 1) % bgStates.length;
        img.style.background = "";
        img.style.boxShadow = "none";

        switch (bgStates[curBgState]) {
          case BgState.none:
            break;
          case BgState.transparent:
            var gradientValue =
              "linear-gradient(45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 255, 255, 0.4) 100%) 0 0 / 20px 20px, linear-gradient(45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 255, 255, 0.4) 100%) 10px 10px / 20px 20px";
            img.style.cssText +=
              "background: " + gradientValue + " !important;";
            break;
          case BgState.dark:
            img.style.background = "rgba(30, 30, 30, 1)";
            break;
          case BgState.light:
            img.style.background = "rgba(240, 240, 240, 1)";
            break;
        }

        toggleBg.innerText = "BG " + bgStates[curBgState];
        localStorage.setItem("ufs-magnify-image-bg", curBgState);

        // img.style.boxShadow =
        //   img.style.boxShadow == "none"
        //     ? "0 0 10px 5px rgba(0,0,0,0.35)"
        //     : "none";
      };
      toggleBg.click(); // default is toggle ON
      toolbar.appendChild(toggleBg);

      // toggle flip horizontally
      let flipH = document.createElement("div");
      flipH.classList.add("ufs-btn");
      flipH.innerText = "|";
      flipH.title = "Flip horizontally";
      flipH.onclick = () => {
        if (transformStatus.flip_horizontal) {
          img.style.transform = img.style.transform.replace("scaleX(-1)", "");
          transformStatus.flip_horizontal = false;
        } else {
          img.style.transform += " scaleX(-1)";
          transformStatus.flip_horizontal = true;
        }
      };
      toolbar.appendChild(flipH);

      // flip vertically
      let flipV = document.createElement("div");
      flipV.classList.add("ufs-btn");
      flipV.innerText = "--";
      flipV.title = "Flip vertically";
      flipV.onclick = () => {
        if (transformStatus.flip_vertical) {
          img.style.transform = img.style.transform.replace("scaleY(-1)", "");
          transformStatus.flip_vertical = false;
        } else {
          img.style.transform += " scaleY(-1)";
          transformStatus.flip_vertical = true;
        }
      };
      toolbar.appendChild(flipV);

      // rotate left
      let rotateLeft = document.createElement("div");
      rotateLeft.classList.add("ufs-btn");
      rotateLeft.innerText = "↺";
      rotateLeft.title = "Rotate left";
      rotateLeft.onclick = () => {
        img.style.transform = img.style.transform.replace(
          `rotate(${transformStatus.rotate}deg)`,
          ""
        );
        transformStatus.rotate = transformStatus.rotate - 90;
        img.style.transform += ` rotate(${transformStatus.rotate}deg)`;
      };
      toolbar.appendChild(rotateLeft);

      // rorate right
      let rotateRight = document.createElement("div");
      rotateRight.classList.add("ufs-btn");
      rotateRight.innerText = "↻";
      rotateRight.title = "Rotate right";
      rotateRight.onclick = () => {
        img.style.transform = img.style.transform.replace(
          `rotate(${transformStatus.rotate}deg)`,
          ""
        );
        transformStatus.rotate = transformStatus.rotate + 90;
        img.style.transform += ` rotate(${transformStatus.rotate}deg)`;
      };
      toolbar.appendChild(rotateRight);

      // desc
      let desc = document.createElement("div");
      desc.classList.add("ufs-desc");
      desc.innerText = "";
      toolbar.appendChild(desc);
      toolbar.onmousemove = (e) => {
        if (e.target?.title) desc.innerText = e.target.title;
        else desc.innerText = "";
      };
      toolbar.onmouseleave = () => {
        desc.innerText = "";
      };
      toolbar.appendChild(desc);

      return {
        setSrc: (_src) => {
          if (_src == src) return;
          img.src = _src;
        },
        overlay,
        img,
        size,
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

      const { setSrc, overlay, img, size } = createPreview(src);

      let removeLoading = UfsGlobal.DOM.addLoadingAnimation(overlay);
      UfsGlobal.Utils.getLargestImageSrc(src, location.href).then((src) => {
        setSrc(src);
        removeLoading();
      });
    });
    // #endregion
  },
};
