export default {
  icon: `<i class="fa-regular fa-image"></i>`,
  name: {
    en: "Show all images in new frame",
    vi: "Hiển thị mọi hình ảnh trong khung mới",
  },
  description: {
    en: "Will even show hidden images as well as pulling them out of a slider/rotator.",
    vi: "Sẽ thấy đươc ảnh bị ẩn, dễ dàng chuột phải để tải về",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    // source code from https://bookmarklet.vercel.app/

    var iGrabSH = "";
    (function () {
      var L = [],
        i = 0,
        j,
        e,
        D = document,
        u,
        B = D.body,
        x = B.getElementsByTagName("*"),
        t,
        f =
          "banner|seomonitor|pagerank|counter|sitemeter|alexa.com|logo|bayumukti|iklan/|multibet|tipsbola|referral".split(
            "|"
          ),
        F = function (a) {
          for (j = 0; j < f.length; ) if (a.indexOf(f[j++]) > -1) return;
          return !0;
        };
      for (; i < x.length; ) {
        t = (e = x[i++]).tagName.toLowerCase();
        if (
          t == "img" &&
          e.src &&
          (u = e.src) &&
          F(u.toLowerCase()) &&
          L.indexOf(u) < 0 &&
          e.naturalWidth > 200
        )
          L.push(u);
      }
      iGrabSH = B.innerHTML;
      B.innerHTML =
        (L.length
          ? '<tr><th colspan="2">Found ' +
            L.length +
            ' Image(s):</th></tr><div style="width:100%;height:80%;background:white;margin:0;padding:20px;border:0;outline:0"><img src="' +
            L.join('"><img src="') +
            '" style="margin:5px"></div>'
          : "<h1>No Image found</h1>") +
        '<div style="position:fixed;top:5px;right:5px;width:20px;height:20px;font-size:16px;font-weight:bold;z-index:9999;padding:2px;margin:0;opacity:0.8;border-radius:6px;background:#f55;cursor:pointer;color:white;text-align:center;box-shadow:2px 2px 4px rgba(0,0,0,0.5)" onclick="document.body.innerHTML=iGrabSH">X</div>';
    })();
  },
};
