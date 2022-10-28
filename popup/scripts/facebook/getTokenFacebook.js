export function getTokenFacebook() {
  if (window.location.host !== "m.facebook.com") {
    alert(
      "Bookmark này chỉ hoạt động trên trang m.facebook.com\nBạn hãy vào trang m.facebook.com và ấn lại bookmark để lấy token an toàn nhé."
    );
    window.open("https://m.facebook.com");
    return;
  }
  console.log("Đang lấy token ...");
  fetch("https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed")
    .then((response) => response.text())
    .then((text) => {
      if ("<" == text[0]) {
        alert("Chưa đăng nhập. Bạn cần đăng nhập fb thì mới lấy được token.");
      } else {
        const data = {
          token: /(?<=accessToken\\":\\")(.*?)(?=\\")/.exec(text)[0],
          fb_dtsg: /(?<=fb_dtsg\\" value=\\")(.*?)(?=\\")/.exec(text)[0],
          id: /(?<=USER_ID\\":\\").*?(?=\\",\\")/gm.exec(text)[0],
        };
        console.log(data);
        window.prompt("Access Token của bạn:", data.token);
      }
    });
}
