import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: "https://lh3.googleusercontent.com/X0-M21C_VbWyXYuUjN55oyMDvOukjbzAxbs_WrUjwzsebWbyjFCIEchOtczI0DBvbyL9MUpuEWnghm19gF6dp8Vriw=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Return youtube dislike",
    vi: "Hiện lượt không thích youtube",
  },
  description: {
    en: "Returns ability to see dislikes of youtube video/short",
    vi: "Hiển thị số lượt không thích của video/short youtube",
  },
  badges: [BADGES.hot, BADGES.new],

  changeLogs: {
    "2024-05-25": "autorun",
  },

  whiteList: ["*://*.youtube.com/*"],

  contentScript: {
    onDocumentStart: async () => {
      let listeners = [];

      function listenShort() {
        return UfsGlobal.DOM.onElementsAdded(
          "ytd-toggle-button-renderer#dislike-button",
          (eles) => {
            let btn = Array.from(eles).find((el) =>
              UfsGlobal.DOM.isElementInViewport(el)
            );
            if (!btn) return;

            function makeUI(dislikeCount = 0) {
              let label = btn.querySelector(
                ".yt-spec-button-shape-with-label__label span"
              );
              if (!label) return;
              let text = numberFormat(dislikeCount);
              if (label.textContent === text) return;
              label.textContent = text;
            }

            let videoId = getVideoId();
            getDislikeDataDebounced(videoId, (res) => {
              makeUI(res.dislikes);
              let interval = setInterval(() => makeUI(res.dislikes), 1000);
              listeners.push(() => clearInterval(interval));
            });
          }
        );
      }

      function listenVideo() {
        return UfsGlobal.DOM.onElementsAdded(
          "ytd-watch-metadata dislike-button-view-model button",
          (eles) => {
            let videoId = getVideoId();

            const button = eles[0];
            if (!button) return;

            function makeUI(dislikeCount = 0) {
              // dislike text
              let className = "yt-spec-button-shape-next__button-text-content";
              let exists = Array.from(button.querySelectorAll(className));
              if (exists?.length) {
                exists[0].textContent = numberFormat(dislikeCount);
                for (let i = 1; i < exists.length; i++) exists[i].remove();
              } else {
                let dislikeText = document.createElement("div");
                dislikeText.classList.add(className);
                dislikeText.textContent = numberFormat(dislikeCount);
                button.appendChild(dislikeText);
                UfsGlobal.DOM.onElementRemoved(dislikeText, () =>
                  makeUI(dislikeCount)
                );
              }

              // fix button style
              button.style.width = "auto";

              // fix dislike icon style
              const dislikeIcon = button.querySelector(
                ".yt-spec-button-shape-next__icon"
              );
              dislikeIcon.style.marginRight = "6px";
              dislikeIcon.style.marginLeft = "-6px";
            }

            getDislikeDataDebounced(videoId, (res) => {
              makeUI(res.dislikes);
            });
          }
        );
      }

      function run() {
        // remove all pre listeners
        listeners.forEach((fn) => fn?.());

        if (isShorts()) listeners.push(listenShort());
        else listeners.push(listenVideo());
      }

      window.onload = () => {
        run();
        UfsGlobal.DOM.onHrefChanged((oldHref, newHref) => {
          run();
        });
      };
    },

    onClick: async function () {
      let videoId = getVideoId();
      getDislikeData(videoId).then((response) => {
        console.log(response);
        alert("Youtube Dislikes:\n" + JSON.stringify(response, null, 4));
      });
    },
  },
};

const cached = {};

const getDislikeDataDebounced = UfsGlobal.Utils.debounce(getDislikeData, 100);

// Source code extracted from https://chrome.google.com/webstore/detail/return-youtube-dislike/gebbhagfogifgggkldgodflihgfeippi
async function getDislikeData(videoId, callback) {
  if (!videoId) return;

  if (cached[videoId]) {
    callback?.(cached[videoId]);
    return cached[videoId];
  }

  const apiUrl = "https://returnyoutubedislikeapi.com";
  try {
    const res = await fetch(`${apiUrl}/votes?videoId=${videoId}&likeCount=`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) throw new Error(res.error);
    const json = await res.json();
    cached[videoId] = json;
    callback?.(json);
    return json;
  } catch (e) {
    console.log("ERROR: ", e);
    return null;
  }
}

function getVideoId(url = location.href) {
  const urlObject = new URL(url);
  const pathname = urlObject.pathname;
  if (pathname.startsWith("/clip")) {
    return document.querySelector("meta[itemprop='videoId']").content;
  } else {
    if (pathname.startsWith("/shorts")) {
      return pathname.slice(8);
    }
    return urlObject.searchParams.get("v");
  }
}

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const height = innerHeight || document.documentElement.clientHeight;
  const width = innerWidth || document.documentElement.clientWidth;
  return (
    // When short (channel) is ignored, the element (like/dislike AND short itself) is
    // hidden with a 0 DOMRect. In this case, consider it outside of Viewport
    !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= height &&
    rect.right <= width
  );
}
function isVideoLoaded() {
  const videoId = getVideoId();
  return (
    // desktop: spring 2024 UI
    document.querySelector(`ytd-watch-grid[video-id='${videoId}']`) !== null ||
    // desktop: older UI
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    // mobile: no video-id attribute
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}

function isShorts() {
  return location.pathname.startsWith("/shorts");
}
function isNewDesign() {
  return document.getElementById("comment-teaser") !== null;
}

function numberFormat(numberState) {
  return UfsGlobal.Utils.getNumberFormatter("compactShort").format(numberState);
}

// Information gathering: https://greasyfork.org/en/scripts/471103-youtubedl/code
function getVideoInformation(url) {
  const regex =
    /(?:https?:\/\/(?:www\.)?youtube\.com\/(?:watch\?v=|shorts\/|embed\/)?)([\w-]+)/i;
  const match = regex.exec(url);
  const videoId = match ? match[1] : null;

  let type = null;
  if (url.includes("/shorts/")) type = "shorts";
  else if (url.includes("/watch?v=")) type = "video";
  else if (url.includes("/embed/")) type = "embed";

  return { type, videoId };
}
