export default {
  name: {
    en: "Download video",
    vi: "Tải video",
  },
  description: {
    en: "Can be used on almost any website",
    vi: "Dùng được cho gần như tất cả trang web",
  },
  blackList: ["www.youtube.com"],
  whiteList: [],

  // Source code extracted from https://chrome.google.com/webstore/detail/video-downloader-professi/elicpjhcidhpjomhibiffojpinpmmpil
  func: function () {
    function scanPage() {
      var url = document.location.href;
      allUrlsList = [];

      var html = document.documentElement.outerHTML;

      /*var i = html.indexOf("HTML5Player");
        if ( i>0)
            html =html.substr(i); 
        */
      for (var j = 0; j < 4; j++) {
        for (var i = 0; ; ) {
          var o = FindFirstUrl(
            html,
            j == 3 ? ".m3u8" : j == 2 ? ".mov" : j == 1 ? ".flv" : ".mp4",
            i
          );
          if (!o || !o.start) break;
          i = o.start;

          allUrlsList.push({
            url: o.mp4,
            title: document.title,
            type: j == 3 ? "m3u8" : "video",
          });
        }
      }

      for (var i = 0; i < document.links.length; i++) {
        var link = document.links[i];
        var u = isSupportedUrl(link.href);
        if (u) {
          var title = "";
          if (link.hasAttribute("title"))
            title = myTrim(link.getAttribute("title"));
          if (!title && link.hasAttribute("alt"))
            title = myTrim(link.getAttribute("alt"));
          if (!title) title = myTrim(link.innerText);

          if (!title) title = document.title;
          var cl = "";
          if (link.hasAttribute("class"))
            cl = myTrim(link.getAttribute("class"));
          allUrlsList.push({
            url: u,
            title: title,
            class: cl,
            id: link.id ? link.id : "",
            value: "",
            type: "extern",
          });
        }
      }

      type = "video";
      a = document.getElementsByTagName("video");
      for (var i = 0; i < a.length; i++) {
        var link = a[i];
        var u = false;
        if (link.src) u = link.src;
        if (!u && link.hasAttribute("data-thumb")) {
          u = myTrim(link.getAttribute("data-thumb"));
          if (u.indexOf("http") == -1) u = "http:" + u;
        }
        var u = isSupportedUrl(u);
        if (u) {
          var title = "";
          if (link.hasAttribute("alt"))
            title = myTrim(link.getAttribute("alt"));
          else if (link.hasAttribute("title"))
            title = myTrim(link.getAttribute("title"));
          if (!title) title = document.title;
          var cl = "";
          if (link.hasAttribute("class"))
            cl = myTrim(link.getAttribute("class"));

          allUrlsList.push({ url: u, title: title, type: type });
        }
      }

      return { msg: "msgAddLinks", url: url, link: allUrlsList };
    }

    function myTrim(txt) {
      if (!txt) return "";
      return txt.replace(/^[\s_]+|[\s_]+$/gi, "").replace(/(_){2,}/g, "_");
    }

    function isSupportedUrl(url) {
      if (!url || !url.toLowerCase) return false;
      if (
        url.toLowerCase().indexOf("javascript:") != -1 ||
        url.toLowerCase().indexOf("javascript :") != -1
      )
        return false;
      if (
        url.toLowerCase().indexOf("mailto:") != -1 ||
        url.toLowerCase().indexOf("mailto :") != -1
      )
        return false;
      if (url.indexOf("data:image") != -1) return false;
      if (
        url.indexOf(".mp4") == -1 &&
        url.indexOf(".flv") == -1 &&
        url.indexOf(".mov") == -1
      )
        return false;
      return url;
    }

    function getOembedURL() {
      var url = location.href;
      if (url.match("^https?://(?:www.)?youtube.com/watch?")) {
        //alert(document.location.protocol+"    "+document.location.hostname);
        return (
          document.location.protocol +
          "//" +
          document.location.hostname +
          "/oembed?url=" +
          encodeURIComponent(url) +
          "&format=json"
        );
      }
      var all = document.getElementsByTagName("link");
      for (var i = 0, max = all.length; i < max; i++) {
        var type = all[i].type;
        if (typeof type == "undefined") {
          continue;
        }
        if (type.indexOf("application/json+oembed") != -1) {
          return all[i].href;
        }
      }
      //console.log("NO OEMBED");
      return false;
    }

    function getOembedInfo(url, callback) {
      if (url.indexOf(location.protocol) != 0) {
        url = location.protocol + url.replace(/^https?:/, "");
      }
      //console.log("getOembedInfo:" + url);

      if (!document.location.href) {
        //console.log("no location available");
        callback({ info: false, error: "no location available" });
        return;
      }
      var xhr = new XMLHttpRequest();
      xhr.onerror = function (e) {
        //console.log("Error onerror: " + e.target.status);
        callback({ info: false, error: e.target.status });
        return;
      };
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status === 200) {
            //console.log("info received:", xhr.responseText)
            callback({ info: xhr.responseText, error: false });
          } else {
            //console.log("Error state:", xhr.statusText)
            callback({ info: false, error: xhr.statusText });
          }
        }
      };
      xhr.send();
    }

    function FindFirstUrl(html, ext, start) {
      for (;;) {
        var i = html.indexOf(ext, start);
        if (i < 0) return false;
        start = i + ext.length;
        var i1 = html.indexOf('"', i);
        var i2 = html.indexOf("'", i);
        var c = false;
        if (i1 > i && i2 > i) {
          c = i1 > i2 ? "'" : '"';
          if (i1 > i2) i1 = i2;
        } else if (i1 > i) {
          c = '"';
        } else if (i2 > i) {
          c = "'";
          i1 = i2;
        } else continue;

        var i0 = i1 > 600 ? i1 - 600 : 0;
        var s = html.substr(i0, i1 - i0);
        i2 = s.lastIndexOf(c);
        if (i2 < 0) continue;
        s = s.substr(i2 + 1);
        if (s.indexOf("http://") == 0 || s.indexOf("https://") == 0)
          return { mp4: s, start: i1 };
        if (s.indexOf("http:\\/\\/") == 0 || s.indexOf("https:\\/\\/") == 0) {
          s = s.replace(/\\\//g, "/");
          return { mp4: s, start: i1 };
        }
        if (ext == ".m3u8" && (s.indexOf("\\/") == 0 || s.indexOf("/") == 0)) {
          s = s.replace(/\\\//g, "/");
          return { mp4: s, start: i1 };
        }
        continue;
      }
    }

    //for Vimeo:
    function FindFirstUrlVimeo(html, ext, i2) {
      while (1) {
        var i1 = html.indexOf(ext, i2);
        if (i1 < 0) return false;
        var i2 = i1;
        i2 += ext.length;
        var l = html.length;
        while (
          i1 > 0 &&
          html.charAt(i1) != '"' &&
          html.charAt(i1) != "'" &&
          html.charAt(i1) != ">"
        ) {
          i1--;
        }
        if (html.charAt(i1) == ">") {
          while (i2 < l && html.charAt(i2) != "<") {
            i2++;
          }
        } else {
          while (i2 < l && html.charAt(i2) != '"' && html.charAt(i2) != "'") {
            i2++;
          }
        }
        i1++;
        if (
          html.substr(i1, 7) == "http://" ||
          html.substr(i1, 8) == "https://" ||
          html.substr(i1, 4) == "www." ||
          html.substr(i1, 5) == "/www."
        ) {
          return [i2, html.substr(i1, i2 - i1)];
        } else if (
          html.substr(i1, 9) == "http:\\/\\/" ||
          html.substr(i1, 10) == "https:\\/\\/"
        ) {
          var s = html.substr(i1, i2 - i1);
          s = s.replace(/\\\//g, "/");
          return [i2, s];
        }
        if (i2 <= i1) break;
      }
      return false;
    }

    function findVimeoVideos(callback) {
      if (document.location.href.indexOf("vimeo.com") < 0) return;

      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.open("GET", document.location.href, true);
      xmlHttpReq.onreadystatechange = function (data) {
        if (this.readyState != 4) return;
        findVimeoVideos2(this.responseText, callback);
      };
      xmlHttpReq.send(null);
    }
    function GetVimeoId(url) {
      //if ( GetUrlParameter( url, L"clip_id", csId))
      //	return TRUE;
      var csId = url;
      var i = csId.indexOf("?");
      if (i >= 0) csId = csId.substr(0, i);
      i = csId.indexOf("#");
      if (i >= 0) csId = csId.substr(0, i);

      i = csId.lastIndexOf("/");
      if (i < 0) return false;
      csId = csId.substr(i + 1);
      if (csId.length < 8) return false;
      for (i = 0; i < csId.length; i++) {
        if (csId.charAt(i) < "0" || csId.charAt(i) > "9") return false;
      }
      return csId;
    }
    function findVimeoVideos2(html, callback) {
      var k = 'data-config-url="';
      var i = html.indexOf(k);
      var url = false;
      if (i >= 0) {
        i += k.length;
        var i2 = html.indexOf('"', i);
        if (i2 > i) url = html.substr(i, i2 - i);
      }
      if (!url) {
        var o = FindFirstUrlVimeo(html, "/config?", 0);
        if (o) url = o[1];
      }
      if (!url) {
        var id = GetVimeoId(document.location.href);
        if (!id) return;
        url = "https://player.vimeo.com/video/" + id;
      }
      url = url.replace(/&amp;/g, "&");
      var xmlHttpReq = new XMLHttpRequest();
      xmlHttpReq.open("GET", url, true);
      xmlHttpReq.onreadystatechange = function (data) {
        if (this.readyState != 4) return;
        var s = this.responseText;
        var k = '"title":"';
        var i = s.indexOf(k);
        title = document.title;
        if (i >= 0) {
          i += k.length;
          for (var j = i; j + 1 < s.length; j++) {
            if (s.charAt(j) == "\\") j++;
            else if (s.charAt(j) == '"') break;
          }
          if (j + 1 < s.length) title = s.substr(i, j - i);
        }
        var start = 0;
        var allUrlsList = [];
        while (1) {
          var o = FindFirstUrlVimeo(s, ".mp4", start);
          if (!o) break;
          start = o[0];
          var i = s.indexOf('"height":', start);
          var h = 0;
          if (i > 0) h = parseInt(s.substr(i + 9));

          var url = o[1];
          allUrlsList.push({
            url: url,
            title: title + " (" + h + "p)",
            type: "video",
          });
        }
        if (allUrlsList.length > 0)
          callback({
            msg: "msgAddLinks",
            url: document.location.href,
            link: allUrlsList,
          });
      };
      xmlHttpReq.send(null);
    }

    // main

    function renderInNewWindow({ link, msg, url } = {}) {
      if (!link?.length) {
        alert("Not found video");
        return;
      }

      var win = window.open(
        "",
        "All videos from " + url,
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=500,top=50,left=50"
      );
      link?.slice(0, 10).forEach((_) => {
        let video = document.createElement("video");
        video.controls = true;
        video.src = _.url;
        win.document.body.appendChild(video);
      });
    }

    (() => {
      //   var url = getOembedURL();
      //   console.log(url);

      //   if (url) {
      //     getOembedInfo(url, function (response) {
      //       console.log(response);
      //     });
      //   }

      if (document.location.href.indexOf("vimeo.com") >= 0) {
        console.log("Found vimeo, fetching...");
        findVimeoVideos((data) => {
          console.log("vimeoData", data);

          renderInNewWindow(data);
        });
      } else {
        let data = scanPage();
        console.log("scan page", data);

        renderInNewWindow(data);
      }
    })();
  },
};
