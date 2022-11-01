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

// scroll by dragging
javascript: (function (X, Y) {
  with (document) {
    if (document.onmousedown && document.onmouseup && document.onmousemove) {
      body.style.cursor = "auto";
      document.onmousedown = document.onmouseup = document.onmousemove = null;
    } else {
      body.style.cursor = "all-scroll";
      document.onmousedown = function (e) {
        if ((e && !e.button) || (window.event && event.button & 1)) {
          with (e || event) {
            X = clientX;
            Y = clientY;
            return false;
          }
        }
      };
      document.onmouseup = function (e) {
        if ((e && !e.button) || (window.event && event.button & 1)) {
          X = Y = null;
          return false;
        }
      };
      document.onmousemove = function (e) {
        if (X || Y) {
          with (e || event) {
            scrollBy(X - clientX, Y - clientY);
            X = clientX;
            Y = clientY;
            return false;
          }
        }
      };
    }
  }
})();

// google cache
javascript: void (function () {
  var a = location.href.replace(/^http\:\/\/(.*)$/, "$1");
  location.href = "http://www.google.com/search?q=cache:" + escape(a);
})();

// tiny read
javascript: (function () {
  var s = document.createElement("script");
  s.charset = "UTF-8";
  s.language = "javascript";
  s.type = "text/javascript";
  s.src = "http://www.tidyread.com/tidyread.js";
  document.body.appendChild(s);
})();

// soundcloud download
javascript: (function () {
  var a = document.createElement("a");
  a.innerText = "Download MP3";
  a.href = "http://media.soundcloud.com/stream/";
  document
    .querySelector("#main-content-inner img[class=waveform]")
    .src.match(/\.com\/(. )\_/)[1];
  a.download = document.querySelector("em").innerText + ".mp3";
  document.querySelector(".primary").appendChild(a);
  a.style.marginLeft = "10px";
  a.style.color = "red";
  a.style.fontWeight = 700;
})();

// download youtube video
javascript: (function () {
  url = "http://deturl.com/download-video.js";
  document.body.appendChild(document.createElement("script")).src =
    url + "?" + new Date().getTime();
})();

javascript: (function () {
  document.PwnBkmkVer = 3;
  document.body.appendChild(document.createElement("script")).src =
    "https://deturl.com/ld.php?" + 1 * new Date();
})();

// like everything facebook
javascript: (function () {
  /*
    I Like Everything
    Description: Like everything on Facebook with this JavaScript Bookmarklet
    Author: Feross Aboukhadijeh
    Read more: http://feross.org/like-everything-on-facebook/
*/
  var likeBtns = Array.from(
    document.querySelectorAll(
      ".x9f619.x1n2onr6.x1ja2u2z.x78zum5.xdt5ytf.x193iq5w.xeuugli.x1r8uery.x1iyjqo2.xs83m0k.xg83lxy.x1h0ha7o.x10b6aqq.x1yrsyyn"
    )
  );
  var halt = false;

  var UIDiv = document.createElement("div");
  UIDiv.innerHTML =
    "<div id='happy' style='background-color:#ddd;font-size:16px;text-align:center;position:fixed;top:40px;right:40px;width:200px;height:100px;border:4px solid black;z-index:9999;padding-top:15px;'><span>0</span> of " +
    likeBtns.length +
    " items liked.<div id='happyStatus' style='margin-top:30px;'><a id='happyButton' href='#' style='display:block;' onclick='haltFn();'>Stop it.</a></div></div>";
  UIDiv.onclick = () => UIDiv.parentElement.removeChild(UIDiv);
  document.body.appendChild(UIDiv);

  function main(btns) {
    if (halt || !btns || !btns.length) {
      document.getElementById("happyStatus").innerHTML = "Done!";
      return;
    }
    btns[0].click();
    btns[0].style.color = "#FF0000";
    var countSpan = document.querySelector("#happy span");
    countSpan.innerHTML = parseInt(countSpan.innerHTML, 10) + 1;

    // Wait for each Like to be processed before trying the next.
    // Facebook enforces this requirement.
    window.setTimeout(function () {
      console.log(btns);
      main(btns.splice(1));
    }, 3000);
  }

  /* eslint-disable no-unused-vars */
  function haltFn() {
    halt = true;
    return false; // prevent default event
  }
  /* eslint-enable no-unused-vars */

  function hasClass(target, className) {
    return new RegExp("(\\s|^)" + className + "(\\s|$)").test(target.className);
  }

  main(likeBtns);
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
