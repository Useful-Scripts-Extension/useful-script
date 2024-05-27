export default {
  icon: `<i class="fa-solid fa-key fa-lg"></i>`,
  name: {
    en: "Get fb token EAADo1 (messenger_for_android)",
    vi: "Lấy fb token EAADo1 (messenger_for_android)",
  },
  description: {
    en: "Get facebook access token from www.facebook.com",
    vi: "Lấy facebook access token từ trang www.facebook.com",
  },
  whiteList: ["https://*.facebook.com/*"],

  onClick: function () {
    try {
      let uid = /(?<=c_user=)(\d+)/.exec(document.cookie)?.[0];
      if (!uid) {
        alert("Không tìm thấy uid trong cookie. Bạn đã đăng nhập chưa?");
        return;
      }
      let dtsg = require("DTSGInitialData").token || document.querySelector('[name="fb_dtsg"]').value,
        xhr = new XMLHttpRequest(),
        data = new FormData(),
        url = `https://www.facebook.com/dialog/oauth/business/cancel/?app_id=256002347743983&version=v19.0&logger_id=&user_scopes[0]=email&user_scopes[1]=read_insights&user_scopes[2]=read_page_mailboxes&user_scopes[3]=pages_show_list&redirect_uri=fbconnect%3A%2F%2Fsuccess&response_types[0]=token&response_types[1]=code&display=page&action=finish&return_scopes=false&return_format[0]=access_token&return_format[1]=code&tp=unspecified&sdk=&selected_business_id=&set_token_expires_in_60_days=false`;
      data.append('fb_dtsg', dtsg);

      xhr.open("POST", url, !0);
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
      xhr.send(data);
    } catch (e) {
      alert("ERROR: " + e);
    }
  },
};