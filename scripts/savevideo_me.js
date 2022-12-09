import { getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: `https://savevideo.me/favicon.ico`,
  name: {
    en: "SaveVideo - Download video",
    vi: "SaveVideo - Tải video",
  },
  description: {
    en: "Download videos from Dailymotion, Facebook, Vimeo, Twitter, Instagram, TikTok, Reddit, Rumble.com and more easily!",
    vi: "Tải videos từ Dailymotion, Facebook, Vimeo, Twitter, Instagram, TikTok, Reddit, Rumble.com ...",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: true,

  onClick: async function () {
    // https://savevideo.me/en/

    function base64_encode(input) {
      var key_string =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
      var output = "";
      var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
      var i = 0;
      input = base64.utf8_encode(input);
      while (i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if (isNaN(chr2)) enc3 = enc4 = 64;
        else if (isNaN(chr3)) enc4 = 64;
        output +=
          key_string.charAt(enc1) +
          key_string.charAt(enc2) +
          key_string.charAt(enc3) +
          key_string.charAt(enc4);
      }
      return output;
    }
    function main() {
      let appPath = "https://savevideo.me/en/";
      var form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action", appPath);
      var hidden_field_1 = document.createElement("input");
      hidden_field_1.setAttribute("type", "hidden");
      hidden_field_1.setAttribute("name", "url");
      hidden_field_1.setAttribute("value", document.location);
      form.appendChild(hidden_field_1);
      var hidden_field_2 = document.createElement("input");
      hidden_field_2.setAttribute("type", "hidden");
      hidden_field_2.setAttribute("name", "src");
      hidden_field_2.setAttribute(
        "value",
        base64_encode(document.body.innerHTML)
      );
      form.appendChild(hidden_field_2);
      document.body.appendChild(form);
      form.submit();
    }

    let { closeLoading } = showLoading("Đang get link video...");
    try {
      let tab = await getCurrentTab();
      let url = prompt("Enter video url: ", tab.url);
      if (url == null) return;

      let formData = new FormData();
      formData.append("url", url);

      let res = await fetch("https://savevideo.me/en/", {
        method: "POST",
        body: formData,
      });
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

function bookmarklet() {
  let appPath = "https://savevideo.me/en/";
  var form = document.createElement("form");
  form.setAttribute("method", "post");
  form.setAttribute("action", appPath);
  var hidden_field_1 = document.createElement("input");
  hidden_field_1.setAttribute("type", "hidden");
  hidden_field_1.setAttribute("name", "url");
  hidden_field_1.setAttribute("value", document.location);
  form.appendChild(hidden_field_1);
  var hidden_field_2 = document.createElement("input");
  hidden_field_2.setAttribute("type", "hidden");
  hidden_field_2.setAttribute("name", "src");
  hidden_field_2.setAttribute("value", base64_encode(document.body.innerHTML));
  form.appendChild(hidden_field_2);
  document.body.appendChild(form);
  form.submit();
}
