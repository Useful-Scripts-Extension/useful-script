import { showLoading } from "./helpers/utils.js";

export default {
  icon: `<i class="fa-solid fa-key"></i>`,
  name: {
    en: "Get fb token EAAB (campaigns)",
    vi: "Lấy fb token EAAB (campaigns)",
  },
  description: {
    en: "Get fb token EAAG from www.facebook.com campaigns",
    vi: "Lấy fb token EAAG từ www.facebook.com campaigns",
  },
  runInExtensionContext: true,

  func: function () {
    // Source code extracted from https://chrome.google.com/webstore/detail/get-token-cookie/naciaagbkifhpnoodlkhbejjldaiffcm/related

    async function getToken() {
      try {
        let res = await fetch(
          "https://www.facebook.com/adsmanager/manage/campaigns"
        );
        let htmlText = await res.text();
        if (-1 != htmlText.search("EAA")) {
          var regex_result = htmlText.match(/EAAB.*?\"/),
            token = regex_result[0] ? regex_result[0].replace(/\W/g, "") : "";
          return token;
        }
        for (
          var regex_value, act, regex = /campaigns\?act=(.*?)&/g;
          null !== (regex_value = regex.exec(htmlText));

        )
          regex_value.index === regex.lastIndex && regex.lastIndex++,
            regex_value.forEach(function (_value, _index) {
              1 == _index && (act = _value);
            });
        if (act) {
          let res = await fetch(
            `https://www.facebook.com/adsmanager/manage/campaigns?act=${act}&nav_source=no_referrer`
          );
          let htmlText = await res.text();
          if (-1 == htmlText.search("EAA")) return resolve("");
          var regex_result = htmlText.match(/EAAB.*?\"/),
            token = regex_result[0] ? regex_result[0].replace(/\W/g, "") : "";
          return token;
        }
      } catch (e) {
        alert("Error: " + e);
      }
      return "";
    }

    (async () => {
      const { closeLoading } = showLoading("Đang lấy access token...");
      let token = await getToken();
      if (token) {
        prompt("Access token: ", token);
      } else {
        alert("Không tìm thấy access token");
      }
      closeLoading();
    })();
  },
};

function backup() {
  (() => {
    var GetToken = (callback) => {
      var fb_dtsg = require("DTSG_ASYNC").getToken();
      var http = new XMLHttpRequest();
      var data = new FormData();
      data.append("fb_dtsg", fb_dtsg);
      data.append("app_id", "124024574287414");
      data.append("redirect_uri", "fbconnect://success");
      data.append("display", "popup");
      data.append("ref", "Default");
      data.append("return_format", "access_token");
      data.append("sso_device", "ios");
      data.append("__CONFIRM__", "1");
      http.open("POST", "/v1.0/dialog/oauth/confirm");
      http.send(data);
      http.onreadystatechange = function () {
        console.log(http.responseText);
        if (http.readyState == 4 && http.status == 200)
          callback(http.responseText.match(/access_token=(.*?)&/)?.[1]);
      };
    };
    GetToken(console.log);
  })();

  var uid = document.cookie.match(/c_user=(\d+)/)[1],
    dtsg = require("DTSG_ASYNC").getToken(),
    http = new XMLHttpRequest(),
    url = "//www.facebook.com/v1.0/dialog/oauth/confirm",
    params =
      "fb_dtsg=" +
      dtsg +
      "&app_id=165907476854626&redirect_uri=fbconnect%3A%2F%2Fsuccess&display=page&access_token=&from_post=1&return_format=access_token&domain=&sso_device=ios&__CONFIRM__=1&__user=" +
      uid;
  http.open("POST", url, !0),
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded"),
    (http.onreadystatechange = function () {
      if (4 == http.readyState && 200 == http.status) {
        var a = http.responseText.match(/access_token=(.*)(?=&expires_in)/);
        (a = a
          ? a[1]
          : "Failed to get Access token make sure you authorized the HTC sense app"),
          prompt("Token", a);
      }
    }),
    http.send(params);
}
