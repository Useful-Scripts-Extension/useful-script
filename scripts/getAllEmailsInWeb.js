export default {
  icon: `<i class="fa-solid fa-at fa-lg"></i>`,
  name: {
    en: "Extract all Emails from website",
    vi: "Trích xuất mọi emails từ trang web",
  },
  description: {
    en: "Extracts all emails and displays them in a popup iFrame (enable popups!)",
    vi: "Trích xuất tất cả emails trong web và hiện trong popup mới",
  },

  onClick: function () {
    // source code from: https://bookmarklet.vercel.app/

    let StrObj = document.body.innerHTML;
    let haystack = StrObj.toString();
    let regex =
      /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
    let found = haystack.match(regex);
    if (found !== null && found !== "") {
      let mailz = found.join("\r\n<br>");
      let w = window.open(
        "",
        "mailz",
        "scrollbars,resizable,width=400,height=600"
      );
      w.document.write(mailz);
    } else {
      alert("No emails found on page");
    }
  },
};
