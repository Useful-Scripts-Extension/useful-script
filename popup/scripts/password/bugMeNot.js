export function bugMeNot() {
  var url = "http://www.bugmenot.com/view/" + escape(location.hostname);
  w = open(
    url,
    "w",
    "location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=500,height=400,modal=yes,dependent=yes"
  );
  if (w) {
    setTimeout("w.focus()", 1000);
  } else {
    location = url;
  }
}
