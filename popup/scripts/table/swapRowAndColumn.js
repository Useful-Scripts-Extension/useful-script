export default {
  name: {
    en: "Swap rows and columns",
    vi: "Đổi chỗ hàng và cột",
  },
  description: {
    en: "Swap rows and columns (transpose)",
    vi: "Hàng thành cột và cột thành hàng",
  },
  func() {
    var d = document,
      q = "table",
      i,
      j,
      k,
      y,
      r,
      c,
      t;
    for (i = 0; (t = d.getElementsByTagName(q)[i]); ++i) {
      var w = 0,
        N = t.cloneNode(0);
      N.width = "";
      N.height = "";
      N.border = 1;
      for (j = 0; (r = t.rows[j]); ++j)
        for (y = k = 0; (c = r.cells[k]); ++k) {
          var z,
            a = c.rowSpan,
            b = c.colSpan,
            v = c.cloneNode(1);
          v.rowSpan = b;
          v.colSpan = a;
          v.width = "";
          v.height = "";
          if (!v.bgColor) v.bgColor = r.bgColor;
          while (w < y + b) N.insertRow(w++).p = 0;
          while (N.rows[y].p > j) ++y;
          N.rows[y].appendChild(v);
          for (z = 0; z < b; ++z) N.rows[y + z].p += a;
          y += b;
        }
      t.parentNode.replaceChild(N, t);
    }
  },
};
