export default {
  icon: "https://drive-thirdparty.googleusercontent.com/32/type/application/vnd.openxmlformats-officedocument.presentationml.presentation",
  name: {
    en: "GG Drive - Download PowerPoint (Slides/Presentation)",
    vi: "GG Drive - Tải PowerPoint (Slides)",
  },
  description: {
    en: "Download google drive Presentation file that dont have download button, covert to HTML file.",
    vi: "Tải file Powerpoint (Slides) không có nút download trên google drive, tải về định dạng HTML.",
  },

  whiteList: ["https://docs.google.com/presentation/*"],

  popupScript: {
    onClick: async () => {
      const { t } = await import("../popup/helpers/lang.js");
      const { getCurrentTab, openWebAndRunScript } = await import(
        "./helpers/utils.js"
      );
      let tab = await getCurrentTab();
      let { url, title } = tab;

      let guide = t({
        vi: "Sử dụng chức năng\nTự động > In web ra PDF hoặc\nTự động > Chụp ảnh toàn bộ web\nđể tải slides nhé.",
        en: "Please use feature\nAutomation > Screenshot full page OR\nAutomation > Web to PDF\nto download this slides",
      });

      if (url.includes("/htmlpresent")) {
        alert(guide);
      } else {
        url = prompt(
          t({
            vi: "Nhập link file powerpoint (slide) google drive: \nĐịnh dạng: https://docs.google.com/presentation/*",
            en: "Enter google drive presentation url: \nFormat: https://docs.google.com/presentation/*",
          }),
          url
        );
        if (!url) return;

        let id = /d\/([^\/]+)\/?/.exec(url)?.[1];
        if (!id) {
          alert(
            t({
              vi: "Không tìm được id file trên url",
              en: "Can not find file id in url",
            })
          );
          return;
        }

        openWebAndRunScript({
          url: "https://docs.google.com/presentation/d/" + id + "/htmlpresent",
          func: async (guide) => {
            window.onload = alert(guide);
          },
          args: [guide],
          focusImmediately: true,
          waitUntilLoadEnd: false,
        });
      }
    },
  },
};
