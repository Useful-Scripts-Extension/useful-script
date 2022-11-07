export default {
  icon: `<i class="fa-solid fa-laptop-code"></i>`,
  name: {
    en: "View source code of selected area",
    vi: "Xem mã nguồn của phần bôi đen",
  },
  description: {
    en: "Just select the area and use this bookmarklet",
    vi: "Mở mã nguồn của phần được bôi đen trong tab mới",
  },

  func: function () {
    const options = [
      {
        name: "HTML",
        func: () => {
          function getSelSource() {
            x = document.createElement("div");
            x.appendChild(window.getSelection().getRangeAt(0).cloneContents());
            return x.innerHTML;
          }

          function makeHR() {
            return nd.createElement("hr");
          }

          function makeParagraph(text) {
            p = nd.createElement("p");
            p.appendChild(nd.createTextNode(text));
            return p;
          }

          function makePre(text) {
            p = nd.createElement("pre");
            p.appendChild(nd.createTextNode(text));
            return p;
          }
          nd = window.open().document;
          ndb = nd.body;
          if (
            !window.getSelection ||
            !window.getSelection().rangeCount ||
            window.getSelection().getRangeAt(0).collapsed
          ) {
            nd.title = "Generated Source of: " + location.href;
            ndb.appendChild(
              makeParagraph(
                "No selection, showing generated source of entire document."
              )
            );
            ndb.appendChild(makeHR());
            ndb.appendChild(
              makePre(
                "<html>\n" + document.documentElement.innerHTML + "\n</html>"
              )
            );
          } else {
            nd.title = "Partial Source of: " + location.href;
            ndb.appendChild(makePre(getSelSource()));
          }
        },
      },
      {
        name: "CSS",
        func: () => {
          javascript: (function () {
            function A(n, g) {
              var p = n.parentNode,
                t = n.tagName;
              if (!p) return "";
              if (!t) return A(p, g);
              var T = t.toUpperCase(),
                b = T != "TABLE" && T != "TBODY" && T != "THEAD" && T != "TR",
                c = n.className,
                i = n.id;
              return (
                A(p, " > ") +
                (b ? T : T.toLowerCase()) +
                (c ? "." + c : "") +
                (i ? "#" + i : "") +
                (b ? g : " ")
              );
            }
            document.onmouseover = function (e) {
              e = e ? e : event;
              var s,
                g = e.target;
              g = g ? g : e.srcElement;
              try {
                s = A(g, "") + " (click for computed styles)";
              } catch (err) {
                s = err.message;
              }
              window.status = s;
              return true;
            };
            window.status = A(document.documentElement, "");
            var newSS,
              styles = "* { cursor: crosshair; }";
            newSS = document.createElement("link");
            newSS.rel = "stylesheet";
            newSS.type = "text/css";
            newSS.href = "data:text/css," + escape(styles);
            document.getElementsByTagName("head")[0].appendChild(newSS);
            document.onclick = function (e) {
              e = e ? e : event;
              var s,
                g = e.target;
              g = g ? g : e.srcElement;
              var x = window.open("", "computedStyles");
              x.document.open();
              x.document.close();
              var d = x.document;
              x.onunload = function () {
                document.onclick = null;
                document.onmouseover = null;
                window.status = null;
                newSS.href = "data:text/css,";
              };
              function sp(n, t, col) {
                var r = d.createElement(n);
                r.appendChild(d.createTextNode(t));
                if (col) r.style.color = col;
                return r;
              }
              var typeIndex = {
                top: 1,
                bottom: 1,
                height: 1,
                width: 1,
                left: 1,
                right: 1,
                position: 0,
                display: 0,
                "-moz-appearance": 0,
                "-moz-box-sizing": 0,
              };
              var colors = ["red", "green", "black"];
              function undirect(v) {
                return v.replace(/\-(left|top|bottom|right)/, "-*");
              }
              function diff(n, p) {
                pcs = p.ownerDocument.defaultView.getComputedStyle(p, "");
                ncs = n.ownerDocument.defaultView.getComputedStyle(n, "");
                var A = [];
                var B = {};
                var C = {};
                for (var i = 0; i < ncs.length; ++i) {
                  var e = ncs.item(i),
                    v = ncs.getPropertyValue(e),
                    pv = pcs.getPropertyValue(e);
                  if (v != pv) {
                    var u = undirect(e);
                    if (u.indexOf("-*") != -1) {
                      if (!B[u]) B[u] = [0, v];
                      if (B[u][1] == v) ++B[u][0];
                    }
                    A.push([typeIndex[e] != null ? typeIndex[e] : 2, e, v]);
                  }
                }
                A = A.sort();
                for (var u in B) if (B[u][0] == 4) C[u] = true;
                for (var i in A) {
                  var t = A[i],
                    e = t[1],
                    v = t[2],
                    u = undirect(e);
                  if (C[u]) {
                    if (t[1].indexOf("-left") != -1)
                      d.body.appendChild(sp("div", u + ": " + v, colors[t[0]]));
                  } else
                    d.body.appendChild(sp("div", e + ": " + v, colors[t[0]]));
                }
              }
              function info(n) {
                if (!n) return;
                if (n.tagName) {
                  d.body.appendChild(sp("h4", A(n, "")));
                  diff(
                    n,
                    n.parentNode.nodeType != "9"
                      ? n.parentNode
                      : d.documentElement
                  );
                }
                info(n.parentNode);
              }
              d.body.appendChild(
                sp(
                  "p",
                  "This shows how the computed style of each node differs from the computed style of its parent. The root element, which has no parent, is instead compared against the root of a blank HTML document."
                )
              );
              info(g);
              x.focus();
              e.preventDefault();
            };
          })();
        },
      },
    ];

    let choice = prompt(
      options.map((_, i) => `${i}: ${_.name}`).join("\n") +
        "\n\n- Your choice:",
      0
    );

    if (choice != null && choice >= 0 && choice < options.length) {
      options[choice]?.func?.();
    }
  },
};
