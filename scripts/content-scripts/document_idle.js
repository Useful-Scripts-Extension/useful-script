(async () => {
  window.dispatchEvent(
    new CustomEvent("ufs-run-page-scripts", {
      detail: { event: "onDocumentIdle" },
    })
  );
})();
