(async () => {
  let key = "activeScripts";
  let ids = (await chrome.storage.sync.get([key]))?.[key];
  window.dispatchEvent(
    new CustomEvent("ufs-run-page-scripts", {
      detail: {
        event: "onDocumentEnd",
        ids: ids.split(","),
      },
    })
  );
})();
