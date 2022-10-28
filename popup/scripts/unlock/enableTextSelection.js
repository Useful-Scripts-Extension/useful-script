export function enableTextSelection() {
  function R(a) {
    ona = "on" + a;
    if (window.addEventListener)
      window.addEventListener(
        a,
        function (e) {
          for (var n = e.originalTarget; n; n = n.parentNode) n[ona] = null;
        },
        true
      );
    window[ona] = null;
    document[ona] = null;
    if (document.body) document.body[ona] = null;
  }
  R("click");
  R("mousedown");
  R("mouseup");
  R("selectstart");
}
