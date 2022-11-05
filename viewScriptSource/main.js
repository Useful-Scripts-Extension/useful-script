window.onload = () => {
  document.querySelector("#copy-btn").onclick = copy;

  let sharedData;
  try {
    sharedData = JSON.parse(localStorage.viewScriptSource_sharedData);
    const { name, source, description } = sharedData;
    if (name && source) {
      document.title = "Useful-script / " + name + " / " + description;
      document.querySelector("code").innerHTML = source;
      hljs.highlightAll();
    }
  } catch (e) {}
  // delete localStorage.viewScriptSource_sharedData;
};

function copy() {
  var copyText = document.querySelector("code").innerText;
  navigator.clipboard.writeText(copyText);
  alert("Copied");
}
