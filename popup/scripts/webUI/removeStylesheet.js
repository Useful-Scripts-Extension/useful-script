export function removeStylesheet() {
  var i, x;
  for (i = 0; (x = document.styleSheets[i]); ++i) x.disabled = true;
}
