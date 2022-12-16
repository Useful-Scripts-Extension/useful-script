(async () => {
  const params = new URLSearchParams(
    document.currentScript.src.split("?")?.[1]
  );
  console.log(params);

  let param_ids = params.get("ids");
  let path = params.get("path");
  let event = params.get("event");

  if (param_ids) {
    let ids = param_ids.split(",");
    for (let id of ids) {
      import(path + "/" + id + ".js").then((script) => {
        script[event]?.();
      });
    }
  }
})();
