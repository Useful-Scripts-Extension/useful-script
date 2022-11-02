// https://stackoverflow.com/questions/9847580/how-to-detect-safari-chrome-ie-firefox-and-opera-browsers
let browser = {
  // Opera 8.0+
  //prettier-ignore
  isOpera: () => (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0,

  // Firefox 1.0+
  isFirefox: () => typeof InstallTrigger !== "undefined",

  // Safari 3.0+ "[object HTMLElementConstructor]"
  //prettier-ignore
  isSafari: () => /constructor/i.test(window.HTMLElement) ||(function (p) {return p.toString() === "[object SafariRemoteNotification]";})(!window["safari"] ||(typeof safari !== "undefined" && window["safari"].pushNotification)),

  // Internet Explorer 6-11
  isIE: () => false || !!document.documentMode,

  // Edge 20+
  isEdge: () => !browser.isIE() && !!window.StyleMedia,

  // Chrome 1 - 79
  //prettier-ignore
  isChrome: () => !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime),

  // Edge (based on chromium) detection
  //prettier-ignore
  isEdgeChromium: () => browser.isChrome() && navigator.userAgent.indexOf("Edg") != -1,

  // Blink engine detection
  isBlink: () => (browser.isChrome() || browser.isOpera()) && !!window.CSS,
};

javascript: (function () {
  document.PwnBkmkVer = 3;
  document.body.appendChild(document.createElement("script")).src =
    "https://deturl.com/ld.php?" + 1 * new Date();
})();

// https://github.com/xploitspeeds/Bookmarklet-Hacks-For-School
javascript: (function () {
  var clickerIsMouseDown = false;
  var clickerCurrentMouseTarget = document.body;
  document.body.addEventListener("mouseup", () => {
    clickerIsMouseDown = false;
  });
  document.body.addEventListener("mousedown", () => {
    clickerIsMouseDown = true;
  });
  document.body.addEventListener("mousemove", (e) => {
    clickerCurrentMouseTarget = e.target;
  });
  setInterval(() => {
    if (clickerIsMouseDown) clickerCurrentMouseTarget.click();
  }, 0);
})();

// download vimeo video
// https://superuser.com/a/1130616

// =============================== YOUTUBE ===============================
// https://chrome.google.com/webstore/detail/return-youtube-dislike/gebbhagfogifgggkldgodflihgfeippi

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
    document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null ||
    // mobile: no video-id attribute
    document.querySelector('#player[loading="false"]:not([hidden])') !== null
  );
}

function isMobile() {
  return location.hostname == "m.youtube.com";
}
function isShorts() {
  return location.pathname.startsWith("/shorts");
}
function isNewDesign() {
  return document.getElementById("comment-teaser") !== null;
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
const apiUrl = "https://returnyoutubedislikeapi.com";
let videoId = getVideoId(location.href);
let response = await fetch(`${apiUrl}/votes?videoId=${videoId}&likeCount=`, {
  method: "GET",
  headers: {
    Accept: "application/json",
  },
})
  .then((response) => {
    if (!response.ok) alert("Error: " + response.error);
    return response;
  })
  .then((response) => response.json())
  .catch((e) => alert("ERROR: " + e));

console.log(response);
