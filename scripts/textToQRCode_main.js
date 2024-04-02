window.onload = () => {
  let input = document.getElementById("text");
  let qrcode = new QRCode("qrcode");

  let textFromUrl = new URLSearchParams(window.location.search).get("text");
  if (textFromUrl) {
    qrcode.makeCode(textFromUrl);
    input.value = textFromUrl;
  }

  input.addEventListener("keyup", (event) => {
    qrcode.makeCode(event.target.value);
  });
  input.addEventListener("blur", (event) => {
    qrcode.makeCode(event.target.value);
  });

  window.resizeTo(400, 400);
};
