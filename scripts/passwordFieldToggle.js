export default {
  icon: `<i class="fa-solid fa-unlock fa-lg"></i>`,
  name: {
    en: "Password field toggle",
    vi: "Tắt/mở xem mật khẩu bị ẩn",
  },
  description: {
    en: "Toggle password field to text field to view hidden password",
    vi: "Bạn sẽ xem được mật khẩu bị ẩn trong khung đăng nhập",
  },

  onClick: function () {
    // Show password in alert
    // var s, F, j, f, i;
    // s = "";
    // F = document.forms;
    // for (j = 0; j < F.length; ++j) {
    //   f = F[j];
    //   for (i = 0; i < f.length; ++i) {
    //     if (f[i].type.toLowerCase() == "password") s += f[i].value + "\n";
    //   }
    // }
    // if (s) prompt("Passwords in forms on this page:", s);
    // else alert("There are no passwords in forms on this page.");

    // Code from J2Team Security
    "use strict";
    !(function (t) {
      var e =
        null === t.querySelector('input[type="password"]')
          ? "password"
          : "text";
      if ("text" === e)
        for (
          var r = t.querySelectorAll('input[type="password"]'),
            a = r.length,
            o = 0;
          o < a;
          o++
        )
          (r[o].type = "text"), (r[o].dataset.originalType = "password");
      else
        for (
          var p = t.querySelectorAll('input[data-original-type="password"]'),
            s = p.length,
            l = 0;
          l < s;
          l++
        )
          (p[l].type = "password"), p[l].removeAttribute("data-original-type");
    })(document);
  },
};
