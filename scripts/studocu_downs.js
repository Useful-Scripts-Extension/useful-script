export default {
  icon: "https://d20ohkaloyme4g.cloudfront.net/img/favicon.ico",
  name: {
    en: "Studocu - Download documents",
    vi: "Studocu - Tải documents",
  },
  description: {
    en: "Download documents on Studocu.com for free",
    vi: "Tải tài liệu trên Studocu.com miễn phí",
  },

  changeLogs: {
    "2024-05-11": "combine + auto download",
  },

  popupScript: {
    onClick: async function () {
      const { getCurrentTab, openWebAndRunScript } = await import(
        "./helpers/utils.js"
      );

      let funcs = {
        "dlstudocu.com": async (url) => {
          openWebAndRunScript({
            url: "https://dlstudocu.com/",
            func: (url) => {
              let interval = setInterval(() => {
                if (window.st_url) {
                  try {
                    window.st_url.value = url;
                    document.querySelector("form").submit();
                    clearInterval(interval);
                  } catch (e) {
                    console.log(e);
                  }
                }
              }, 100);
            },
            args: [url],
            waitUntilLoadEnd: false,
            focusImmediately: true,
          });
        },
        "downstudocu.com": async (url) => {
          url = new URL(url);
          url.hostname = "www.downstudocu.com";
          window.open(url);
        },
      };

      let tab = await getCurrentTab();
      let url = prompt(
        "Nhập link studocu document:\nĐịnh dạng: https://www.studocu.com/vn/document/...",
        tab.url
      );
      if (url == null) return;

      let keys = Object.keys(funcs);
      let choice = prompt(
        "Nhập website muốn download:\n\n" +
          keys.map((a, i) => i + ": " + a).join("\n"),
        0
      );
      if (choice == null) return;
      if (keys[choice] == null) {
        alert("Nhập sai dữ liệu. Invalid choice");
        return;
      }
      funcs[keys[choice]]?.(url);
    },
  },
};
