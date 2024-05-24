import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: "https://lh3.googleusercontent.com/X0-M21C_VbWyXYuUjN55oyMDvOukjbzAxbs_WrUjwzsebWbyjFCIEchOtczI0DBvbyL9MUpuEWnghm19gF6dp8Vriw=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "View youtube video dislikes",
    vi: "Xem lượng dislike video youtube",
  },
  description: {
    en: "Know how many dislike does youtube video have",
    vi: "Biết số lượt dislikes (không thích) video youtube",
  },
  whiteList: ["*://*.youtube.com/*"],

  contentScript: {
    onDocumentStart: async () => {
      // youtube watch
      document.querySelector("dislike-button-view-model");

      // youtube shorts
      document.querySelector("ytd-toggle-button-renderer#dislike-button");

      // youtube watch
      UfsGlobal.DOM.onElementsVisible(
        "dislike-button-view-model",
        (ele) => {},
        true
      );

      // youtube shorts
      UfsGlobal.DOM.onElementsVisible(
        "ytd-toggle-button-renderer#dislike-button",
        (ele) => {
          // get watching shorts
        },
        true
      );
    },

    onClick: async function () {
      let videoId = getVideoId(location.href);
      getDislikeData(videoId).then((response) => {
        console.log(response);
        alert("Youtube Dislikes:\n" + JSON.stringify(response, null, 4));
      });
    },
  },
};

// Source code extracted from https://chrome.google.com/webstore/detail/return-youtube-dislike/gebbhagfogifgggkldgodflihgfeippi
async function getDislikeData(videoId) {
  const apiUrl = "https://returnyoutubedislikeapi.com";
  try {
    const response = await fetch(
      `${apiUrl}/votes?videoId=${videoId}&likeCount=`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );
    if (!response.ok) alert("Error: " + response.error);
    const response_1 = response;
    return await response_1.json();
  } catch (e) {
    return alert("ERROR: " + e);
  }
}

function getVideoId(url) {
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
  const videoId = getVideoId(window.location.href);
  return (
    // desktop: spring 2024 UI
    document.querySelector(`ytd-watch-grid[video-id='${videoId}']`) !== null ||
    // desktop: older UI
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    // mobile: no video-id attribute
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}
function createObserver(options, callback) {
  const observerWrapper = new Object();
  observerWrapper.options = options;
  observerWrapper.observer = new MutationObserver(callback);
  observerWrapper.observe = function (element) {
    this.observer.observe(element, this.options);
  };
  observerWrapper.disconnect = function () {
    this.observer.disconnect();
  };
  return observerWrapper;
}

function isShorts() {
  return location.pathname.startsWith("/shorts");
}
function isNewDesign() {
  return document.getElementById("comment-teaser") !== null;
}
