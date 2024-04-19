import("./index.js").then(() => {
  document.querySelector("#loading-fullscreen")?.remove();
});

import("../scripts/content-scripts/ufs_global_webpage_context.js").then(() => {
  console.log("loaded ufs_global_webpage_context");
});

console.log(chrome.power, chrome.notifications);
