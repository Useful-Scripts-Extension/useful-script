export function darkModePDF() {
  var cover = document.createElement("div");
  let css = `position: fixed;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fffbfbcf;
    mix-blend-mode: difference;
    z-index: 1;`;
  cover.setAttribute("style", css);
  document.body.appendChild(cover);
}
