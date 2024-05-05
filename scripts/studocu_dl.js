import { getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://dlstudocu.com/themes/assets/images/logo/icon-96x96.png",
  name: {
    en: "Studocu - Download documents (Dlstudocu)",
    vi: "Studocu - Tải documents (Dlstudocu)",
  },
  description: {
    en: "",
    vi: "",
  },

  popupScript: {
    onClick: async function () {
      let { setLoadingText, closeLoading } = showLoading(
        "Đang chờ nhập link..."
      );
      try {
        let tab = await getCurrentTab();
        let url = prompt(
          "Nhập link studocu document:\nĐịnh dạng: https://www.studocu.com/vn/document/...",
          tab.url
        );
        if (url == null) return;

        setLoadingText("Đang tìm link tải...");
        let formData = new FormData();
        formData.append("st_url", url);

        let res = await fetch("https://dlstudocu.com/start", {
          method: "POST",
          body: formData,
        });
        window.open(res.url);
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
