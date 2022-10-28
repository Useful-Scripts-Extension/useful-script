export function webToQRCode() {
  var url =
    "http://chart.apis.google.com/chart?cht=qr&chs=300x300&chl=" +
    encodeURIComponent(location.href);
  w = open(
    url,
    "w",
    "location=no,status=yes,menubar=no,scrollbars=no,resizable=yes,width=500,height=500,modal=yes,dependent=yes"
  );
  if (w) {
    setTimeout("w.focus()", 1000);
  } else {
    location = url;
  }
}
