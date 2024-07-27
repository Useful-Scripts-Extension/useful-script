import { getLargestImageSrc } from "./auto_redirectLargestImageSrc.js";
import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

const contextMenuId = "magnify-image";

const CACHED = {
  mouse: { x: 0, y: 0 },
  configSize: null,
};

const MagnifySizeKey = "ufs_magnify_image_size";
const getConfigSize = async () => {
  if (!CACHED.configSize) {
    const { Storage } = await import("./helpers/utils.js");
    const data = await Storage.get(MagnifySizeKey);
    CACHED.configSize = data?.split("x") || [20, 20];
  }
  return CACHED.configSize;
};
const setConfigSize = async (width, height) => {
  const { Storage } = await import("./helpers/utils.js");
  CACHED.configSize = [width, height];
  return Storage.set(MagnifySizeKey, width + "x" + height);
};

export default {
  icon: '<i class="fa-solid fa-expand fa-lg fa-bounce"></i>',
  name: {
    en: "Magnify any Image",
    vi: "Phóng to mọi hình ảnh",
  },
  description: {
    en: `View any images in magnified window<br/>
    Where you are able to zoom in/out, rotate, drag, and more.<br/>
    Auto find large version of image to show.
    <br/></br>
    <p style="color:yellow">4 ways to use:</p>
    Using now:
    <ol>
      <li>Right click in website > click magnify image</li>
      <li>Left click this feature then click image</li>
    </ol>
    After turn-on auto-run:
    <ol>
      <li>Hover on any image/video > click magnify button</li>
      <li>Double Ctrl on any image</li>
    </ol>
    `,
    vi: `Xem bất kỳ hình ảnh nào trong cửa sổ phóng đại<br/>
    Nơi bạn có thể phóng to/thu nhỏ, xoay, kéo thả, ...<br/>
    Tự động tìm ảnh chất lượng cao để hiển thị.
    <br/></br>
    <p style="color:yellow">4 cách sử dụng:</p>
    Dùng ngay:
    <ol>
      <li>Chuột phải vào ảnh/trang web > chọn magnify image</li>
      <li>Click chức năng rồi click chọn ảnh</li>
    </ol>
    Cần mở tự chạy:
    <ol>
      <li>Đưa chuột vào ảnh/video > bấm nút phóng to</li>
      <li>Ctrl 2 lần vào ảnh</li>
    </ol>`,
    img: "",
  },
  badges: [BADGES.hot],
  changeLogs: {
    "2024-04-10": "init",
    "2024-04-27": "remove error img in gallery",
    "2024-05-21": "not require autorun",
    "2024-06-07":
      "support video frame + right click anywhere + magnify on hover + search by images",
    "2024-07-28": "config img size for hover",
  },
  buttons: [
    {
      icon: '<i class="fa-solid fa-gear"></i>',
      name: {
        vi: "Cài đặt",
        en: "Setting",
      },
      onClick: async () => {
        const { t } = await import("../popup/helpers/lang.js");
        const [width, height] = await getConfigSize();

        const result = await Swal.fire({
          title: t({ vi: "Cài đặt phóng to", en: "Magnify Setting" }),
          html: `
            <p>${t({
              vi: "Chỉ hiện nút phóng to cho hình ảnh có kích thước lớn hơn:",
              en: "Only show the magnify button when the image's size is larger than:",
            })}</p>
            <input
              style="display: inline-block;width: 40%"
              type="number"
              id="swal-input1"
              class="swal2-input"
              value="${width}"
              placeholder="${t({ vi: "Rộng", en: "Width" })}">X
            <input
              style="display: inline-block;width: 40%"
              type="number"
              id="swal-input2"
              class="swal2-input"
              value="${height}"
              placeholder="${t({ vi: "Cao", en: "Height" })}">
          `,
          preConfirm: () => {
            return [
              document.getElementById("swal-input1").value,
              document.getElementById("swal-input2").value,
            ];
          },
        });

        if (result.isConfirmed) {
          const [width, height] = result.value;
          await setConfigSize(width, height);
          Swal.fire({
            icon: "success",
            title: t({ vi: "Thành công", en: "Success" }),
            text: t({
              vi: "Cài đặt phóng to đã được cập nhật.",
              en: "Magnify setting has been updated.",
            }),
          });
        }
      },
    },
  ],

  popupScript: {
    onClick: () => {
      window.close(); // close extension popup
    },
  },

  contentScript: {
    onClick: async () => {
      const { remove: removeNoti, setPosition } = UfsGlobal.DOM.notify({
        msg: "Useful-script: Click any image to magnify",
        duration: 99999,
        styleText: `
        transition: none !important;
        pointer-events: none !important;
      `,
      });

      injectCss();
      let overlay = document.createElement("div");
      overlay.classList.add("ufs-click-to-magnify-overlay");
      overlay.addEventListener("mousemove", (e) => {
        setPosition(e.clientX, e.clientY + 20);
      });
      document.body.appendChild(overlay);

      function clickToMagnify(e) {
        overlay.remove();
        removeNoti();
        try {
          magnifyImage(e.clientX, e.clientY);
        } catch (e) {
          console.log(e);
        }
      }
      overlay.addEventListener("click", clickToMagnify);
    },

    // expose for background script to call
    _createPreview: (details) => {
      injectCss();
      if (details?.srcUrl) {
        createPreview(details?.srcUrl);
      } else {
        magnifyImage();
      }
    },

    onDocumentStart_: async () => {
      window.addEventListener("mousemove", (e) => {
        CACHED.mouse.x = e.clientX;
        CACHED.mouse.y = e.clientY;
      });

      injectCss();

      let hovering = null;
      let div = document.createElement("div");
      div.id = "ufs-magnify-image-hover-div";
      div.title = "Useful-script: Click to magnify";
      div.addEventListener("click", () => {
        if (hovering) {
          window.top.postMessage(
            {
              type: "ufs-magnify-image-hover",
              data: {
                srcs: hovering?.srcs,
                x: hovering?.rect?.left,
                y: hovering?.rect?.top,
              },
            },
            "*"
          );
        }
      });

      function addToDom() {
        (document.body || document.documentElement).appendChild(div);
      }
      addToDom();
      UfsGlobal.DOM.onElementRemoved(div, addToDom);

      window.addEventListener("mouseover", async (e) => {
        const [width, height] = await getConfigSize();
        if (e.target.clientWidth < width || e.target.clientHeight < height)
          return;

        let srcs = getImgSrcsFromElement(e.target);
        if (!srcs?.length) {
          div.classList.toggle("hide", e.target !== div);
          return;
        }

        let rect = getContentClientRect(e.target);
        if (rect.width < 30 || rect.height < 30) {
          rect.top -= rect.width / 2;
          rect.left -= rect.height / 2;
        }
        rect.left = Math.max(rect.left, 0);
        rect.top = Math.max(rect.top, 0);

        hovering = { srcs, rect, target: e.target };
        div.style.left = rect.left + "px";
        div.style.top = rect.top + "px";
        div.classList.toggle("hide", false);
      });

      // only main frame
      if (window === window.top) {
        // ctrl
        let unsub = onDoublePress("Control", () => {
          UfsGlobal.Extension.trackEvent("magnify-image-CTRL");
          let mouse = getMousePos();
          magnifyImage(mouse.x, mouse.y);
        });

        // hover
        window.addEventListener("message", (e) => {
          const { data, type } = e.data || {};
          if (type === "ufs-magnify-image-hover") {
            let srcs = data?.srcs;
            if (srcs?.length)
              UfsGlobal.Extension.trackEvent("magnify-image-HOVER");

            if (srcs?.length > 1) chooseImg(srcs);
            else if (srcs?.length === 1) createPreview(srcs[0]);
          }
        });
      }
    },
  },

  backgroundScript: {
    runtime: {
      onInstalled: () => {
        chrome.contextMenus.create({
          title: "Magnify image",
          // contexts: ["image", "video"],
          contexts: ["all"],
          id: contextMenuId,
          parentId: "root",
        });
      },
    },
    contextMenus: {
      onClicked: ({ info, tab }, context) => {
        if (info.menuItemId == contextMenuId) {
          context.utils.runScriptInTabWithEventChain({
            target: {
              tabId: tab.id,
              frameIds: [0],
            },
            scriptIds: ["magnify_image"],
            eventChain: "contentScript._createPreview",
            details: info,
            world: "ISOLATED",
          });
        }
      },
    },
  },
};

const defaultSearchData = `Google lens | https://lens.google.com/uploadbyurl?url=#t#
Google image | https://www.google.com/searchbyimage?safe=off&sbisrc=1&image_url=#t#
Yandex | https://yandex.com/images/search?source=collections&rpt=imageview&url=#t#
SauceNAO | https://saucenao.com/search.php?db=999&url=#t#
IQDB | https://iqdb.org/?url=#t#
3D IQDB | https://3d.iqdb.org/?url=#t#
Baidu | https://graph.baidu.com/details?isfromtusoupc=1&tn=pc&carousel=0&promotion_name=pc_image_shituindex&extUiData%5bisLogoShow%5d=1&image=#t#
Bing | https://www.bing.com/images/search?view=detailv2&iss=sbi&form=SBIVSP&sbisrc=UrlPaste&q=imgurl:#t#
TinEye | https://www.tineye.com/search?url=#t#
Sogou | https://pic.sogou.com/ris?query=#t#
360 | http://st.so.com/stu?imgurl=#t#
WhatAnime | https://trace.moe/?url=#t#
Ascii2D | https://ascii2d.net/search/url/#t#
Trace Moe | https://trace.moe/?url=#t#
KarmaDecay | http://karmadecay.com/#t#
QRCode decode | https://zxing.org/w/decode?full=true&u=#t#
QRCode | https://hoothin.com/qrcode/##t#
ImgOps | https://imgops.com/#b#`;

function injectCss(
  path = "/scripts/magnify_image.css",
  id = "ufs-magnify-image-css"
) {
  if (!document.querySelector("#" + id)) {
    UfsGlobal.Extension.getURL(path).then((url) => {
      UfsGlobal.DOM.injectCssFile(url, id);
    });
  }
}
function getMousePos() {
  return CACHED.mouse;
}

function validateMouse(x, y) {
  if (x == null || y == null) {
    let mouse = getMousePos();
    return {
      x: mouse.x ?? x ?? 0,
      y: mouse.y ?? y ?? 0,
    };
  }
  return { x, y };
}

function magnifyImage(x, y) {
  let mouse = validateMouse(x, y);
  let removeLoading,
    loaded = false;

  setTimeout(() => {
    if (!loaded)
      removeLoading = addLoadingAnimationAtPos(
        mouse.x,
        mouse.y,
        40,
        "",
        `background: #eee9;`
      );
  }, 100);

  getImagesAtPos(x, y).then((imgs) => {
    loaded = true;
    removeLoading?.();

    if (!imgs?.length) {
      UfsGlobal.DOM.notify({
        msg: "Useful-script: No image found",
        x: mouse.x,
        y: mouse.y,
        align: "left",
      });
    } else if (imgs?.length === 1) {
      console.log(imgs);
      let src = imgs[0].src;
      createPreview(src, mouse.x, mouse.y);
    } else {
      chooseImg(
        imgs.map((img) => img.src),
        mouse.x,
        mouse.y
      );
    }
  });
}

// #region get image src at mouse

const BgState = {
  none: "none",
  transparent: "transparent",
  dark: "dark",
  light: "light",
};

function relativeUrlToAbsolute(url) {
  try {
    return new URL(url).href;
  } catch (e) {
    return url;
  }
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
        let urls = bgUrls.map((url) => url.match(/url\((['"]?)(.*?)\1\)/)?.[2]);
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
      let srcset = ele.srcset || ele.getAttribute("srcset");
      if (!srcset) {
        // child srcset
        let childs = ele.children;
        if (childs?.length) {
          for (let i = 0; i < childs.length; i++) {
            let _ = childs[i].srcset;
            if (_) srcset += _ + ", ";
          }
        }
      }
      if (!srcset) return;
      return getLargestSrcset(srcset);
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
        return [svgToBase64(ele), svgToBlobUrl(ele)];
      }
      if (/canvas/i.test(ele.tagName)) {
        return ele.toDataURL();
      }
      if (/video/i.test(ele.tagName)) {
        // get current capture frame
        let canvas = document.createElement("canvas");
        canvas.width = ele.videoWidth;
        canvas.height = ele.videoHeight;
        canvas.getContext("2d").drawImage(ele, 0, 0);
        let dataURL = canvas.toDataURL();
        canvas.remove();
        return dataURL;
      }
    },
  ];

  let results = [];
  for (let f of fn) {
    try {
      let srcs = f();
      if (srcs && srcs?.length) {
        if (!Array.isArray(srcs)) srcs = [srcs];
        results = results.concat(srcs.map((src) => relativeUrlToAbsolute(src)));
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

function getLargestSrcset(srcset) {
  let srcs = srcset.split(/[xw],/i),
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
}

async function getImagesAtPos(x, y) {
  let eles = Array.from(document.querySelectorAll("*"));

  let pos = validateMouse(x, y);
  let sourceEles = [];
  eles = eles.reverse().filter((ele) => {
    let rect = ele.getBoundingClientRect();
    let isAtMouse =
      rect.left <= pos.x &&
      rect.right >= pos.x &&
      rect.top <= pos.y &&
      rect.bottom >= pos.y;
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
    return !/iframe/i.test(ele.tagName);
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

function chooseImg(srcs, _x, _y) {
  let { x, y } = validateMouse(_x, _y);

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
    (Number(localStorage.getItem("ufs-magnify-image-bg-choose-image")) || 0) -
    1;

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
        e.target.offsetLeft + e.target.offsetWidth / 2 - desc.offsetWidth / 2;
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

  let imgs = [];
  for (let i = 0; i < srcs.length; i++) {
    let src = srcs[i];

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
      img.setAttribute("loaded", true);

      // auto create preview and close gallery
      if (imgs.length == 1) {
        img.click();
        overlay.click();
      }
    };
    img.onerror = () => {
      size.remove();
      img.remove();
      imgs.splice(i, 1);

      // auto create preview and close gallery
      if (imgs.length == 1 && imgs[0].getAttribute("loaded")) {
        imgs[0].click();
        overlay.click();
      }
    };
    img.onclick = () => {
      // overlay.remove();
      let mouse = getMousePos();
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
    imgs.push(img);
    con.appendChild(img);
  }
  overlay.appendChild(container);
}

function createPreview(
  src,
  _x,
  _y,
  onClose = () => {},
  onFoundBigImg = () => {}
) {
  const { x, y } = validateMouse(_x, _y);
  const id = "ufs-magnify-image";
  const exist = document.getElementById(id);
  if (exist) exist.remove();

  // container
  let overlay = document.createElement("div");
  overlay.id = id;
  overlay.innerHTML = `
    <div class="ufs-img-anim" style="top: ${y}px; left: ${x}px;"></div>
    <img
      src="${src}"
      style="
        top: ${window.innerHeight / 2}px;
        left: ${window.innerWidth / 2}px;
        transform-origin: center;
        transform: translate(-50%, -50%) !important;
        max-width: 100vw;
        max-height: 100vh;
        opacity: 0;
      "/>
    <div class="ufs-toolbar">
      <div class="ufs-btn" ufs_title="Original size">Size</div>
      <div class="ufs-btn" ufs_title="Toggle original size">Z</div>
      <div class="ufs-btn" ufs_title="Toggle background">B</div>
      <div class="ufs-btn" ufs_title="Flip horizontal">↔</div>
      <div class="ufs-btn" ufs_title="Flip vertical">↕</div>
      <div class="ufs-btn" ufs_title="Rotate left">↺</div>
      <div class="ufs-btn" ufs_title="Rotate right">↻</div>
      <div class="ufs-btn" ufs_title="Open in new tab">↗</div>
      <div class="ufs-btn" ufs_title="Download">⬇️</div>
      <div class="ufs-btn ufs-dropdown-menu" ufs_title="">🔎 Search by image
        <ul>
        ${defaultSearchData
          .split("\n")
          .map((s) => {
            let [title, url] = s.split(" | ");
            return `<li class="ufs-btn" data-url="${url}">${title}</li>`;
          })
          .join("")}
        </ul>
      </div>
      <div class="ufs-desc"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  // animation div: a rect that represent image scaled up from original position (mouse position)
  const animDiv = overlay.querySelector(".ufs-img-anim");
  const img = overlay.querySelector("img");
  const toolbar = overlay.querySelector(".ufs-toolbar");
  const [
    sizeEle,
    zoomEle,
    toggleBg,
    flipH,
    flipV,
    rotateLeft,
    rotateRight,
    openNewTab,
    download,
    search,
  ] = Array.from(toolbar.querySelectorAll(".ufs-btn"));
  const desc = toolbar.querySelector(".ufs-desc");

  function updateSize() {
    if (img.naturalWidth && img.naturalHeight) {
      let resolution = getResolutionCategory(
        img.naturalWidth,
        img.naturalHeight
      );
      sizeEle.innerText =
        `${img.naturalWidth} x ${img.naturalHeight}` +
        (resolution ? ` ~ ${resolution}` : "");
    }
  }

  function updateZoom() {
    if (img.naturalWidth && img.naturalHeight) {
      let zoom = (parseFloat(img.style.width) / img.naturalWidth).toFixed(1);
      if (parseInt(zoom) == zoom) zoom = parseInt(zoom);
      zoomEle.innerText = `${zoom}x`;
    }
  }

  const { destroy, animateTo } = enableDragAndZoom(
    img,
    overlay,
    (updatedValue) => {
      if ("width" in updatedValue || "height" in updatedValue) updateZoom();
    }
  );
  let removeAnimLoading;
  setTimeout(() => {
    removeAnimLoading = addLoadingAnimation(animDiv, 40);
  }, 500);

  // close on click outside
  overlay.addEventListener("click", (e) => {
    if (e.target == overlay) {
      overlay.remove();
      overlay = null;
      destroy();
      onClose?.();
    }
  });

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
  img.onerror = () => {
    UfsGlobal.DOM.notify({ msg: "Failed to load image" });
  };

  zoomEle.onclick = () => {
    let w = img.naturalWidth,
      h = img.naturalHeight;

    if (parseInt(img.style.width) === w && parseInt(img.style.height) === h) {
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

    animateTo(window.innerWidth / 2, window.innerHeight / 2, w, h);

    updateZoom();
  };

  const bgStates = [
    BgState.none,
    BgState.transparent,
    BgState.dark,
    BgState.light,
  ];
  let curBgState =
    (Number(localStorage.getItem("ufs-magnify-image-bg")) || 0) - 1;
  toggleBg.onclick = () => {
    curBgState = (curBgState + 1) % bgStates.length;
    img.style.background = "";

    switch (bgStates[curBgState]) {
      case BgState.none:
        break;
      case BgState.transparent:
        const gradientValue =
          "linear-gradient(45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 255, 255, 0.4) 100%) 0 0 / 20px 20px, linear-gradient(45deg, rgba(255, 255, 255, 0.4) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.4) 75%, rgba(255, 255, 255, 0.4) 100%) 10px 10px / 20px 20px";
        img.style.cssText += "background: " + gradientValue + " !important;";
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
  toggleBg.click(); // click to apply saved value

  const transform = {
    flip_horizontal: false,
    flip_vertical: false,
    rotate: 0,
  };
  flipH.onclick = () => {
    if (transform.flip_horizontal) {
      img.style.transform = img.style.transform.replace("scaleX(-1)", "");
      transform.flip_horizontal = false;
    } else {
      img.style.transform += " scaleX(-1)";
      transform.flip_horizontal = true;
    }
  };
  flipV.onclick = () => {
    if (transform.flip_vertical) {
      img.style.transform = img.style.transform.replace("scaleY(-1)", "");
      transform.flip_vertical = false;
    } else {
      img.style.transform += " scaleY(-1)";
      transform.flip_vertical = true;
    }
  };
  rotateLeft.onclick = () => {
    img.style.transform = img.style.transform.replace(
      `rotate(${transform.rotate}deg)`,
      ""
    );
    transform.rotate = transform.rotate - 90;
    img.style.transform += ` rotate(${transform.rotate}deg)`;
  };
  rotateRight.onclick = () => {
    img.style.transform = img.style.transform.replace(
      `rotate(${transform.rotate}deg)`,
      ""
    );
    transform.rotate = transform.rotate + 90;
    img.style.transform += ` rotate(${transform.rotate}deg)`;
  };
  openNewTab.onclick = () => {
    if (/^data:image\/svg/.test(img.src)) {
      const url = svgBase64ToUrl(img.src);
      window.open(url, "_blank");
    } else {
      window.open(img.src, "_blank");
    }
  };
  search.querySelectorAll("li.ufs-btn").forEach((li) => {
    li.onclick = async (e) => {
      e.preventDefault();
      window.open(
        li
          .getAttribute("data-url")
          .replace("#b#", img.src.replace(/https?:\/\//i, ""))
          .replace("#t#", encodeURIComponent(img.src)),
        "_blank",
        "width=1024, height=768, toolbar=1, menubar=1, titlebar=1"
      );
    };
  });
  download.onclick = () => {
    UfsGlobal.Extension.download({ url: img.src });
  };
  toolbar.onmousemove = (e) => {
    if (
      e.target != toolbar &&
      e.target.attributes.ufs_title &&
      e.target.attributes.ufs_title.textContent != desc.textContent
    ) {
      desc.textContent = e.target.attributes.ufs_title.textContent;
      let x =
        e.target.offsetLeft + e.target.offsetWidth / 2 - desc.offsetWidth / 2;
      desc.style.cssText = `left: ${x}px`;
    }
  };

  // ===================== auto get largest image =====================
  let loadingRef,
    loaded = false;
  const notiRef = UfsGlobal.DOM.notify({
    msg: `Finding big image...`,
    duration: 99999,
  });
  setTimeout(() => {
    if (!loaded) {
      loadingRef = addLoadingAnimationAtPos(
        window.innerWidth / 2,
        window.innerHeight - 130
      );
    }

    const interval = setInterval(() => {
      if (loaded || !overlay) {
        loadingRef?.();
        notiRef?.closeAfter?.(!overlay ? 0 : 3000);
        clearInterval(interval);
      }
    }, 100);
  }, 300); // show loading after 300ms

  getLargestImageSrc(src, location.href).then((_src) => {
    if (!_src || _src == src) {
      loaded = true;
      UfsGlobal.DOM.notify({
        msg: `Big image not found`,
        duration: 3000,
      });
      return;
    }

    notiRef.setText(`Found big image. Loading...`);

    const temp = new Image();
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

// #region utils

function addLoadingAnimationAtPos(
  x,
  y,
  size = 40,
  containerStyle = "",
  loadingStyle = ""
) {
  let ele = document.createElement("div");
  ele.style.cssText = `
    position: fixed;
    left: ${x - size / 2}px;
    top: ${y - size / 2}px;
    width: ${size}px;
    height: ${size}px;
    z-index: 2147483647;
    pointer-events: none;
    user-select: none;
    ${containerStyle}
  `;
  addLoadingAnimation(ele, size, loadingStyle);
  document.body.appendChild(ele);
  return () => ele.remove();
}
function addLoadingAnimation(
  element,
  size = Math.min(element?.clientWidth, element?.clientHeight) || 0,
  customStyle = ""
) {
  let id = Math.random().toString(36).substr(2, 9);
  element.classList.add("ufs-loading-" + id);

  let borderSize = 4;

  // inject css code
  let style = document.createElement("style");
  style.id = "ufs-loading-style-" + id;
  style.textContent = `
    .ufs-loading-${id}::after {
      content: "";
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: ${size}px;
      height: ${size}px;
      margin-top: -${size / 2}px;
      margin-left: -${size / 2}px;
      border-radius: 50%;
      border: ${borderSize}px solid #555 !important;
      border-top-color: #eee !important;
      animation: ufs-spin 1s ease-in-out infinite;
      box-sizing: border-box !important;
      ${customStyle}
    }
    @keyframes ufs-spin {
      to {
        transform: rotate(360deg);
      }
    }
    `;
  (document.head || document.documentElement).appendChild(style);

  return () => {
    if (element) element.classList.remove("ufs-loading-" + id);
  };
}
function addEventListener(target, event, callback, options) {
  target.addEventListener(event, callback, options);
  return () => target.removeEventListener(event, callback, options);
}
function enableDragAndZoom(element, container, onUpdateCallback) {
  // set style
  const className = "ufs-drag-and-zoom";
  element.classList.add(className);

  let style = document.createElement("style");
  style.textContent = `
    .${className} {
      cursor: grab;
      position: relative !important;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
      -khtml-user-select: none;
      max-width: unset !important;
      max-height: unset !important;
      min-width: unset !important;
      min-height: unset !important;
      -webkit-user-drag: none !important;
    }`;
  (container || element).appendChild(style);

  // config
  const lerpSpeed = 0.3;
  const last = { x: 0, y: 0 };
  const mouse = { x: 0, y: 0 };
  const animTarget = {
    left: parseFloat(element.style.left),
    top: parseFloat(element.style.top),
    width: parseFloat(element.style.width),
    height: parseFloat(element.style.height),
  };

  let run = true;
  function animate() {
    let updated = false;
    let updatedValue = {};
    for (let prop in animTarget) {
      const currentValue = parseFloat(element.style[prop]);
      const targetValue = animTarget[prop];
      let del = Math.abs(targetValue - currentValue);

      if (del > 0.1) {
        const newValue =
          del < 1 ? targetValue : lerp(currentValue, targetValue, lerpSpeed);
        element.style[prop] = newValue + "px";
        updatedValue[prop] = newValue;
        updated = true;
      }
    }
    if (updated) onUpdateCallback?.(updatedValue);
    if (run) requestAnimationFrame(animate);
  }

  animate();

  // Mouse down event listener
  let dragging = false;
  let _down = addEventListener(container || element, "mousedown", function (e) {
    e.preventDefault();
    dragging = true;
    last.x = e.clientX;
    last.y = e.clientY;
    element.style.cursor = "grabbing";
  });

  // Mouse move event listener
  let _move = addEventListener(document, "mousemove", function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    if (dragging) {
      let delX = e.clientX - last.x;
      let delY = e.clientY - last.y;

      animTarget.left += delX;
      animTarget.top += delY;

      last.x = e.clientX;
      last.y = e.clientY;
    }
  });

  // Mouse up event listener
  let _up = addEventListener(document, "mouseup", function () {
    dragging = false;
    element.style.cursor = "grab";
  });

  // Mouse leave event listener
  let _leave = addEventListener(document, "mouseleave", function () {
    dragging = false;
    element.style.cursor = "grab";
  });

  // Mouse wheel event listener for zooming
  let _wheel = addEventListener(container || element, "wheel", function (e) {
    e.preventDefault();

    const curScale = parseFloat(element.style.width) / element.width;
    const delta = -e.wheelDeltaY || -e.wheelDelta;
    const factor = Math.abs((0.3 * delta) / 120);
    const newScale =
      delta > 0 ? curScale * (1 - factor) : curScale * (1 + factor);

    const newW = element.width * newScale;
    const newH = element.height * newScale;

    if (newW < 10 || newH < 10) {
      return;
    }

    const left = parseFloat(element.style.left);
    const top = parseFloat(element.style.top);
    const offsetX = mouse.x - left;
    const offsetY = mouse.y - top;
    const newLeft = left - (newW - element.width) * (offsetX / element.width);
    const newTop = top - (newH - element.height) * (offsetY / element.height);

    animTarget.left = newLeft;
    animTarget.top = newTop;
    animTarget.width = newW;
    animTarget.height = newH;
  });

  let listeners = [_down, _move, _up, _leave, _wheel];

  return {
    animateTo: (x, y, w, h) => {
      animTarget.left = x;
      animTarget.top = y;
      animTarget.width = w;
      animTarget.height = h;
    },
    destroy: () => {
      run = false;
      style.remove();
      element.classList.remove(className);
      listeners.forEach((l) => l?.());
    },
  };
}
// prettier-ignore
function getContentClientRect(target, win = window) {
  let rect = target.getBoundingClientRect();
  let compStyle = win.getComputedStyle(target);
  let pFloat = parseFloat;
  let top = rect.top + pFloat(compStyle.paddingTop) + pFloat(compStyle.borderTopWidth);
  let right = rect.right - pFloat(compStyle.paddingRight) - pFloat(compStyle.borderRightWidth);
  let bottom = rect.bottom - pFloat(compStyle.paddingBottom) - pFloat(compStyle.borderBottomWidth);
  let left = rect.left + pFloat(compStyle.paddingLeft) + pFloat(compStyle.borderLeftWidth);
  return {
      top : top,
      right : right,
      bottom : bottom,
      left : left,
      width : right-left,
      height : bottom-top,
  };
}
function onDoublePress(key, callback, timeout = 500) {
  let timer = null;
  let clickCount = 0;
  const keyup = (event) => {
    if (event.key !== key) {
      clickCount = 0;
      return;
    }
    clickCount++;
    if (clickCount === 2) {
      callback?.();
      clickCount = 0;
      return;
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      clickCount = 0;
    }, timeout);
  };

  document.addEventListener("keyup", keyup);
  return () => {
    clearTimeout(timer);
    document.removeEventListener("keyup", keyup);
  };
}
function lerp(from, to, speed) {
  return from + (to - from) * speed;
}
function svgBase64ToUrl(sgvBase64) {
  try {
    if (!/^data:image\/svg/.test(sgvBase64)) throw new Error("Invalid SVG");
    const svgContent = atob(sgvBase64.split(",")[1]);
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    setTimeout(() => URL.revokeObjectURL(url), 6e4);
    return url;
  } catch (e) {
    console.log("ERROR: ", e);
    return null;
  }
}
function svgToBlobUrl(svg) {
  let url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  return url;
}
function svgToBase64(svg) {
  try {
    return (
      "data:image/svg+xml;charset=utf-8;base64," +
      btoa(new XMLSerializer().serializeToString(svg))
    );
  } catch (e) {
    console.log("ERROR: ", e);
    return null;
  }
}
function getResolutionCategory(width, height) {
  let min = Math.min(width, height);
  let max = Math.max(width, height);

  if (max <= 256 && min <= 144) return "144p";
  if (max <= 320 && min <= 180) return "240p";
  if (max <= 640 && min <= 360) return "360p";
  if (max <= 640 && min <= 480) return "SD (480p)";
  if (max <= 1280 && min <= 720) return "HD (720p)";
  if (max <= 1600 && min <= 900) return "HD+ (900p)";
  if (max <= 1920 && min <= 1080) return "FHD (1080p)";
  if (max <= 2560 && min <= 1440) return "QHD (1440p)";
  if (max <= 3840 && min <= 2160) return "4K (2160p)";
  if (max <= 5120 && min <= 2880) return "5K (2880p)";
  if (max <= 7680 && min <= 4320) return "8K (4320p)";
  if (max <= 10240 && min <= 4320) return "10K (4320p)";
  if (max <= 15360 && min <= 8640) return "16K (8640p)";
  return "> 16K";
}
// #endregion
