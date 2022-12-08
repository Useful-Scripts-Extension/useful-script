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

  onClick: function () {
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

      if (!L.length) {
        alert("No image found");
      } else {
        let id = "useful-script-showTheImages";
        let div = document.createElement("div");
        div.id = id;
        div.style.zIndex = 9998;
        div.style.backgroundColor = "#000d";
        div.style.position = "fixed";
        div.style.top = "5px";
        div.style.left = "5px";
        div.style.right = "5px";
        div.style.bottom = "5px";
        div.style.overflow = "auto";

        div.innerHTML = `<tr>
              <th colspan="2">Found ${L.length} Image(s):</th>
          </tr>
          
          <div style="padding:20px;border:0;outline:0;background:#eee">
            ${L.map(
              (img) => '<img src="' + img + '" style="margin:5px"/>'
            ).join("")}
          </div>
          
          <div style="position:fixed;top:5px;right:5px;width:20px;height:20px;font-size:16px;font-weight:bold;z-index:9999;padding:2px;margin:0;opacity:0.8;border-radius:6px;background:#f55;cursor:pointer;color:white;text-align:center;box-shadow:2px 2px 4px rgba(0,0,0,0.5)" 
            onclick="document.querySelector('#${id}')?.remove?.()">X
          </div>`;

        B.appendChild(div);
      }
    })();
  },
};
