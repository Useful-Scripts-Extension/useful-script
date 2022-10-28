export function enableDownloadVideo() {
  Array.from(document.querySelectorAll("video")).map(
    (_) => (_.attributes.controlslist.value = "nofullscreen noremoteplayback")
  );
}
