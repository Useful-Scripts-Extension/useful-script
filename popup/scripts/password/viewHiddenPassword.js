export default {
  name: {
    en: "View hidden passwords",
    vi: "Xem mật khẩu bị ẩn",
  },
  description: {
    en: "View hidden password",
    vi: "Bạn sẽ xem được mật khẩu bị ẩn (dấu sao *) trong khung đăng nhập",
  },
  func() {
    var s, F, j, f, i;
    s = "";
    F = document.forms;
    for (j = 0; j < F.length; ++j) {
      f = F[j];
      for (i = 0; i < f.length; ++i) {
        if (f[i].type.toLowerCase() == "password") s += f[i].value + "\n";
      }
    }
    if (s) prompt("Passwords in forms on this page:", s);
    else alert("There are no passwords in forms on this page.");
  },
};
