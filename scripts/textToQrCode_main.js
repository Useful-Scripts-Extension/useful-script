window.onload = () => {
  let qrcode = new QRCode(document.getElementById("qrcode"), {
    width: 240,
    height: 240,
  });
  let qrwords = "Useful scripts";
  if (location.hash) {
    let hash = location.hash.slice(1);
    if (hash) {
      try {
        hash = decodeURIComponent(hash);
        qrwords = hash;
      } catch (e) {}
    }
  }
  let text = document.querySelector("#inp-text");
  function makeCode() {
    qrcode.makeCode(text.value);
  }
  text.value = qrwords;
  text.addEventListener("input", (_) => makeCode());
  makeCode();
};
