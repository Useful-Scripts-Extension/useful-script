window.onload = () => {
  // get url from params
  const src = new URLSearchParams(window.location.search).get("src");
  const img = document.querySelector("img");
  const input = document.querySelector("input");

  if (src) {
    let largestSrc =
      UsefulScriptGlobalPageContext.Utils.getLargestImageSrc(src);
    img.src = largestSrc;
    input.value = largestSrc;
  }

  input.addEventListener("input", () => {
    img.src = input.value;
    window.history.replaceState(null, null, "?src=" + input.value);
  });
};
