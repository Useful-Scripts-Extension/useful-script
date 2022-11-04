export default {
  icon: `<i class="fa-solid fa-key"></i>`,
  name: {
    en: "Get fb Token (www.facebook.com)",
    vi: "Lấy fb Token (www.facebook.com)",
  },
  description: {
    en: "Get facebook access token from www.facebook.com",
    vi: "Lấy facebook access token từ trang www.facebook.com",
  },
  blackList: [],
  whiteList: ["www.facebook.com"],

  func: function () {
    var uid = /(?<=c_user=)(\d+)/.exec(document.cookie)[0],
      dtsg =
        require("DTSGInitialData").token ||
        document.querySelector('[name="fb_dtsg"]').value,
      http = new XMLHttpRequest(),
      url = "//www.facebook.com/v1.0/dialog/oauth/confirm",
      params =
        "fb_dtsg=" +
        dtsg +
        "&app_id=124024574287414&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&_CONFIRM=1&_user=" +
        uid;
    http.open("POST", url, !0),
      http.setRequestHeader(
        "Content-type",
        "application/x-www-form-urlencoded"
      ),
      (http.onreadystatechange = function () {
        if (4 == http.readyState && 200 == http.status) {
          var a = http.responseText.match(/(?<=access_token=)(.*?)(?=\&)/);
          console.log(http.responseText);
          if (a && a[0]) {
            prompt("Token", a[0]);
          } else {
            alert("Failed to Get Access Token.");
          }
        }
      }),
      http.send(params);
  },
};

export function getTokenFacebook() {}
