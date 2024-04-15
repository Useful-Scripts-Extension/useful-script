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
    // #region get image at mouse
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
      const rect = UfsGlobal.DOM.getContentClientRect(element);
      return (
        mouse.x > rect.left &&
        mouse.x < rect.right &&
        mouse.y > rect.top &&
        mouse.y < rect.bottom
      );
    }
    function smallImageFirst(a, b) {
      let aRect = UfsGlobal.DOM.getContentClientRect(a);
      let bRect = UfsGlobal.DOM.getContentClientRect(b);
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
      // if (element.tagName.toLowerCase() === "a") {
      //   const href = element.href;
      //   if (isImageURL(href)) {
      //     return href;
      //   }
      // }
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
    //#endregion

    // #region NEW get image at mouse

    const lazyImgAttr = [
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
    var tprules = [
      function (a) {
        if (this.currentSrc && !this.src) this.src = this.currentSrc;
        var oldsrc = this.src;
        var newsrc = null;

        if (this.getAttribute("_src") && !this.src) {
          newsrc = this.getAttribute("_src");
        } else {
          for (let i in lazyImgAttr) {
            let attrName = lazyImgAttr[i];
            let attrValue = this.getAttribute(attrName);
            if (/\bimagecover\.\w+$/i.test(attrValue)) continue;
            if (attrValue) {
              newsrc = attrValue;
              break;
            }
          }
        }
        if (!newsrc && this._lazyrias && this._lazyrias.srcset) {
          newsrc = this._lazyrias.srcset[this._lazyrias.srcset.length - 1];
        }
        if (newsrc) {
        } else if (this.srcset) {
          var srcs = this.srcset.split(/[xw],/i),
            largeSize = -1;
          srcs.forEach((srci) => {
            let srcInfo = srci.trim().split(" "),
              curSize = parseInt(srcInfo[1] || 0);
            if ((srcInfo[1] || !oldsrc) && curSize > largeSize) {
              largeSize = curSize;
              newsrc = srcInfo[0];
            }
          });
        }

        return oldsrc != newsrc ? newsrc : null;
      },
    ];
    function getElementByXpath(xpath, contextNode, doc) {
      doc = doc || document;
      contextNode = contextNode || doc;
      return doc.evaluate(xpath, contextNode, null, 9, null).singleNodeValue;
    }
    function isXPath(xpath) {
      return (
        xpath.startsWith("./") ||
        xpath.startsWith("//") ||
        xpath.startsWith("id(")
      );
    }
    function getElementMix(selector, contextNode, doc) {
      var ret;
      if (!selector || !contextNode) return ret;
      doc = doc || document;

      var type = typeof selector;
      if (type == "string") {
        if (isXPath(selector)) {
          ret = getElementByXpath(selector, contextNode, doc);
        } else {
          ret = contextNode.parentNode.querySelector(selector);
        }
      } else if (type == "function") {
        ret = selector(contextNode, doc);
      }
      return ret;
    }
    function throwErrorInfo(err) {
      if (console && console.error) {
        console.error(
          err.message +
            "\n\n" +
            (err.stacktrace ? err.stacktrace : "") +
            "\n\n",
          err
        );
      }
    }

    function findPic(img) {
      let imgPN = img, // image's parent node
        imgPE = [], // all image's parent elements
        imgPA; // image's parent anchor

      // find closest parent anchor
      while ((imgPN = imgPN.parentElement)) {
        if (imgPN.nodeName.toUpperCase() == "A") {
          imgPA = imgPN;
          break;
        }
      }

      // find all image's parent elements
      imgPN = img;
      while ((imgPN = imgPN.parentElement)) {
        if (imgPN.nodeName.toUpperCase() == "BODY") {
          break;
        } else {
          imgPE.push(imgPN);
        }
      }

      let iPASrc = imgPA ? imgPA.href : "";
      //base64 Strings that are too long cause regular matching to freeze the browser
      let base64Img = /^data:/i.test(img.src);
      let src,
        srcs,
        type,
        noActual = false, // no original image
        imgSrc = img.src || img.currentSrc || img.dataset.lazySrc, // src of img node
        xhr,
        description; // Annotations for pictures
      let imgCStyle = window.getComputedStyle(img);
      if (
        !/IMG/i.test(img.nodeName) &&
        imgCStyle &&
        imgCStyle.backgroundImage &&
        imgCStyle.backgroundImage != "none"
      ) {
        let sh = imgCStyle.height,
          sw = imgCStyle.width;
        if (!img.offsetWidth) sw = 10;
        if (!img.offsetHeight) sh = 10;
        if (imgCStyle.backgroundRepeatX == "repeat") {
          sw = 10;
        }
        if (imgCStyle.backgroundRepeatY == "repeat") {
          sh = 10;
        }
        imgCStyle = { height: sh, width: sw };
      }

      // image current size
      let imgCS = {
        h: parseFloat(imgCStyle.height) || img.height || img.offsetHeight,
        w: parseFloat(imgCStyle.width) || img.width || img.offsetWidth,
      };

      // image actual size
      let imgAS = {
        h: img.naturalHeight || imgCS.h,
        w: img.naturalWidth || imgCS.w,
      };

      if (!src && matchedRule.rules.length > 0) {
        // Obtained through advanced rules.
        // exclude
        try {
          let newSrc = matchedRule.getImage(img, imgPA, imgPE);
          if (newSrc && imgSrc != newSrc) src = newSrc;
        } catch (err) {
          throwErrorInfo(err);
        }

        if (src) {
          if (Array.isArray(src)) {
            srcs = src;
            src = srcs.shift();
          }

          type = "rule";
          xhr = matchedRule.xhr;

          if (matchedRule.lazyAttr) {
            // Due to lazy loading technology, the image may be loading.gif
            imgSrc = img.getAttribute(matchedRule.lazyAttr) || img.src;
          }

          if (matchedRule.description) {
            let node = getElementMix(matchedRule.description, img);
            if (node) {
              description = node.getAttribute("title") || node.textContent;
            }
          }
        }
      }

      if (!src && !base64Img) {
        //Traverse wildcard rules
        tprules.find(function (rule, index, array) {
          try {
            src = rule.call(img, imgPA);
            if (src) {
              return true;
            }
          } catch (err) {
            throwErrorInfo(err);
          }
        });
        if (src) type = "tpRule";
      }

      if (/^IMG$/i.test(img.nodeName) && !src && iPASrc) {
        // The link may be an image...
        if (
          iPASrc != img.src &&
          /\.(jpg|jpeg|png|gif|bmp)(\?[^\?]*)?$/i.test(iPASrc)
        ) {
          src = iPASrc;
        }
        if (src) type = "scale";
      }

      if (!src || src == imgSrc) {
        // Whether this image is scaled.
        noActual = true;
        if (!(imgAS.w == imgCS.w && imgAS.h == imgCS.h)) {
          // If they are not exactly equal, they are scaled.
          src = imgSrc;
          type = "scale";
          if (
            imgAS.h < prefs.gallery.scaleSmallSize &&
            imgAS.w < prefs.gallery.scaleSmallSize
          ) {
            type = "scaleSmall";
          }
        } else {
          src = imgSrc;
          type = "force";
        }
      }

      if (!src) return;

      let ret = {
        src: src, // Get src
        srcs: srcs, // Multiple src, if it fails, the next one will be tried.
        type: type,
        imgSrc: imgSrc, // The src of the processed image
        iPASrc: iPASrc, // The link address of the first parent a element of the image
        sizeH: imgAS.h,
        sizeW: imgAS.w,
        imgCS: imgCS,
        imgAS: imgAS,

        noActual: noActual,
        xhr: xhr,
        description: description || "",

        img: img, // Processed pictures
        imgPA: imgPA, // The first parent a element of the image
      };
      return ret;
    }

    // #endregion

    // #region create UI
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
      let preSize = null;
      img.onload = () => {
        let w = img.naturalWidth,
          h = img.naturalHeight;

        size.innerText = `${w} x ${h}`;

        // first load - original image
        if (!preSize) {
          // constrain to screen size
          let screenW = window.innerWidth;
          let screenH = window.innerHeight;

          let minSize = 400;
          if (w < minSize) {
            h = h * (minSize / w);
            w = minSize;
          }
          if (h < minSize) {
            w = w * (minSize / h);
            h = minSize;
          }
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
        }

        // second+ load -> usually largest image
        else {
          img.style.width = `${preSize.w}px`;
          img.style.height = `${preSize.h}px`;
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
          preSize = {
            w: img.style.width,
            h: img.style.height,
          };
          img.src = src;
        },
      };
    }

    let unsub = UfsGlobal.DOM.onDoublePress("Control", async () => {
      const srcs = extractImagesFromSelector("img, image, a, [class], [style]");

      console.log(srcs);
      let src = srcs?.[0];

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
