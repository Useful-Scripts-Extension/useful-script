// run all scripts that has onDocumentStart event
(async () => {
  window.dispatchEvent(
    new CustomEvent("ufs-run-page-scripts", {
      detail: { event: "onDocumentStart" },
    })
  );
})();
