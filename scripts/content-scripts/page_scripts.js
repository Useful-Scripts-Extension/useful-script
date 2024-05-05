(() => {
  const CACHED = {
    activeScriptIds: [],
    path: "",
  };

  // run script on receive event
  window.addEventListener("ufs-run-page-scripts", async ({ detail }) => {
    console.log("ufs-run-page-scripts", detail);
    runScripts(CACHED.activeScriptIds, detail.event, CACHED.path);
  });

  window.ufs_runScripts = runScripts;
  function runScripts(scriptIds, event, path) {
    CACHED.activeScriptIds = scriptIds;
    CACHED.path = path;

    for (let id of scriptIds.filter((_) => _)) {
      let scriptPath = `${path}${id}.js`;
      import(scriptPath)
        .then(({ default: script }) => {
          try {
            if (
              typeof script?.["pageScript"]?.[event] === "function" &&
              UfsGlobal.Extension.checkWillRun(script)
            ) {
              console.log(
                "> Useful-script: Run page-script " + id + " " + event
              );
              script["pageScript"][event]();
            }
          } catch (e) {
            console.log("ERROR run page-script " + id + " " + event, e);
          }
        })
        .catch((e) => {
          console.log("ERROR import page-script ", e);
        });
    }
  }
})();
