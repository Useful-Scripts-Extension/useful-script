(() => {
  const CACHED = {
    activeScriptIds: [],
    path: "",
  };

  window.ufs_runScripts = runScripts;
  function runScripts(scriptIds, event, path, details) {
    CACHED.activeScriptIds = scriptIds;
    CACHED.path = path;

    for (let id of scriptIds.filter((_) => _)) {
      let scriptPath = `${path}${id}.js`;
      import(scriptPath)
        .then(({ default: script }) => {
          try {
            const s = script?.pageScript;
            const fn = s?.[event];
            if (
              typeof fn === "function" &&
              (s.runInAllFrames || details.frameType == "outermost_frame") &&
              UfsGlobal.Extension.checkWillRun(script)
            ) {
              console.log(
                "> Useful-script: Run page-script " + id + " " + event
              );
              fn(details);
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
