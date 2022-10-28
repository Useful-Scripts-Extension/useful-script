export function addNumberColumn() {
  function has(par, ctag) {
    for (var k = 0; k < par.childNodes.length; ++k)
      if (par.childNodes[k].tagName == ctag) return true;
  }

  function add(par, ctag, text) {
    var c = document.createElement(ctag);
    c.appendChild(document.createTextNode(text));
    par.insertBefore(c, par.childNodes[0]);
  }
  var i,
    ts = document.getElementsByTagName("TABLE");
  for (i = 0; i < ts.length; ++i) {
    var n = 0,
      trs = ts[i].rows,
      j,
      tr;
    for (j = 0; j < trs.length; ++j) {
      tr = trs[j];
      if (has(tr, "TD")) add(tr, "TD", ++n);
      else if (has(tr, "TH")) add(tr, "TH", "Row");
    }
  }
}
