export function getTokenBusiness() {
  if (window.location.host !== "business.facebook.com") {
    alert(
      "Bookmark này chỉ hoạt động trên trang https://business.facebook.com/content_management/\nBạn hãy vào trang web trên và ấn lại bookmark để lấy token an toàn nhé."
    );
    window.open("https://business.facebook.com/content_management/");
    return;
  }

  try {
    const accessToken =
      "EAAG" + /(?<=EAAG)(.*?)(?=\")/.exec(document.body.textContent)[0];
    window.prompt("Access Token của bạn:", accessToken);
  } catch (e) {
    alert("LỖI: " + e.message);
  }
}
