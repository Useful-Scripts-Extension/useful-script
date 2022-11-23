// https://mmazzarolo.com/blog/2022-02-16-track-down-the-javascript-code-responsible-for-polluting-the-global-scope/

window.__globalsDebugger__ = (function createGlobalsDebugger() {
  const globalsToInspect = [];
  const inspectedGlobals = [];
  function addGlobalToInspect(globalName) {
    if (!globalsToInspect.includes(globalName)) {
      globalsToInspect.push(globalName);
    }
    Object.defineProperty(window, globalName, {
      get: function () {
        return window[`__globals-debugger-proxy-for-${globalName}__`];
      },
      set: function (value) {
        if (!inspectedGlobals.includes(globalName)) {
          inspectedGlobals.push(globalName);
          console.trace();
          debugger;
        }
        window[`__globals-debugger-proxy-for-${globalName}__`] = value;
      },
      configurable: true,
    });
  }
  const parsedUrl = new URL(window.location.href);
  (parsedUrl.searchParams.get("globalsToInspect") || "")
    .split(",")
    .filter(Boolean)
    .forEach((globalToInspect) => addGlobalToInspect(globalToInspect));
  return {
    addGlobalToInspect,
  };
})();
