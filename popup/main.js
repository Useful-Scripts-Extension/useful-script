import("./index.js").then(() => {
  document.querySelector("#loading-fullscreen")?.remove();
});

import("../scripts/content-scripts/ufs_global.js", (success, fail) => {
  if (success) console.log("UfsGlobal injected");
  else console.log("UfsGlobal injection failed: ", fail);
});
