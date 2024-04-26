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

  window.runScripts = runScripts;
  function runScripts(scriptIds, event, path) {
    CACHED.activeScriptIds = scriptIds;
    CACHED.path = path;

    for (let id of scriptIds.filter((_) => _)) {
      let scriptPath = `${path}${id}.js`;
      import(scriptPath)
        .then(({ default: script }) => {
          try {
            if (
              event in script &&
              typeof script[event] === "function" &&
              checkWillRun(script)
            ) {
              console.log("> Useful-script: Run script " + id + " " + event);
              script[event]();
            }
          } catch (e) {
            console.log("ERROR run script " + id + " " + event, e);
          }
        })
        .catch((e) => {
          console.log("ERROR import script ", e);
        });
    }
  }

  function checkWillRun(script) {
    let url = location.href;
    let hasWhiteList = script.whiteList?.length > 0;
    let hasBlackList = script.blackList?.length > 0;
    let inWhiteList = matchOneOfPatterns(url, script.whiteList || []);
    let inBlackList = matchOneOfPatterns(url, script.blackList || []);
    return (
      (!hasWhiteList && !hasBlackList) ||
      (hasWhiteList && inWhiteList) ||
      (hasBlackList && !inBlackList)
    );
  }

  function matchOneOfPatterns(url, patterns) {
    for (let pattern of patterns) {
      const regex = new RegExp(
        "^" +
          pattern
            .split("*")
            .map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join(".*") +
          "$"
      );
      if (regex.test(url)) return true;
    }
    return false;
  }
})();
