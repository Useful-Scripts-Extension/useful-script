export default {
  icon: `<i class="fa-solid fa-cookie-bite fa-lg"></i>`,
  name: {
    en: "Remove cookies",
    vi: "Xoá Cookies",
  },
  description: {
    en: "Remove cookies from current website",
    vi: "Xoá cookies trang hiện tại",
  },

  contentScript: {
    onClick: function () {
      var c = document.cookie.replace(/; /g, "\n");
      if (c == "") {
        alert("There is No cookie here");
      } else {
        if (confirm("Are you sure want to delete all cookies?\n\n\n" + c)) {
          clearCookies();
          alert("Remove cookies DONE");
        }
      }
    },
  },
};

export function clearCookies() {
  let C = document.cookie.split("; ");
  for (let d = "." + location.host; d; d = ("" + d).substr(1).match(/\..*$/))
    for (let sl = 0; sl < 2; ++sl)
      for (
        let p = "/" + location.pathname;
        p;
        p = p.substring(0, p.lastIndexOf("/"))
      )
        for (let i in C) {
          let c = C[i];
          if (c) {
            document.cookie =
              c +
              "; domain=" +
              d.slice(sl) +
              "; path=" +
              p.slice(1) +
              "/" +
              "; expires=" +
              new Date(new Date().getTime() - 1e11).toGMTString();
          }
        }
}
