export default {
  icon: '<i class="fa-solid fa-lock-open fa-lg"></i>',
  name: {
    en: "Hide/Show password field",
    vi: "Ẩn/Hiện ô nhập mật khẩu",
  },
  description: {
    en: "Show/hide value of password fields in website<br/>(eg. **** -> 1234)",
    vi: "Ẩn/hiện giá trị trong các ô nhập mật khẩu<br/>(ví dụ **** -> 1234)",
    img: "",
  },

  changeLogs: {
    ["2024-05-18"]: "init",
  },

  pageScript: {
    onClick: () => {
      let inpPass = Array.from(
        document.querySelectorAll(
          'input[type="password"], input[ufs-toggle-pass="true"]'
        )
      );

      if (!inpPass.length) {
        alert("No password field found.\nKhông có ô nhập mật khẩu nào");
        return;
      }

      for (let inp of inpPass) {
        inp.type = inp.type == "password" ? "text" : "password";
        inp.setAttribute("ufs-toggle-pass", "true");
      }
    },
  },
};
