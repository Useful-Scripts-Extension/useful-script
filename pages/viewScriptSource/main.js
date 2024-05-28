import { disableSmoothScrollSaver } from "../../popup/helpers/storage.js";
import { enableSmoothScroll } from "../../scripts/smoothScroll.js";

window.onload = async () => {
  if (!disableSmoothScrollSaver.get()) enableSmoothScroll();
  try {
    let id = new URL(location.href).searchParams.get("file");
    let source = await getScriptSource(id);

    if (source) {
      let fileName = id + ".js";
      let comment = "// File: " + fileName;

      document.querySelector("#copy-btn").onclick = () => copy(source);
      document.querySelector("code").innerHTML =
        comment + "\n\n" + escapeHTML(source);
      document.title = fileName;

      hljs.highlightAll();
      hljs.initLineNumbersOnLoad();
    }
  } catch (e) {}
};

function copy(text) {
  navigator.clipboard.writeText(text);
  alert("Copied");
}

// https://stackoverflow.com/a/26276924/11898496
async function getScriptSource(scriptId) {
  try {
    let fileName = scriptId + ".js";
    let path = "/scripts/" + fileName;
    let res = await fetch(path);
    let source = await res.text();
    return source;
  } catch (e) {
    return "// Không lấy được source code\n// Cannot load source code";
  }
}

// https://stackoverflow.com/a/6234804/11898496
function escapeHTML(unsafe_str) {
  return unsafe_str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/\'/g, "&#39;")
    .replace(/\//g, "&#x2F;");
}
