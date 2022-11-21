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

// reddit toolkit: https://codepen.io/bookmarklets/pen/Noxwme?editors=1010
javascript: if (window.location.hostname.includes("reddit")) {
  if (document.getElementById("mymenu")) {
    document.getElementById("mymenu").remove();
  } else {
    function switcher() {
      var url = location.href;
      if (url.includes("www")) {
        var url = url.replace("www", "old");
        window.open(url, "_self");
      } else if (url.includes("new")) {
        var url = url.replace("new", "old");
        window.open(url, "_self");
      } else {
        var url = url.replace("old", "www");
        window.open(url, "_self");
      }
    }
    var switchIt = `<a style=color:#00FF00; href=# onClick=switcher()
    title=Switch&nbsp;between&nbsp;old&nbsp;and&nbsp;new&nbsp;Reddit>Old/New Reddit</a>`;
    function upVote() {
      if (
        window.location.href.indexOf("old.reddit.com/r/") > -1 ||
        window.location.href.indexOf("old.reddit.com/u/") > -1
      ) {
        (function () {
          var q = [];
          $(".up").each(function () {
            var that = this;
            var f = function (index) {
              $(that).trigger("click");
              $(that).trigger("mousedown");
              setTimeout(function () {
                if (q[index]) {
                  q[index](index + 1);
                } else {
                  if (upVoteTimer) {
                    window.clearTimeout(upVoteTimer);
                  }
                }
              }, 500);
            };
            q.push(f);
          });
          var upVoteTimer = window.setTimeout(function () {
            q[0](1);
          }, 50);
        })();
      } else if (window.location.href.indexOf("old.reddit.com/user/") > -1) {
        void !(function () {
          document
            .querySelectorAll('[data-event-action="upvote"]')
            .forEach(function (o) {
              "upvote" === o.dataset.eventAction && o.click();
            }),
            document.querySelectorAll(".icon-upvote").forEach(function (o) {
              o.click();
            });
        })();
      } else {
        alert(`You need to be voting in a single sub or user page in OLD reddit for this to work!\nSWITCH TO OLD REDDIT!\n
    Go to: http://old.reddit.com/r/ and choose a subreddit or user to vote on!`);
      }
    }
    var upVoteIt =
      "<a style=color:#00FF00; href=# onClick=upVote() title=UpVote&nbsp;All&nbsp;(Works&nbsp;Only&nbsp;in&nbsp;OLD&nbsp;Reddit)>&uarr; UpVote All</a>";
    function downVote() {
      if (
        window.location.href.indexOf("old.reddit.com/r/") > -1 ||
        window.location.href.indexOf("old.reddit.com/u/") > -1
      ) {
        (function () {
          var q = [];
          $(".down").each(function () {
            var that = this;
            var f = function (index) {
              $(that).trigger("click");
              $(that).trigger("mousedown");
              setTimeout(function () {
                if (q[index]) {
                  q[index](index + 1);
                } else {
                  if (downVoteTimer) {
                    window.clearTimeout(downVoteTimer);
                  }
                }
              }, 500);
            };
            q.push(f);
          });
          var downVoteTimer = window.setTimeout(function () {
            q[0](1);
          }, 50);
        })();
      } else if (window.location.href.indexOf("old.reddit.com/user/") > -1) {
        void !(function () {
          document
            .querySelectorAll('[data-event-action="downvote"]')
            .forEach(function (o) {
              "downvote" === o.dataset.eventAction && o.click();
            }),
            document.querySelectorAll(".icon-downvote").forEach(function (o) {
              o.click();
            });
        })();
      } else {
        alert(`You need to be voting in a single sub in OLD reddit for this to work!\nSWITCH TO OLD REDDIT!\n
    Go to: http://old.reddit.com/r/ and choose a subreddit`);
      }
    }
    var downVoteIt =
      "<a style=color:#00FF00; href=# onClick=downVote() title=DownVote&nbsp;All(Works&nbsp;Only&nbsp;in&nbsp;OLD&nbsp;Reddit)>&darr; DownVote All</a>";
    function stealth() {
      if (window.location.href.indexOf("old.reddit.com") > -1) {
        (function () {
          var newcss =
            ".midcol, .thumbnail, .rank,  .flairichtext, .flaircolordark, .linkflairlabel, .flaircolorlight, .res-flairSearch {display:none} .title {color:black !important} .title{font-size:120% !important} body {background-color:white}";
          if ("\v" == "v") {
            document.createStyleSheet().cssText = newcss;
          } else {
            var tag = document.createElement("style");
            tag.type = "text/css";
            document.getElementsByTagName("head")[0].appendChild(tag);
            tag[
              typeof document.body.style.WebkitAppearance == "string"
                ? "innerText"
                : "innerHTML"
            ] = newcss;
          }
        })();
        document.getElementsByClassName("side")[0].remove();
        document.getElementById("header").remove();
        document.getElementsByClassName("panestack-title")[0].remove();
        document.getElementsByClassName("menuarea")[0].remove();
        document.getElementsByClassName("usertext cloneable")[0].remove();
        document.getElementsByName("content")[0].remove();
        document.getElementsByClassName("footer-parent")[0].remove();
      } else if (window.location.href.indexOf("reddit.com") > -1) {
        (function () {
          (function () {
            var i,
              elements = document.querySelectorAll("body *");
            for (i = 0; i < elements.length; i++) {
              if (getComputedStyle(elements[i]).position === "fixed") {
                elements[i].parentNode.removeChild(elements[i]);
              }
            }
          })();
        })();

        (function () {
          var e = document.getElementsByClassName("s7pq5uy-6") || "jspfgX";
          if (e[0].style.display == "none") {
            e[0].style.display = "block";
          } else {
            e[0].style.display = "none";
          }
        })();
      } else {
        alert(
          "You need to be on Reddit.com for this bookmarklet to work!\nStealth mode looks best on old.reddit.com!"
        );
      }
    }
    var stealthIt =
      "<a style=color:#00FF00; href=# onClick=stealth() title=This&nbsp;works&nbsp;best&nbsp;in&nbsp;OLD&nbsp;Reddit>Stealth Mode</a>";
    function coder() {
      (function () {
        var newcss =
          ".midcol, .thumbnail, .rank,  .flairichtext, .flaircolordark, .linkflairlabel, .flaircolorlight, .res-flairSearch {display:none} .title {color:green !important} .title{font-size:120% !important} body {background-color:black}";
        if ("\v" == "v") {
          document.createStyleSheet().cssText = newcss;
        } else {
          var tag = document.createElement("style");
          tag.type = "text/css";
          document.getElementsByTagName("head")[0].appendChild(tag);
          tag[
            typeof document.body.style.WebkitAppearance == "string"
              ? "innerText"
              : "innerHTML"
          ] = newcss;
        }
      })();
      document.getElementsByClassName("side")[0].remove();
      document.getElementById("header").remove();
      document.getElementsByClassName("panestack-title")[0].remove();
      document.getElementsByClassName("menuarea")[0].remove();
      document.getElementsByClassName("usertext cloneable")[0].remove();
      document.getElementsByName("content")[0].remove();
      document.getElementsByClassName("footer-parent")[0].remove();
    }
    var coderIt =
      "<a style=color:#00FF00; href=# onClick=coder() title=This&nbsp;only&nbsp;works&nbsp;in&nbsp;OLD&nbsp;Reddit>Coder Mode</a>";
    function baseTag() {
      var insertBase;
      var baseTag;
      insertBase = document.createElement("base");
      insertBase.id = "myBase";
      insertBase.innerHTML = "<base target=_blank>";
      container_block = document.getElementsByTagName("head")[0];
      container_block.appendChild(insertBase);
    }
    var NewTabIt =
      "<a style=color:#00FF00; href=# onClick=baseTag();return&nbsp;false; title=Opens&nbsp;all&nbsp;links&nbsp;in&nbsp;a&nbsp;new&nbsp;tab&nbsp;when&nbsp;clicked>OpenInNewTab</a>";
    function getVid() {
      var url = location.href;
      if (url.includes("old")) {
        var url = url.replace("old", "www");
      }
      window.open("https://redv.co/?url=" + url);
    }
    var downloadVid =
      "<a style=color:#00FF00; href=# onClick=getVid(); title=Download&nbsp;Reddit&nbsp;Videos>GetRedditVideo</a>";
    if (window.location.href.includes("old")) {
      var notice = "";
      var spacer = "<span style=color:#777>.......</span>";
    } else {
      var notice =
        "<br /><sub><br /><i style=font-style:italic;color:#00FFFF;cursor:pointer><a onClick=makeOld() id=demo onMouseOver=replaceText() onMouseOut=original()>This works best<br />in OLD REDDIT</a></i></sub>";
      var spacer = "<span style=color:#777>..........</span>";
    }
    function hideMenu() {
      document.getElementById("mymenu").remove();
    }
    function replaceText() {
      document.getElementById("demo").innerHTML =
        " Click to switch <br />to OLD REDDIT";
    }
    function original() {
      document.getElementById("demo").innerHTML =
        "This works best<br />in OLD REDDIT";
    }
    function makeOld() {
      var url = document.location.href;
      var url = url.replace("www", "old");
      var url = url.replace("new", "old");
      window.open(url, "_self");
    }
    function infoPop() {
      var a = `<div style:padding:10px;><img src=http://reddit.com/favicon.ico /><br />
    <h2>Welcome to the Reddit Toolkit!</h2>
    <ul>
    <li>Upvote all will up vote all all of the posts on a subreddit or even of an individual user. This will work even for subs that you are not subscribed to!<br />
    <i style=color:red>CAVEAT! Be careful - Reddit keeps counts of total votes on a sub and user pages. Overuse will mean your votes will not be counted. Abuse can get you shadowbanned!</i></li>
    <li>Downvote all will down vote all all of the posts on a subreddit or even of an individual user. This will work even for subs that you are not subscribed to!<br />
    <i style=color:red>CAVEAT! - See above!</i></li>
    <li>Old/New Reddit toggle. This will toggle between old and new Reddit. Most of these tools ONLY work in Old Reddit.</li>
    <li>Stealth Mode. This will hide much of the graphics and headers/footers that give away the fact that you are surfing Reddit. Often used by people who are at work.</li> 
    <li>Coder Mode. Looks like you have some kind of coding interface open. Another way of reading Reddit when you are supposed to be doing something else!</li>
    <li>OpenInNewTab. Clicking this will not make any visible changes on the page, however, all of the links you click on will open in a new tab!</li>
    <li>GetRedditVideo - This will open an interface that will let you download a Reddit hosted video.</li>
    </ul><center><h2><a href=https://www.zazzle.com/cats_and_dogs/products>Cat Tax</a></h2></center></div>`;
      w = window.open("", "Links", "scrollbars,resizable,width=400,height=675");
      w.document.write(a);
    }
    var block_to_insert;
    var container_block;
    block_to_insert = document.createElement("div");
    block_to_insert.id = "mymenu";
    block_to_insert.innerHTML =
      `<a href=# onclick=hideMenu() title=Close style=font-weight:bold;color:#F00>&times;</a>' + spacer +'<a href=https://www.zazzle.com/cats_and_dogs/products><img src=https://www.reddit.com/favicon.ico height=15 width=15 /></a>' + spacer + '<a href=# onClick=infoPop() style=color:#FFF;font-weight:bold;size:150%; title=Information>&#9432;</a>
    <br /><hr />' + upVoteIt +  '<br /><hr />'+ downVoteIt +'<br /><hr />'+switchIt+'<br /><hr />' + stealthIt + '<br /><hr />' + coderIt + '<hr/>'+ NewTabIt + '<br /><hr />` +
      downloadVid +
      notice;
    container_block = document.getElementsByTagName("body")[0];
    container_block.appendChild(block_to_insert);
    mymenu.setAttribute(
      "style",
      "height:240px; width:100px; border-radius:0px 0px 10px 0px; background-color:#000; color:red; float:left; font-size:12px; z-index:10000; display:block; overflow:visible; position:fixed; top: 0; padding:2px 5px;"
    );
  }
} else {
  alert(
    "NOT REDDIT\nThis tool only works on Reddit.\nRedirecting you to Reddit.com"
  );
  window.open("http://old.reddit.com", "_self");
}

// tủn back fb old layout: https://github.com/jayremnt/facebook-scripts-dom-manipulation/blob/master/turn-back-old-layout/old-layout.js
javascript: (() => {
  let e =
      require("DTSGInitialData").token ||
      document.querySelector('[name="fb_dtsg"]').value,
    t =
      require("CurrentUserInitialData").USER_ID ||
      document.cookie.match(/c_user=([0-9]+)/)[1];
  fetch("https://www.facebook.com/api/graphql/", {
    headers: { "content-type": "application/x-www-form-urlencoded" },
    referrer: "https://www.facebook.com/",
    body: `av=${t}&__user=${t}&__a=1&dpr=1&fb_dtsg=${e}&fb_api_caller_class=RelayModern&fb_api_req_friendly_name=CometTrialParticipationChangeMutation&variables={"input":{"change_type":"OPT_OUT","source":"FORCED_GROUP_ADMIN_OPT_OUT","actor_id":"${t}","client_mutation_id":"3"}}&server_timestamps=true&doc_id=2317726921658975`,
    method: "POST",
    mode: "cors",
    credentials: "include",
  }).then((e) => {
    console.log("Done"), location.reload();
  });
})();

function getLinkFCode() {
  function getDataDownload(linkcode, retry = 1) {
    let info = {
      linkcode: [linkcode],
      withFcode5: 0,
      fcode: "",
    };
    let Authorization = "Bearer " + $("input#acstk").attr("data-value");
    if (retry < 5) {
      $.ajax({
        url: "/api/v3/downloads/download-side-by-side",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(info),
        dataType: "json",
        headers: { Authorization: Authorization },
        success: function (xhr, status, error) {
          // ctrl.StatusDownload = true;
          // ctrl.showModelDowload(true);
          //   ctrl.downloadMulti = xhr;
          //   ctrl.StatusDownload = true;
          //   ctrl.selectedFileDownload[id]["donwloaded"] = true;
          // donwloaded
          //   ctrl.startDownload1by1_1(ctrl.downloadMulti, id);

          console.log(xhr, status, error);
        },
        error: function (error, textStatus) {
          if (textStatus === "timeout") {
            console.log("Retrying ...", retry);
            getDataDownload(linkcode, ++retry);
            return false;
          } else if (error.status == 401) {
            return alert("You need a VIP account to do this.");
          }
          alert(error.responseJSON.errors);
        },
        timeout: 1000,
      });
    } else {
      $.ajax({
        type: "POST",
        url: "/api/v3/downloads/download-side-by-side",
        contentType: "application/json",
        data: JSON.stringify(info),
        dataType: "json",
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", Authorization);
        },
        success: function (xhr, status, error) {
          // ctrl.StatusDownload = true;
          // ctrl.showModelDowload(true);
          // ctrl.downloadMulti = xhr;
          // ctrl.StatusDownload = true;
          // ctrl.selectedFileDownload[id]['donwloaded'] = true;
          // donwloaded
          // ctrl.startDownload1by1_1(ctrl.downloadMulti,id);
          console.log(xhr, status, error);
        },
        error: function (error) {
          if (error.status == 401) {
            return alert("You need a VIP account to do this.");
          }
          alert(error.responseJSON.errors);
        },
      });
    }
  }

  getDataDownload($("#linkcode").attr("value"));
}
