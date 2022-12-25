export default {
  icon: `<i class="fa-brands fa-css3-alt fa-lg"></i>`,
  name: {
    en: "View stylesheet used",
    vi: "Xem tất cả stylesheet",
  },
  description: {
    en: "View all stylesheet used in current website",
    vi: "Mở danh sách css được dùng bởi website trong tab mới",
  },

  onClick: function () {
    s = document.getElementsByTagName("STYLE");
    ex = document.getElementsByTagName("LINK");
    d = window.open().document; /*set base href*/
    d.open();
    d.close();
    b = d.body;

    function trim(s) {
      return s.replace(/^\s*\n/, "").replace(/\s*$/, "");
    }

    function iff(a, b, c) {
      return b ? a + b + c : "";
    }

    function add(h) {
      b.appendChild(h);
    }

    function makeTag(t) {
      return d.createElement(t);
    }

    function makeText(tag, text) {
      t = makeTag(tag);
      t.appendChild(d.createTextNode(text));
      return t;
    }
    add(makeText("style", "iframe{width:100%;height:18em;border:1px solid;"));
    add(makeText("h3", (d.title = "Style sheets in " + location.href)));
    for (i = 0; i < s.length; ++i) {
      add(
        makeText("h4", "Inline style sheet" + iff(' title="', s[i].title, '"'))
      );
      add(makeText("pre", trim(s[i].innerHTML)));
    }
    for (i = 0; i < ex.length; ++i) {
      rs = ex[i].rel.split(" ");
      for (j = 0; j < rs.length; ++j)
        if (rs[j].toLowerCase() == "stylesheet") {
          add(
            makeText(
              "h4",
              'link rel="' +
                ex[i].rel +
                '" href="' +
                ex[i].href +
                '"' +
                iff(' title="', ex[i].title, '"')
            )
          );
          iframe = makeTag("iframe");
          iframe.src = ex[i].href;
          add(iframe);
          break;
        }
    }
  },
};
