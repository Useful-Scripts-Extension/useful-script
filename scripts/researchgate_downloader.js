import { getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://www.researchgate.net/favicon.ico",
  name: {
    en: "ResearchGate - Downloader",
    vi: "ResearchGate - Tải tài liệu",
  },
  description: {
    en: "Download papers / document / pdf from ResearchGate",
    vi: "Tải bài báo / tài liệu / pdf trên ResearchGate",
  },
  infoLink: "https://freepdfdownloader.com/researchgate",

  changeLogs: {
    "2024-04-30": "description",
  },

  onClickExtension: async () => {
    const { closeLoading, setLoadingText } = showLoading("Đang lấy url...");

    try {
      let tab = await getCurrentTab();
      let url = prompt(
        "Nhập link research gate: \nĐịnh dạng: https://www.researchgate.net/publication/...",
        tab.url
      );

      if (url) {
        let body = new FormData();
        body.append("lang", "en-US");
        body.append("chck", ".");
        body.append("link", url);
        const res = await fetch(
          "https://freepdfdownloader.com/api?mode=plg&token=__",
          {
            method: "POST",
            body,
          }
        );
        const data = await res.json();
        console.log(data);
        if (data.link) {
          let link = atob(data.link);
          window.open(link);
        } else {
          throw Error("Không tìm thấy link");
        }
      }
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

// functions/attributes that other scripts can import and use
// can only use in popup context (onClickExtension)
export const shared = {};
