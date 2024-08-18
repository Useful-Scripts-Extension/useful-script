import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-thumbs-down fa-lg"></i>',
  name: {
    en: "Return youtube dislike",
    vi: "Hiện lượt không thích youtube",
  },
  description: {
    en: "Returns ability to see dislikes of youtube video/short",
    vi: "Hiển thị số lượt không thích của video/short youtube",
  },
  badges: [BADGES.hot],

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

              // Kiểm tra và chỉ cập nhật nếu cần thiết
              if (label.textContent != text) label.textContent = text;
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
              let className = "yt-spec-button-shape-next__button-text-content";
              let exist = button.querySelector(`.${className}`);

              // Kiểm tra nếu phần tử đã tồn tại, chỉ cập nhật nội dung
              if (exist) {
                const currentText = exist.textContent;
                const newText = numberFormat(dislikeCount);

                // Chỉ cập nhật nếu nội dung thay đổi
                if (currentText !== newText) {
                  exist.textContent = newText;
                }
              } else {
                let dislikeText = document.createElement("div");
                dislikeText.classList.add(className);
                dislikeText.textContent = numberFormat(dislikeCount);
                button.appendChild(dislikeText);

                listeners.push(
                  UfsGlobal.DOM.onElementRemoved(dislikeText, () =>
                    makeUI(dislikeCount)
                  )
                );
              }

              // Sửa lại phong cách của nút
              button.style.width = "auto";
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
        // Xóa tất cả listeners trước đó
        listeners.forEach((fn) => fn?.());
        listeners = []; // Reset listeners array sau khi xóa

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
    document.querySelector(`ytd-watch-grid[video-id='${videoId}']`) !== null ||
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
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
