export function listAllImagesInWeb() {
  var A = {},
    B = [],
    D = document,
    i,
    e,
    a,
    k,
    y,
    s,
    m,
    u,
    t,
    r,
    j,
    v,
    h,
    q,
    c,
    G;
  G = open().document;
  G.open();
  G.close();

  function C(t) {
    return G.createElement(t);
  }

  function P(p, c) {
    p.appendChild(c);
  }

  function T(t) {
    return G.createTextNode(t);
  }
  for (i = 0; (e = D.images[i]); ++i) {
    a = e.getAttribute("alt");
    k = escape(e.src) + "%" + (a != null) + a;
    if (!A[k]) {
      y = !!a + (a != null);
      s = C("span");
      s.style.color = ["red", "gray", "green"][y];
      s.style.fontStyle = ["italic", "italic", ""][y];
      P(s, T(["missing", "empty", a][y]));
      m = e.cloneNode(true);
      if (G.importNode) m = G.importNode(m, true);
      if (m.width > 350) m.width = 350;
      B.push([0, 7, T(e.src.split("/").reverse()[0]), m, s]);
      A[k] = B.length;
    }
    u = B[A[k] - 1];
    u[1] = T(++u[0]);
  }
  t = C("table");
  t.border = 1;
  r = t.createTHead().insertRow(-1);
  for (j = 0; (v = ["#", "Filename", "Image", "Alternate text"][j]); ++j) {
    h = C("th");
    P(h, T(v));
    P(r, h);
  }
  for (i = 0; (q = B[i]); ++i) {
    r = t.insertRow(-1);
    for (j = 1; (v = q[j]); ++j) {
      c = r.insertCell(-1);
      P(c, v);
    }
  }
  P(G.body, t);
}
