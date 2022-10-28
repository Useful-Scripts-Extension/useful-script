export function checkWebDie() {
  let url = prompt("Enter web url to check", location.hostname);
  window.open("https://downforeveryoneorjustme.com/" + url);
}
