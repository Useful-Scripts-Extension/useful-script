window.onload = () => {
  document.querySelector("#copy-btn").onclick = copy;

  let sharedData;
  try {
    sharedData = JSON.parse(localStorage.viewScriptSource_sharedData);
    const { name, source, description, id } = sharedData;
    if (name && source) {
      let title = "Useful-script / " + name + " / " + description;
      let comment = `// ${name}\n// ${description}\n\n`;
      let sourceCode = source.replace("function ", "function " + (id || "_"));

      document.title = title;
      document.querySelector("code").innerHTML = comment + sourceCode;

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
