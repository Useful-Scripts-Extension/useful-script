export default {
  icon: `<i class="fa-regular fa-newspaper"></i>`,
  name: {
    en: "Bypass Paywalls",
    vi: "Xem miễn phí trang tin tức trả phí",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    // source code lấy từ: https://bookmarklet.vercel.app/
    // extension chức năng tương tự: https://github.com/iamadamdev/bypass-paywalls-chrome

    let clearCookies = () => {
      var cookies = document.cookie.split("; ");
      for (var c = 0; c < cookies.length; c++) {
        var d = window.location.hostname.split(".");
        while (d.length > 0) {
          var cookieBase =
            encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) +
            "=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=" +
            d.join(".") +
            " ; path=";
          var p = location.pathname.split("/");
          document.cookie = cookieBase + "/";
          while (p.length > 0) {
            document.cookie = cookieBase + p.join("/");
            p.pop();
          }
          d.shift();
        }
      }
    };

    if (window.location.href.indexOf("ft.com") > -1) {
      clearCookies();
      alert("To read FT.com, we must redirect you through FaceBook!");
      window.open(
        "https://m.facebook.com/l.php?u=" +
          encodeURIComponent(window.location.href) +
          "?ClearCache=true"
      );
    } else if (
      window.location.href.indexOf("technologyreview.com") > -1 ||
      window.location.href.indexOf("investors.com") > -1 ||
      window.location.href.indexOf("businessinsider.com") > -1
    ) {
      window.open("https://outline.com/" + window.location.href);
    } else if (window.location.href.indexOf("wsj.com") > -1) {
      void (function () {
        var a, b, c, e, f;
        f = 0;
        a = document.cookie.split("; ");
        for (e = 0; e < a.length && a[e]; e++) {
          f++;
          for (
            b = "." + location.host;
            b;
            b = b.replace(/^(?:\.|[^\.]+)/, "")
          ) {
            for (c = location.pathname; c; c = c.replace(/.$/, "")) {
              document.cookie =
                a[e] +
                "; domain=" +
                b +
                "; path=" +
                c +
                "; expires=" +
                new Date(new Date().getTime() - 1e11).toGMTString();
            }
          }
        }
        alert("Expired " + f + " cookies\nRedirecting via Twitter Referrer");
      })();

      window.localStorage.clear();
      var pageTitle = document.getElementsByTagName("title")[0].innerText;
      var host = window.location.hostname;
      var host = host.replace("www.", "");
      var host = host.split(".", 1);
      var pageTitle = pageTitle.toString();
      var twit =
        "https://twitter.com/search?q=" + host + " " + pageTitle + "&src=typd";
      window.open(twit, "_self");
    } else {
      clearCookies();
      window.localStorage.clear();
      window.open(document.location + "?ClearCache=true", "_self");
    }
  },
};
