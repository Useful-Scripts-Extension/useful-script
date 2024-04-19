export default {
  icon: '<i class="fa-solid fa-magnifying-glass-plus"></i>',
  name: {
    en: "Magnify any Image",
    vi: "Phóng to mọi hình ảnh",
  },
  description: {
    en: `Press Ctrl twice (or right click) to any image to open it in magnified window
    <br/><br/>
    Auto find large version of image to show.`,
    vi: `Nhấn Ctrl 2 lần (hoặc chuột phải) lên bất kỳ hình ảnh nào để xem nó trong cửa sổ phóng đại
    <br/><br/>
    Tự động tìm ảnh có kích thước lớn nhất để hiển thị.`,
    img: "",
  },

  onClickExtension: () => {
    window.close(); // close extension popup
  },

  onClick: () => {
    const { remove, setPosition } = UfsGlobal.DOM.notify({
      msg: "Useful-script: Click any image to magnify",
      duration: 99999,
      styleText: `
        transition: none !important;
        pointer-events: none !important;
      `,
    });

    let overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-color: #0002;
      z-index: 99998;
    `;
    overlay.addEventListener("mousemove", (e) => {
      setPosition(e.clientX, e.clientY + 20);
    });
    document.body.appendChild(overlay);

    function clickToMagnify(e) {
      window.ufs_magnify_image_magnifyImage?.(e.clientX, e.clientY);
      overlay.remove();
      remove();
    }
    overlay.addEventListener("click", clickToMagnify);
  },

  onDocumentStart: () => {
    // #region get image src at mouse

    let mouse = { x: 0, y: 0 };
    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function relativeUrlToAbsolute(url) {
      var anchor = document.createElement("a");
      anchor.href = url;
      return anchor.href;
    }
    function getBg(node) {
      if (
        !node ||
        node.nodeName?.toUpperCase?.() == "HTML" ||
        node.nodeName == "#document"
      ) {
        return false;
      }
      return ["", "::before", "::after"]
        .map((s) => {
          let nodeStyle = window.getComputedStyle(node, s);
          let bg = nodeStyle.backgroundImage;
          if (bg) {
            let bgUrls = bg.split(",");
            let urls = bgUrls.map(
              (url) => url.match(/url\((['"]?)(.*?)\1\)/)?.[2]
            );
            return urls.filter((url) => url !== null);
          }
          return null;
        })
        .flat()
        .filter((_) => _);
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
    function getImgSrcsFromElement(ele) {
      if (!ele) return null;

      let fn = [
        () => {
          if (!ele.srcset) return null;
          var srcs = ele.srcset.split(/[xw],/i),
            largeSize = -1,
            largeSrc = null;
          if (!srcs.length) return null;
          srcs.forEach((srci) => {
            let srcInfo = srci.trim().split(/(\s+|%20)/),
              curSize = parseInt(srcInfo[2] || 0);
            if (srcInfo[0] && curSize > largeSize) {
              largeSize = curSize;
              largeSrc = srcInfo[0];
            }
          });
          return largeSrc;
        },
        () => {
          // if (/img|picture|source|image|a/i.test(ele.tagName))
          for (let i in lazyImgAttr) {
            let attrName = lazyImgAttr[i];
            let attrValue = ele.getAttribute(attrName);
            if (/\bimagecover\.\w+$/i.test(attrValue)) continue;
            if (attrValue) {
              return attrValue;
            }
          }
        },
        () => getBg(ele),
      ];

      let results = [];
      for (let f of fn) {
        try {
          let srcs = f();
          if (srcs && srcs?.length) {
            if (!Array.isArray(srcs)) srcs = [srcs];
            results = results.concat(
              srcs.map((src) => relativeUrlToAbsolute(src))
            );
          }
        } catch (e) {
          console.log("error", e);
        }
      }
      return results;
    }

    function getAllChildElements(element) {
      let childElements = [];

      // Get all direct child elements of the current element
      let children = element.children;
      if (children?.length) {
        childElements = childElements.concat(Array.from(children));

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

    async function filterImageSrcs(eleSrcs) {
      try {
        const results = await Promise.all(
          eleSrcs.map((e) => UfsGlobal.Utils.isImageSrc(e.src))
        );
        return eleSrcs.filter((src, index) => results[index]);
      } catch (error) {
        console.log("ERROR", error);
        return [];
      }
    }

    async function getImagesAtMouse() {
      let eles = Array.from(document.querySelectorAll("*"));

      eles = eles.reverse().filter((ele) => {
        let rect = ele.getBoundingClientRect();
        return (
          rect.left <= mouse.x &&
          rect.right >= mouse.x &&
          rect.top <= mouse.y &&
          rect.bottom >= mouse.y
        );
      });

      if (!eles.length) return null;

      console.log("eles", eles);

      let results = [];
      for (let ele of eles) {
        let srcs = getImgSrcsFromElement(ele);
        if (srcs && srcs?.length) {
          if (!Array.isArray(srcs)) srcs = [srcs];
          srcs.forEach((src) => {
            if (!results.find((r) => r.src == src)) results.push({ src, ele });
          });
        }
      }
      console.log("results", results);

      if (results.length > 1) {
        let rank = [/source/i, /img/i, /picture/i, /image/i, /a/i];
        results = results.sort((a, b) => {
          let rankA = rank.findIndex((r) => r.test(a.src));
          let rankB = rank.findIndex((r) => r.test(b.src));
          rankA = rankA == -1 ? 100 : rankA;
          rankB = rankB == -1 ? 100 : rankB;
          return rankB - rankA;
        });
        console.log("after sort", results);
      }

      // filter out video
      results = results.filter(({ ele, src }) => {
        return !/video/i.test(ele.tagName) && !/iframe/i.test(ele.tagName);
      });

      // results = await filterImageSrcs(results);

      console.log("after filter", results);

      return results;
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

    function chooseImg(srcs, x = mouse.x, y = mouse.y) {
      let id = "ufs-magnify-choose-image";
      let exist = document.getElementById(id);
      if (exist) exist.remove();

      // container
      let overlay = document.createElement("div");
      overlay.id = id;
      overlay.onclick = (e) => {
        e.preventDefault();
        if (e.target == overlay || e.target == container) {
          overlay.remove();
        }
      };
      document.body.appendChild(overlay);

      // styles
      const style = document.createElement("style");
      style.textContent = `
        #${id} {
          position: fixed;
          top: ${y}px;
          left: ${x}px;
          width: 0;
          height: 0;
          opacity: 0;
          border-radius: 50%;
          background-color: #000d;
          z-index: 99999;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.3s ease, background 0s ease;
        }
        #${id} .img-container {
          display: flex;
          flex-wrap: wrap;
          overflow-y: auto;
          overflow-x: hidden;
          width: 100%;
          height: 100%;
          align-items: center;
          justify-content: center;
          grid-gap: 10px;
        }
        #${id} .con {
          position: relative;
        }
        #${id} .size {
          position: absolute;
          top: 0px;
          left: 0px;
          font-size: 12px;
          color: #eee;
          background-color: #0005;
          opacity: 0.5;
          z-index: 2;
          padding: 5px;
          border-radius: 5px;
          transition: all 0.2s ease;
          pointer-events: none;
        }
        #${id} .con:hover .size {
          opacity: 1;
          background-color: #000a;
        }
        #${id} img {
          max-width: 300px;
          max-height: 300px;
          min-width: 50px;
          min-height: 50px;
          object-fit: contain;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        #${id} .con:hover img {
          transform: scale(1.1);
          z-index: 2;
          box-shadow: 0 0 10px #fffa;
        }
      `;
      overlay.appendChild(style);

      // animation overlay
      setTimeout(() => {
        overlay.style.top = 0;
        overlay.style.left = 0;
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.opacity = 1;
        overlay.style.borderRadius = "0";
      }, 0);

      // images
      let container = document.createElement("div");
      container.classList.add("img-container");

      for (let src of srcs) {
        let con = document.createElement("div");
        con.classList.add("con");
        container.appendChild(con);

        // size
        let size = document.createElement("div");
        size.classList.add("size");
        con.appendChild(size);

        // img
        let img = document.createElement("img");
        img.src = src;
        img.onload = () => {
          size.innerText = `${img.naturalWidth} x ${img.naturalHeight}`;
        };
        img.onclick = () => {
          // overlay.remove();
          overlay.style.backgroundColor = "#0000";
          createPreview(src, mouse.x, mouse.y, () => {
            overlay.style.backgroundColor = "#000d";
          });
        };
        con.appendChild(img);
      }
      overlay.appendChild(container);
    }

    function createPreview(src, x = mouse.x, y = mouse.y, onClose = () => {}) {
      let id = "ufs-magnify-image";
      let exist = document.getElementById(id);
      if (exist) exist.remove();

      // container
      let overlay = document.createElement("div");
      overlay.id = id;
      overlay.onclick = (e) => {
        e.preventDefault();
        if (e.target == overlay) {
          overlay.remove();
          onClose?.();
        }
      };
      document.body.appendChild(overlay);

      // styles
      const style = document.createElement("style");
      style.textContent = `
        #${id} * {
          font-family: "Segoe UI", Frutiger, "Frutiger Linotype", "Dejavu Sans", "Helvetica Neue", Arial, sans-serif !important;
          font-size: 1em !important;
        }
        #${id} {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #000d;
          z-index: 99999;
          overflow: hidden;
        }
        #${id} .ufs-toolbar {
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
          background-color: #111a;
          z-index: 1;
        }
        #${id} .ufs-btn:hover {
          background: #555a;
        }
        #${id} .ufs-desc {
          position: absolute;
          top: 0;
          opacity: 0;
          background: #333;
          padding: 0 10px 5px;
          border-radius: 0 0 5px 5px;
          transition: all 0.3s ease;
          pointer-events: none;
          z-index: 0;
        }
        #${id} .ufs-toolbar:hover .ufs-desc {
          top: 100%;
          opacity: 1;
        }
        #${id} img {
          transition: transform 0.15s ease, opacity 0.5s ease 0.15s;
        }
        #${id} .ufs-img-anim {
          transition: all 0.3s ease !important;
          transform-origin: center;
          transform: translate(-50%, -50%);
          width: 40px;
          height: 40px;
          background-color: #fffa;
          border-radius: 50%;
        }
        `;
      overlay.appendChild(style);

      // animation div: a rect that represent image scaled up from original position (mouse position)
      let animDiv = document.createElement("div");
      animDiv.classList.add("ufs-img-anim");
      animDiv.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
      `;
      overlay.appendChild(animDiv);
      let removeAnimLoading;
      setTimeout(() => {
        removeAnimLoading = UfsGlobal.DOM.addLoadingAnimation(animDiv, 40);
      }, 500);

      // image
      let img = document.createElement("img");
      img.src = src;
      img.style.cssText = `
        top: ${window.innerHeight / 2}px;
        left: ${window.innerWidth / 2}px;
        transform-origin: center;
        transform: translate(-50%, -50%) !important;
        max-width: 100vw;
        max-height: 100vh;
        opacity: 0;
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
          img.style.opacity = 1;

          // animation
          removeAnimLoading?.();
          animDiv.style.top = img.style.top;
          animDiv.style.left = img.style.left;
          animDiv.style.width = img.style.width;
          animDiv.style.height = img.style.height;
          animDiv.style.borderRadius = 0;
          animDiv.style.opacity = 0;

          setTimeout(() => {
            animDiv.remove();
          }, 300);
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
      toolbar.classList.add("ufs-toolbar");
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
      size.ufs_title = "Toggle original size";
      size.onclick = () => {
        let w = img.naturalWidth,
          h = img.naturalHeight;

        if (
          parseInt(img.style.width) === w &&
          parseInt(img.style.height) === h
        ) {
          let newSize = resize(
            w,
            h,
            Math.max(window.innerWidth - 100, 400),
            Math.max(window.innerHeight - 100, 400)
          );
          w = newSize.width;
          h = newSize.height;
        }

        img.style.width = w + "px";
        img.style.height = h + "px";
        img.style.left = window.innerWidth / 2 + "px";
        img.style.top = window.innerHeight / 2 + "px";

        let zoom = 100 * (w / (img.naturalWidth || 1));
        size.innerText =
          `${img.naturalWidth} x ${img.naturalHeight}` +
          ` (${zoom.toFixed(0)}%)`;
      };
      toolbar.appendChild(size);

      UfsGlobal.DOM.enableDragAndZoom(img, overlay, (data) => {
        if (data?.type === "scale") {
          if (img.naturalWidth && img.naturalHeight) {
            let scale = img.clientWidth / img.naturalWidth;
            size.innerText =
              size.innerText.replace(/ \(\d+%\)/, "") +
              ` (${(scale * 100).toFixed(0)}%)`;
          }
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
      toggleBg.ufs_title = "Change background";
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
      flipH.innerText = "↔";
      flipH.ufs_title = "Flip horizontally";
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
      flipV.innerText = "↕";
      flipV.ufs_title = "Flip vertically";
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
      rotateLeft.ufs_title = "Rotate left";
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
      rotateRight.ufs_title = "Rotate right";
      rotateRight.onclick = () => {
        img.style.transform = img.style.transform.replace(
          `rotate(${transformStatus.rotate}deg)`,
          ""
        );
        transformStatus.rotate = transformStatus.rotate + 90;
        img.style.transform += ` rotate(${transformStatus.rotate}deg)`;
      };
      toolbar.appendChild(rotateRight);

      // open in new tab
      let openNewTab = document.createElement("div");
      openNewTab.classList.add("ufs-btn");
      openNewTab.innerText = "↗";
      openNewTab.ufs_title = "Open in new tab";
      openNewTab.onclick = () => {
        window.open(src, "_blank");
      };
      toolbar.appendChild(openNewTab);

      // desc
      let desc = document.createElement("div");
      desc.classList.add("ufs-desc");
      desc.textContent = "";
      toolbar.appendChild(desc);
      toolbar.onmousemove = (e) => {
        if (e.target?.ufs_title && e.target?.ufs_title != desc.textContent) {
          desc.textContent = e.target.ufs_title;
        }
      };
      toolbar.appendChild(desc);

      // auto get largest image
      let removeTempLoading,
        loaded = false;
      setTimeout(() => {
        if (!loaded)
          removeTempLoading = UfsGlobal.DOM.addLoadingAnimation(overlay, 40);

        let interval = setInterval(() => {
          if (loaded) {
            removeTempLoading?.();
            clearInterval(interval);
          }
        }, 100);
      }, 300);

      UfsGlobal.Utils.getLargestImageSrc(src, location.href).then((_src) => {
        if (!_src || _src == src) {
          loaded = true;
          return;
        }

        let temp = new Image();
        temp.src = _src;
        temp.onload = () => {
          let curSize = { w: img.naturalWidth, h: img.naturalHeight };
          let newSize = { w: temp.naturalWidth, h: temp.naturalHeight };

          if (curSize.w == newSize.w && curSize.h == newSize.h) {
            loaded = true;
            return;
          }

          UfsGlobal.DOM.notify({
            msg: `Found bigger image: ${curSize.w}x${curSize.h} -> ${newSize.w}x${newSize.h}`,
            duration: 5000,
          });

          img.src = _src;
          loaded = true;
        };
        temp.onerror = () => {
          loaded = true;
        };
      });
    }

    // #endregion

    // #region listen background script

    window.addEventListener("message", (e) => {
      let data = e.data?.data;
      if (data?.menuItemId === "ufs-magnify-image") {
        console.log("magnify image window message", e);
        createPreview(
          data?.srcUrl,
          window.innerWidth / 2,
          window.innerHeight / 2
        );
      }
    });

    // #endregion

    // #region main

    async function magnifyImage(x, y) {
      let ctrlMouse = { x, y };
      let { remove } = UfsGlobal.DOM.addLoadingAnimationAtPos(
        ctrlMouse.x,
        ctrlMouse.y,
        40,
        "",
        `background: #eee9;`
      );
      let imgs = await getImagesAtMouse();
      remove();

      if (!imgs.length) {
        UfsGlobal.DOM.notify({
          msg: "Useful-script: No image found",
          x: ctrlMouse.x,
          y: ctrlMouse.y,
          align: "left",
        });
      } else if (imgs.length === 1) {
        console.log(imgs);
        let src = imgs[0].src;
        createPreview(src, ctrlMouse.x, ctrlMouse.y);
      } else {
        chooseImg(
          imgs.map((img) => img.src),
          ctrlMouse.x,
          ctrlMouse.y
        );
      }
    }

    window.ufs_magnify_image_createPreview = createPreview;
    window.ufs_magnify_image_magnifyImage = magnifyImage;

    let unsub = UfsGlobal.DOM.onDoublePress("Control", () => {
      magnifyImage(mouse.x, mouse.y);
    });
    // #endregion
  },
};
