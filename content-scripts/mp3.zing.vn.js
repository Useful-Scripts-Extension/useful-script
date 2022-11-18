// prevent auto redirect from https://mp3.zing.vn/ to https://zingmp3.vn/
window.MP3_MEDIA_USER_UPLOAD = 1;

window.onload = () => {
  if (window.MP3) {
    window.MP3.ACCOUNT_ID = new Date().getTime();
    window.MP3.ACCOUNT_NAME = "VIP - Useful scripts";
    window.MP3.VIP = 1;
    window.MP3.IS_IP_VN = false;
  }

  window.checkLogin = () => true;

  if (window.ZVip) {
    window.ZVip.isVip = 1;
    window.ZVip.vip = 1;
  }
};
