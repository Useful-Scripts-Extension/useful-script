export function whatFont() {
  let d = document;
  var e = d.createElement("script");
  e.setAttribute("type", "text/javascript");
  e.setAttribute("charset", "UTF-8");
  e.setAttribute(
    "src",
    "//www.typesample.com/assets/typesample.js?r=" + Math.random() * 99999999
  );
  e.onload = () => {
    alert("Script loaded, now use can use WhatFont.");
  };
  e.onerror = (event) => {
    alert("ERROR: " + event.message);
  };
  d.body.appendChild(e);
}
