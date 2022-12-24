export default {
  icon: '<i class="fa-solid fa-user-secret fa-lg"></i>',
  name: {
    en: "Anti phising",
    vi: "Chống phising",
  },
  description: {
    en: "Prevent phising attack",
    vi: "Ngăn cản sự tấn công phising",
  },
  infoLink: "https://trangcongnghe.vn/thu-thuat/10590-hacker-tan-cong-tai-khoan-facebok-cua-ban-nhu-the-nao-va-lam-the-nao-de-ngan-qua-trinh-nay.html",
  whiteList: ["http://*/*", "https://*/*"],

  onDocumentIdle: () => {
    // Source code copy from J2team security

    "use strict";
    // prettier-ignore
    !function(e,t){function l(e){return null!==t.getElementById(e)}function r(){if(t.forms.length>0){var e=["skip_api_login","enable_profile_selector","profile_selector_ids"];for(var r in e)if(l(e[r]))return!0;if(l("login_form")){var n=t.getElementById("login_form");if(null!==n.querySelector("input#email")&&null!==n.querySelector("input#pass")&&null!==n.querySelector("label#loginbutton"))return!0;if(null!==n.querySelector("input#m_login_email")&&null!==n.querySelector('input[name="lsd"]'))return!0}if(null!==t.forms[0].querySelector('a[data-sigil="password-plain-text-toggle"]'))return!0;if(null!==t.forms[0].querySelector('input[data-sigil="login-password-field"]'))return!0;if(null!==t.querySelector("html#facebook")&&(t.title.startsWith("Log in to Facebook")||t.title.startsWith("Đăng nhập Facebook"))&&null!==t.querySelector("#email.inputtext")&&null!==t.querySelector("#pass.inputtext"))return!0;if(l("pagelet_bluebar")&&null!==t.querySelector("#email.inputtext")&&null!==t.querySelector("#pass.inputtext"))return!0;var o=t.querySelector(".mobile-login-form");if(null!==o&&null!==o.querySelector('input[name="lsd"]')&&null!==o.querySelector('input[name="m_ts"]'))return!0}return!1}function n(){var t=e.top.location.hostname.toLowerCase();return t.indexOf(".facebook.com")===-1&&t.indexOf(".messenger.com")===-1}try{n()&&r()&&chrome.runtime.sendMessage({cmd:"block_page",type:"phishing"})}catch(o){}}(window,document);
  },
};
