export default {
  icon: "https://www.google.com/s2/favicons?domain=instagram.com",
  name: {
    en: "Instagram reloaded - Download video/image",
    vi: "Instagram reloaded - Tải video/ảnh",
  },
  description: {
    en: "View or download the full-size Instagram image/video",
    vi: "Xem và tải ảnh/video instagram chất lượng cao",
  },
  blackList: [],
  whiteList: ["*://*.instagram.com/*"],

  func: function () {
    // Original source code: https://greasyfork.org/en/scripts/14755-instagram-reloaded
    // Modified by Hoang Tran

    // ==UserScript==
    // @name         Instagram Reloaded
    // @namespace    http://despecial.de
    // @homepageURL  https://greasyfork.org/en/scripts/14755-instagram-reloaded
    // @version      2.30
    // @description  View or download the full-size Instagram image/video. Super simple: press alt+f or shift & click to view media - alt & click saves file. Read for more options.
    // @author       despecial
    // @match        *://*.instagram.com/*
    // @icon         https://www.google.com/s2/favicons?domain=instagram.com
    // @require      https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
    // @grant        GM_download
    // @grant        GM_xmlhttpRequest
    // ==/UserScript==

    var ig =
      '#react-root section main article header ~ div._97aPb > div[role="button"] .FFVAD'; // single photo
    ig += ", #react-root section main article .tWeCl"; // single video
    ig += ', div[role="dialog"] article ._97aPb > div[role="button"] .FFVAD'; // popup photo
    ig += ', div[role="dialog"] article .tWeCl'; // popup video
    ig += ", #react-root section main article .vi798"; // new carousel photo
    ig += ', div[role="dialog"] .vi798'; // new popup carousel photo
    // ig+= ', #react-root section main article video'; // igtv video
    // ig+= ', div[role="dialog"] article header + div > div div div div video'; // popup igtv video
    ig += ",.EmbedFrame.EmbedMedia";
    var alt_trigger = ig;
    alt_trigger +=
      ', #react-root section main article[role="presentation"] div[aria-label="Control"]'; // click fix for videos
    alt_trigger +=
      ', div[role="dialog"] article[role="presentation"] div[aria-label="Control"]'; // click fix for popup video

    (function ($) {
      function despecial_ig(e, $this, a) {
        if (!e) e = window.event;
        if ((e.shiftKey && e.altKey) || a == "rm") {
          var p, v, vf, bloburl;
          e.preventDefault();

          // carousel photos
          if ($(".vi798 .Ckrof img.FFVAD").length) {
            var curr = getCurrentItem();
            var carouselImages = $(".Ckrof img.FFVAD");
            var currpos = curr == $(".Yi5aA").length ? 2 : 1;
            p =
              curr + 1 <= 2
                ? getBestImage(carouselImages[curr])
                : getBestImage(carouselImages[currpos]);
          }
          // get single photo
          else {
            if ($this.is("img")) {
              p = getBestImage($this);
            }
          }

          var parent = $this.parent();
          if (
            $('div[role="dialog"] article header + div').length &&
            a == "rm"
          ) {
            if (parent.find("video + img").length) return; // only visible video
            v = parent.find("video").attr("videourl");
            if (!v) v = parent.find("video").attr("src");
            if (!v) vf = parent.find("video");
            if (!p) p = parent.find("img").last().attr("src");
          } else {
            if (parent.find("video + img").length) return; // only visible video
            v = parent.find("video").attr("videourl");
            if (!v) v = parent.find("video").attr("src");
            if (!v) v = $("meta[property='og:video']").attr("content");
            if (!v) vf = $this.closest("div").find("video");
            if (!v && !vf.attr("poster") && !p)
              p = $this.siblings().find("img").attr("src");
          }
          var ep = $this.find(".efImage").css("background-image"),
            rplcd = new Array("XXXXXX"),
            t = e.altKey ? "_self" : "_blank",
            fs =
              typeof ep === "string" || ep instanceof String
                ? ep.replace(/^url\(['"]?([^'"]+)['"]?\)/, "$1")
                : p;
          for (var i = 0; i < rplcd.length; ++i) {
            var r = new RegExp(rplcd[i], "ig");
            if (r.test(fs)) fs = fs.replace(r, "");
          }
          var isChrome = !!window.chrome && !!window.chrome.webstore;
          if (isChrome && e.altKey) {
            if (fs) direct_download(fs);
            if (vf) video_download(vf);
            console.log("Chrome");
          } else {
            if (v) {
              if (!v.startsWith("blob")) {
                window.open(v, t);
                window.setTimeout(stopVideo, 100);
                console.log("Video opening");
              } else {
                bloburl = fetchVideoURL(
                  window.location.href,
                  $this.parent().find("video")[0],
                  t
                );
                console.log("Blob video loading");
              }
            }
            if (!v && vf.isArray) {
              if (!vf[0].getAttribute("src").startsWith("blob")) {
                video_download(vf);
                console.log("Video2 opening");
              } else {
                bloburl = fetchVideoURL(
                  window.location.href,
                  $this.parent().find("video")[0],
                  t
                );
                console.log("Blob2 video loading");
              }
            }
            if (fs && !v && !bloburl) {
              window.open(fs, t);
              console.log("FS");
            }
          }
        }
      }

      /* dynamic download link */
      function direct_download(url) {
        var filename = url.match("[^/]*$")[0];
        var arg = { url: url, name: filename };
        GM_download(arg);
      }

      var csrf_token = $("body")
        .html()
        .match(/\"csrf_token\":(?:"[^"]*"|^[^"]*$)/)[0]
        .replace(/\"/g, "")
        .split(":")[1];

      function video_download(obj) {
        $.ajax({
          url: window.location,
          type: "GET",
          success: function (res) {
            var video = $(res)
              .filter("meta[property='og:video']")
              .attr("content");
            if (video) {
              $("video").each(function () {
                $(this).get(0).pause();
                $(this).get(0).currentTime = 0;
              });
              window.open(video, "_blank");
            }
          },
          error: function (res) {
            console.log(res);
          },
        });
      }

      function getBestImage(el) {
        el = el.jquery ? el : $(el);
        var img;
        var srcset = el.attr("srcset").split("w,");
        if (srcset) {
          img = srcset.slice(-1)[0].split(" ")[0];
          // console.log("SrcSet P",img);
        } else {
          img = el.attr("src");
          // console.log("Normal P",img);
        }
        return img;
      }

      function cleanFilename(file) {
        return file.replace("jpg", "mp4").split("?")[0].split("/").pop();
      }

      function stopVideo() {
        $("video").each(function () {
          $(this).get(0).pause();
          $(this).get(0).currentTime = 0;
        });
      }

      /* credits: @jomifepe */
      function getCurrentItem(el) {
        var allitems = document.querySelectorAll(".Yi5aA");
        for (let i = 0; i < allitems.length; i++) {
          if (allitems[i].classList.contains("XCodT")) {
            return i;
          }
        }
        return -1;
      }

      function fetchVideoURL(baseUrl, videoElem, t) {
        GM_xmlhttpRequest({
          method: "GET",
          url: baseUrl.split("?")[0] + "?__a=1",
          synchronous: false,
          onload: function (response) {
            var result = JSON.parse(response.responseText);
            let postData = result?.graphql?.shortcode_media;
            var current = getCurrentItem();
            if (current >= 0)
              postData =
                postData?.edge_sidecar_to_children?.edges?.[current]?.node;
            if (!postData) throw "No post data found";
            if (!postData.is_video) throw "Post is not a video";
            if (!postData.video_url) throw "No video url found";
            let videoUrl = postData.video_url;
            videoElem.setAttribute("videoURL", videoUrl);
            window.open(videoUrl, t);
            return true;
          },
        });
      }

      /* left-click and hold shift key to open desired item */
      $(document).on("click", alt_trigger, function (e, a) {
        e = window.event ? event : e;
        if (e.shiftKey) despecial_ig(e, $(this), "rm");
      });

      /* keyboard shortcut alt+f(ullsize) works on video popup, single photo, single video pages */
      $(document).on("ig_press", ig, function (e, a) {
        despecial_ig(e, $(this), a);
      });

      document.addEventListener("keydown", function (e) {
        e = window.event ? event : e;
        if (e.keyCode == 70 && e.altKey) $(ig).trigger("ig_press", ["rm"]);
      });
    })(jQuery);
  },
};
