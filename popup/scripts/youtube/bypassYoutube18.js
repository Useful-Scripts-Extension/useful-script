export function bypassYoutube18() {
  if (window.location.host === "www.youtube.com") {
    let option = window.prompt(
      `Options:
    1: replace 'watch?v=' with 'v/'
    2: replace 'watch?v=' with 'embed/'
    3: replace 'youtube' with 'nsfwyoutube'
    4: replace 'youtube' with 'listenonrepeat'
    5: replace 'youtube' with 'puritube'
    6: replace 'youtube' with 'ssyoutube'
    7: replace 'youtube' with 'pwnyoutube'

    Your Choice:`,
      0
    );
    if (!option) return;

    switch (option) {
      case "1":
        window.open(document.URL.replace("watch?v=", "v/"));
        break;
      case "2":
        window.open(document.URL.replace("watch?v=", "embed/"));
        break;
      case "3":
        window.open(document.URL.replace("youtube", "nsfwyoutube"));
        break;
      case "4":
        window.open(document.URL.replace("youtube", "listenonrepeat"));
        break;
      case "5":
        window.open(document.URL.replace("youtube", "puritube"));
        break;
      case "6":
        window.open(document.URL.replace("youtube", "ssyoutube"));
        break;
      case "7":
        window.open(document.URL.replace("youtube", "pwnyoutube"));
        break;
      default:
        alert("Wrong choice");
    }
  } else {
    alert("Can only used in www.youtube.com");
  }
}
