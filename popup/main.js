setTimeout(
  () =>
    import("./index.js").then(() => {
      document.querySelector("#loading-fullscreen")?.remove();
    }),
  0
);
