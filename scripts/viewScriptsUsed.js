export default {
  icon: `<i class="fa-brands fa-square-js fa-lg"></i>`,
  name: {
    en: "View scripts used",
    vi: "Xem tất cả scripts",
  },
  description: {
    en: "View all scripts used in current website",
    vi: "Mở danh sách scripts đươc dùng bởi trang web trong tab mới",
  },

  onClick: function () {
    s = document.getElementsByTagName("SCRIPT");
    d = window.open().document;
    d.open();
    d.close();
    b = d.body;

    function trim(s) {
      return s.replace(/^\s*\n/, "").replace(/\s*$/, "");
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
    add(makeText("h3", (d.title = "Scripts in " + location.href)));
    for (i = 0; i < s.length; ++i) {
      if (s[i].src) {
        add(makeText("h4", 'script src="' + s[i].src + '"'));
        iframe = makeTag("iframe");
        iframe.src = s[i].src;
        add(iframe);
      } else {
        add(makeText("h4", "Inline script"));
        add(makeText("pre", trim(s[i].innerHTML)));
      }
    }
  },
};

// export function viewScriptsUsed() {
//   let scripts = document.getElementsByTagName("SCRIPT"),
//     tx = "",
//     sr = [];

//   for (i = 0; i < scripts.length; i++) {
//     let script = scripts.item(i);
//     if (script.text) tx += script.text;
//     else sr.push(script.src);
//   }

//   newTab = window.open();
//   newTab.document.write(
//     `<textarea id="t" style='width="99%";height="99%";borderStyle="none";'>
//         ${sr.join("\n")}\n\n-----\n\n${tx}
//         </textarea>

//         <script src="https://beautifier.io/js/lib/beautify.js"></script>
//         <script>
//             with(document.getElementById("t")){
//                 value = js_beautify(value);
//             };
//         </script>`
//   );
//   newTab.document.close();
// }
