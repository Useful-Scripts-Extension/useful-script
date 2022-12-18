(async () => {
  let ids = localStorage.getItem("activeScripts") || "";
  window.dispatchEvent(
    new CustomEvent("ufs-run-page-scripts", {
      detail: {
        event: "onDocumentIdle",
        ids: ids.split(","),
      },
    })
  );
})();
