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
      const { getCurrentTab } = await import("./helpers/utils.js");
      let tab = await getCurrentTab();
      let { url, title } = tab;

      if (url.includes("/htmlpresent")) {
        alert(
          "Ban hãy bấm Ctrl+S để lưu toàn bộ slides trong trang hiện tại nhé."
        );
      } else {
        url = prompt(
          "Nhập link file powerpoint (slide) google drive: \nĐịnh dạng: https://docs.google.com/presentation/*",
          url
        );
        if (!url) return;

        let id = /d\/([^\/]+)\/?/.exec(url)?.[1];
        if (!id) {
          alert("Không tìm được id file trên url");
          return;
        }

        alert(
          "File sẽ được mở trong trang mới. Bạn có thể bấm Ctrl+S để lưu toàn bộ slides trong trang mới."
        );

        window.open(
          "https://docs.google.com/presentation/d/" + id + "/htmlpresent"
        );
      }
    },
  },
};
