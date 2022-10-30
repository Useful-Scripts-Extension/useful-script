export default {
  name: {
    en: "Remove bloat (iframe, embed)",
    vi: "Xoá mọi iframe/embed",
  },
  description: {
    en: "Remove iframe, embeds, applets from website",
    vi: "Xoá mọi thứ gây xao nhãng (quảng cáo, web nhúng, ..)",
  },
  func() {
    function R(w) {
      try {
        var d = w.document,
          j,
          i,
          t,
          T,
          N,
          b,
          r = 1,
          C;
        for (j = 0; (t = ["object", "embed", "applet", "iframe"][j]); ++j) {
          T = d.getElementsByTagName(t);
          for (i = T.length - 1; i + 1 && (N = T[i]); --i)
            if (
              j != 3 ||
              !R((C = N.contentWindow) ? C : N.contentDocument.defaultView)
            ) {
              b = d.createElement("div");
              b.style.width = N.width;
              b.style.height = N.height;
              b.innerHTML =
                "<del>" + (j == 3 ? "third-party " + t : t) + "</del>";
              N.parentNode.replaceChild(b, N);
            }
        }
      } catch (E) {
        r = 0;
      }
      return r;
    }
    R(self);
    var i, x;
    for (i = 0; (x = frames[i]); ++i) R(x);
  },
};
