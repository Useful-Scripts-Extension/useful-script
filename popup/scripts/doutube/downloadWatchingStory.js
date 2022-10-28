export function downloadWatchingStory() {
  const src = document.querySelector("video")?.src;
  if (src) window.open(src);
  else alert("Không tìm thấy video story nào");
}
