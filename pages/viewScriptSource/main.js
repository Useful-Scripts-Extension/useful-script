window.onload = async () => {
  try {
    let scriptId = localStorage.viewScriptSource_sharedData;
    let source = await getScriptSource(scriptId);

    if (source) {
      document.querySelector("#copy-btn").onclick = () => copy(source);
      document.querySelector("code").innerHTML = escapeHTML(source);
      document.title = scriptId + ".js";

      hljs.highlightAll();
      hljs.initLineNumbersOnLoad();
    }
  } catch (e) {}
  // delete localStorage.viewScriptSource_sharedData;
};

function copy(text) {
  navigator.clipboard.writeText(text);
  alert("Copied");
}

// https://stackoverflow.com/a/26276924/11898496
async function getScriptSource(scriptId) {
  let fileName = scriptId + ".js";
  let path = "/scripts/" + fileName;
  let res = await fetch(path);
  let source = await res.text();
  return source;
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
