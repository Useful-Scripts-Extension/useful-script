export default {
  icon: `<i class="fa-solid fa-shoe-prints"></i>`,
  name: {
    en: "Show hidden fields",
    vi: "Hiện các thành phần web bị ẩn",
  },
  description: {
    en: "Reveals hidden fields on a webpage. Find things like tokens, etc",
    vi: "Web thường ẩn mốt số thành phần như token, id, form, ...",
  },
  
  onClick: function () {
    // source code from: https://bookmarklet.vercel.app/

    var i,
      f,
      j,
      e,
      div,
      label,
      ne,
      found = false;
    for (i = 0; (f = document.forms[i]); ++i)
      for (j = 0; (e = f[j]); ++j)
        if (e.type == "hidden") {
          D = document;
          function C(t) {
            return D.createElement(t);
          }
          function A(a, b) {
            a.appendChild(b);
          }
          div = C("div");
          label = C("label");
          A(div, label);
          A(label, D.createTextNode(e.name + ": "));
          e.parentNode.insertBefore(div, e);
          e.parentNode.removeChild(e);
          ne = C("input");
          /*for ie*/ ne.type = "text";
          ne.value = e.value;
          A(label, ne);
          label.style.MozOpacity = ".6";
          --j; /*for moz*/

          found = true;
        }

    if (!found) alert("Nothing is hidden! / Không có thành phần nào bị ẩn!");
  },
};
