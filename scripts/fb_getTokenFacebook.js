export default {
  icon: `<i class="fa-solid fa-key"></i>`,
  name: {
    en: "Get fb token EAAB (instagram)",
    vi: "Lấy fb token EAAB (instagram)",
  },
  description: {
    en: "Get facebook access token from www.facebook.com",
    vi: "Lấy facebook access token từ trang www.facebook.com",
  },
  blackList: [],
  whiteList: ["*://www.facebook.com"],

  func: function () {
    try {
      let uid = /(?<=c_user=)(\d+)/.exec(document.cookie)?.[0];
      if (!uid) {
        alert("Không tìm thấy uid trong cookie. Bạn đã đăng nhập chưa?");
        return;
      }
      let dtsg =
          require("DTSGInitialData").token ||
          document.querySelector('[name="fb_dtsg"]').value,
        xhr = new XMLHttpRequest(),
        url = "//www.facebook.com/v1.0/dialog/oauth/confirm",
        params =
          "fb_dtsg=" +
          dtsg +
          "&app_id=124024574287414&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&_CONFIRM=1&_user=" +
          uid;
      xhr.open("POST", url, !0);
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (4 == xhr.readyState && 200 == xhr.status) {
          var a = xhr.responseText.match(/(?<=access_token=)(.*?)(?=\&)/);
          console.log(xhr.responseText);
          if (a && a[0]) {
            prompt("Token", a[0]);
          } else {
            alert("Failed to Get Access Token.");
          }
        }
      };
      xhr.send(params);
    } catch (e) {
      alert("ERROR: " + e);
    }
  },
};

function backup() {
  // https://isharevn.net/chia-se-cach-get-token-facebook-update-time.html
  // view-source:https://www.facebook.com/dialog/oauth?client_id=124024574287414&redirect_uri=https://www.instagram.com/accounts/signup/&&scope=email&response_type=token
}
