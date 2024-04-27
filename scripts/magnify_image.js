export default {
  icon: '<i class="fa-solid fa-expand fa-lg"></i>',
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

  changeLogs: {
    1.66: {
      "2024-04-26": "init",
    },
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
    overlay.classList.add("ufs-click-to-magnify-overlay");
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

    const BgState = {
      none: "none",
      transparent: "transparent",
      dark: "dark",
      light: "light",
    };

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
          return UfsGlobal.Utils.getLargestSrcset(ele.srcset);
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
        () => {
          if (/image/i.test(ele.tagName)) {
            return ele.getAttribute("href"); // reddit
          }
          if (/svg/i.test(ele.tagName)) {
            return [
              UfsGlobal.Utils.svgToBase64(ele),
              UfsGlobal.Utils.svgToBlobUrl(ele),
            ];
          }
          if (/canvas/i.test(ele.tagName)) {
            return ele.toDataURL();
          }
        },
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

      let sourceEles = [];
      eles = eles.reverse().filter((ele) => {
        let rect = ele.getBoundingClientRect();
        let isAtMouse =
          rect.left <= mouse.x &&
          rect.right >= mouse.x &&
          rect.top <= mouse.y &&
          rect.bottom >= mouse.y;
        if (isAtMouse && /picture|img/i.test(ele.tagName)) {
          let sources = Array.from(ele.querySelectorAll("source"));
          if (sources?.length) sourceEles = sourceEles.concat(sources);
        }
        return isAtMouse;
      });
      eles = eles.concat(sourceEles);
      eles = eles.concat(
        eles
          .slice(0, 4)
          .map((ele) => getAllChildElements(ele))
          .flat()
      );

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
    function resizeToFitWithMinSize(curW, curH, maxW, maxH, minSize) {
      // Calculate the aspect ratio of the rectangle
      const aspectRatio = curW / curH;

      // Calculate the new width and height to fit inside the window while maintaining aspect ratio
      let newWidth = maxW;
      let newHeight = maxW / aspectRatio;

      // If the new height exceeds the window height, resize based on height
      if (newHeight > maxH) {
        newHeight = maxH;
        newWidth = maxH * aspectRatio;
      }
      if (newWidth > maxW) {
        newWidth = maxW;
        newHeight = maxW / aspectRatio;
      }

      // Apply minimum size constraints
      if (newWidth < minSize) {
        newWidth = minSize;
        newHeight = minSize / aspectRatio;
      }
      if (newHeight < minSize) {
        newHeight = minSize;
        newWidth = minSize * aspectRatio;
      }

      // Return the new dimensions
      return {
        width: newWidth,
        height: newHeight,
      };
    }

    function chooseImg(srcs, x = mouse.x, y = mouse.y) {
      let id = "ufs-magnify-choose-image";
      let exist = document.getElementById(id);
      if (exist) exist.remove();

      // container
      let overlay = document.createElement("div");
      overlay.id = id;
      overlay.style.cssText = `
        top: ${y}px;
        left: ${x}px;
      `;
      overlay.onclick = (e) => {
        e.preventDefault();
        if (e.target == overlay || e.target == container) {
          overlay.remove();
        }
      };
      document.body.appendChild(overlay);

      // toolbar
      let toolbar = document.createElement("div");
      toolbar.classList.add("ufs-toolbar");
      overlay.appendChild(toolbar);

      // toggle background

      let bgStates = [BgState.none, BgState.dark, BgState.light];
      let curBgState =
        (Number(localStorage.getItem("ufs-magnify-image-bg-choose-image")) ||
          0) - 1;

      let toggleBg = document.createElement("div");
      toggleBg.classList.add("ufs-btn");
      toggleBg.innerText = "B";
      toggleBg.ufs_title = "Change background";
      toggleBg.onclick = () => {
        curBgState = (curBgState + 1) % bgStates.length;
        overlay.style.background = "";

        switch (bgStates[curBgState]) {
          case BgState.none:
            overlay.style.background = "#000b";
            break;
          case BgState.dark:
            overlay.style.background = "rgba(30, 30, 30, 1)";
            break;
          case BgState.light:
            overlay.style.background = "rgba(240, 240, 240, 1)";
            break;
        }

        toggleBg.innerText = "BG " + bgStates[curBgState];
        localStorage.setItem("ufs-magnify-image-bg-choose-image", curBgState);
      };
      toggleBg.click(); // default is toggle ON
      toolbar.appendChild(toggleBg);

      // desc
      let desc = document.createElement("div");
      desc.classList.add("ufs-desc");
      desc.innerText = "Choose image";
      toolbar.appendChild(desc);

      toolbar.addEventListener("mousemove", (e) => {
        if (
          e.target != toolbar &&
          e.target?.ufs_title &&
          e.target?.ufs_title != desc.textContent
        ) {
          desc.textContent = e.target.ufs_title;
          let x =
            e.target.offsetLeft +
            e.target.offsetWidth / 2 -
            desc.offsetWidth / 2;
          desc.style.cssText = `left: ${x}px`;
        }
      });

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
      container.classList.add("ufs-img-container");

      for (let src of srcs) {
        let con = document.createElement("div");
        con.classList.add("ufs-con");
        container.appendChild(con);

        // size
        let size = document.createElement("div");
        size.classList.add("ufs-size");
        con.appendChild(size);

        // img
        let img = document.createElement("img");
        img.src = src;
        img.onload = () => {
          size.innerText = `${img.naturalWidth} x ${img.naturalHeight}`;
        };
        img.onclick = () => {
          // overlay.remove();
          createPreview(
            src,
            mouse.x,
            mouse.y,
            // onClose
            () => {},
            // onFoundBigImg
            (_src) => {
              img.src = _src;
            }
          );
        };
        con.appendChild(img);
      }
      overlay.appendChild(container);
    }

    function createPreview(
      src,
      x = mouse.x,
      y = mouse.y,
      onClose = () => {},
      onFoundBigImg = () => {}
    ) {
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
          overlay = null;
          onClose?.();
        }
      };
      document.body.appendChild(overlay);

      // animation div: a rect that represent image scaled up from original position (mouse position)
      let animDiv = document.createElement("div");
      animDiv.classList.add("ufs-img-anim");
      animDiv.style.cssText = `
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

        // first load - original image
        if (!isFirstLoad) {
          isFirstLoad = true;

          let newSize = resizeToFitWithMinSize(
            curW,
            curH,
            Math.max(window.innerWidth - 100, 400),
            Math.max(window.innerHeight - 100, 400),
            100
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

        updateSize();
        updateZoom();
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
      let sizeEle = document.createElement("div");
      sizeEle.classList.add("ufs-btn");
      sizeEle.innerText = "Size";
      sizeEle.ufs_title = "Original size";

      function updateSize() {
        if (img.naturalWidth && img.naturalHeight) {
          let resolution = UfsGlobal.Utils.getResolutionCategory(
            img.naturalWidth,
            img.naturalHeight
          );
          sizeEle.innerText =
            `${img.naturalWidth} x ${img.naturalHeight}` +
            (resolution ? ` ~ ${resolution}` : "");
        }
      }

      // zoom
      let zoomEle = document.createElement("div");
      zoomEle.classList.add("ufs-btn");
      zoomEle.innerText = "Z";
      zoomEle.ufs_title = "Toggle original size";
      zoomEle.onclick = () => {
        let w = img.naturalWidth,
          h = img.naturalHeight;

        if (
          parseInt(img.style.width) === w &&
          parseInt(img.style.height) === h
        ) {
          let newSize = resizeToFitWithMinSize(
            w,
            h,
            Math.max(window.innerWidth - 100, 400),
            Math.max(window.innerHeight - 100, 400),
            100
          );
          w = newSize.width;
          h = newSize.height;
        }

        img.style.width = w + "px";
        img.style.height = h + "px";
        img.style.left = window.innerWidth / 2 + "px";
        img.style.top = window.innerHeight / 2 + "px";

        updateZoom();
      };
      function updateZoom() {
        if (img.naturalWidth && img.naturalHeight) {
          let zoom = (img.clientWidth / img.naturalWidth).toFixed(1);
          if (parseInt(zoom) == zoom) zoom = parseInt(zoom);
          zoomEle.innerText = `${zoom}x`;
        }
      }

      // toggle background
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
      toggleBg.ufs_title = "Change image background";
      toggleBg.onclick = () => {
        curBgState = (curBgState + 1) % bgStates.length;
        img.style.background = "";

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

      // open in new tab
      let openNewTab = document.createElement("div");
      openNewTab.classList.add("ufs-btn");
      openNewTab.innerText = "↗";
      openNewTab.ufs_title = "Open in new tab";
      openNewTab.onclick = () => {
        if (/^data:image\/svg/.test(img.src)) {
          const url = UfsGlobal.Utils.svgBase64ToUrl(img.src);
          window.open(url, "_blank");
        } else {
          window.open(img.src, "_blank");
        }
      };

      // download
      let download = document.createElement("div");
      download.classList.add("ufs-btn");
      download.innerText = "⤓";
      download.ufs_title = "Download";
      download.onclick = () => {
        UfsGlobal.Extension.download({ url: img.src });
      };

      // desc
      let desc = document.createElement("div");
      desc.classList.add("ufs-desc");
      desc.textContent = "";
      toolbar.appendChild(desc);
      toolbar.onmousemove = (e) => {
        if (
          e.target != toolbar &&
          e.target?.ufs_title &&
          e.target?.ufs_title != desc.textContent
        ) {
          desc.textContent = e.target.ufs_title;
          let x =
            e.target.offsetLeft +
            e.target.offsetWidth / 2 -
            desc.offsetWidth / 2;
          desc.style.cssText = `left: ${x}px`;
        }
      };

      toolbar.appendChild(sizeEle);
      toolbar.appendChild(zoomEle);
      toolbar.appendChild(toggleBg);
      toolbar.appendChild(flipH);
      toolbar.appendChild(flipV);
      toolbar.appendChild(rotateLeft);
      toolbar.appendChild(rotateRight);
      toolbar.appendChild(openNewTab);
      toolbar.appendChild(download);
      toolbar.appendChild(desc);

      UfsGlobal.DOM.enableDragAndZoom(img, overlay, (data) => {
        if (data?.type === "scale") {
          updateZoom();
        }
      });

      // auto get largest image
      let loadingRef,
        notiRef = UfsGlobal.DOM.notify({
          msg: `Finding big image...`,
          duration: 99999,
        }),
        loaded = false;
      setTimeout(() => {
        if (!loaded) {
          loadingRef = UfsGlobal.DOM.addLoadingAnimationAtPos(
            window.innerWidth / 2,
            window.innerHeight - 130
          );
        }

        let interval = setInterval(() => {
          if (loaded || !overlay) {
            loadingRef?.();
            notiRef?.closeAfter?.(!overlay ? 0 : 3000);
            clearInterval(interval);
          }
        }, 100);
      }, 300); // show loading after 300ms

      UfsGlobal.Utils.getLargestImageSrc(src, location.href).then((_src) => {
        if (!_src || _src == src) {
          loaded = true;
          UfsGlobal.DOM.notify({
            msg: `Big image not found`,
            duration: 3000,
          });
          return;
        }

        notiRef.setText(`Found big image. Loading...`);

        let temp = new Image();
        temp.src = _src;
        temp.onload = () => {
          loaded = true;
          notiRef.closeAfter(3000);

          let curSize = { w: img.naturalWidth, h: img.naturalHeight };
          let newSize = { w: temp.naturalWidth, h: temp.naturalHeight };
          img.src = _src;
          onFoundBigImg(_src);
          if (curSize.w == newSize.w && curSize.h == newSize.h) {
            notiRef.setText("Load success: Same size");
            return;
          }
          notiRef.setText(
            `Load success: ${curSize.w}x${curSize.h} -> ${newSize.w}x${newSize.h}`
          );
        };
        temp.onerror = (e) => {
          loaded = true;
          notiRef.setText(`Load failed`);
        };
      });
    }

    // #endregion

    // #region main

    function magnifyImage(x, y) {
      let ctrlMouse = { x, y };
      let removeLoading,
        loaded = false;

      setTimeout(() => {
        if (!loaded)
          removeLoading = UfsGlobal.DOM.addLoadingAnimationAtPos(
            ctrlMouse.x,
            ctrlMouse.y,
            40,
            "",
            `background: #eee9;`
          );
      }, 100);

      getImagesAtMouse().then((imgs) => {
        loaded = true;
        removeLoading?.();

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
      });
    }

    // expose for background script to call
    window.ufs_magnify_image_createPreview = createPreview;
    window.ufs_magnify_image_magnifyImage = magnifyImage;

    // TODO: we dont need this anymore
    // window.addEventListener("message", (e) => {
    //   let data = e.data?.data;
    //   if (data?.menuItemId === "ufs-magnify-image") {
    //     console.log("magnify image window message", e);
    //     createPreview(
    //       data?.srcUrl,
    //       window.innerWidth / 2,
    //       window.innerHeight / 2
    //     );
    //   }
    // });

    // inject css
    UfsGlobal.Extension.getURL("/scripts/magnify_image.css").then((url) => {
      UfsGlobal.DOM.injectCssFile(url);
    });

    let unsub = UfsGlobal.DOM.onDoublePress("Control", () => {
      UfsGlobal.Extension.trackEvent("magnify-image-CTRL");
      magnifyImage(mouse.x, mouse.y);
    });
    // #endregion
  },
};
