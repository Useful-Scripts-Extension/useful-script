window.onload = () => {
  let sharedData;
  try {
    sharedData = JSON.parse(localStorage.viewScriptSource_sharedData);
    const { name, source, description, id } = sharedData;
    if (name && source) {
      let title = "Useful-script / " + name + " / " + description;
      let comment = `// ${name}\n// ${description}\n\n`;
      let sourceCode = source.replace("function ", "function " + (id || "_"));

      document.querySelector("#copy-btn").onclick = () => copy(sourceCode);

      document.title = title;
      document.querySelector("code").innerHTML = comment + sourceCode;

      hljs.highlightAll();
    }
  } catch (e) {}
  // delete localStorage.viewScriptSource_sharedData;
};

function copy(text) {
  navigator.clipboard.writeText(text);
  alert("Copied");
}
