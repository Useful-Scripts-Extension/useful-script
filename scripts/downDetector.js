import { getCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://cdn2.downdetector.com/dc31f7f27fda396/images/v2/problem.svg",
  name: {
    en: "DownDetector - View report web crash",
    vi: "DownDetector - Thống kê sự cố web",
  },
  description: {
    en: "View web bug reports",
    vi: "Xem thống kê các báo cáo về sự cố web",
  },

  changeLogs: {
    "2024-04-27": "optimize, fetch list supported sites",
  },

  popupScript: {
    onClick: async function () {
      const { setLoadingText, closeLoading } = showLoading("Đang lấy url...");

      let { url } = await getCurrentTab();

      if (!url) {
        alert("Không tìm thấy url web hiện tại");
        closeLoading();
        return;
      }

      // crawl list avai websites
      setLoadingText("Đang tải danh sách websites được hỗ trợ...");
      const res = await fetch("https://downdetector.com/search/");
      const text = await res.text();
      const supportedSites = text.match(/\/status\/(.*?)\//g)?.map((_) => {
        return _.split("/")?.[2];
      });
      closeLoading();

      const hostname = new URL(url).hostname;
      let avaiSorted = supportedSites
        .map((a) => {
          let score = 0;
          let parts = a.split("-");
          parts.forEach((p) => {
            if (hostname.includes(p)) score += p.length * 10;
          });

          let full = parts.join("");
          if (hostname.includes(full)) score += full.length * 5;

          let chars = full.split("");
          chars.forEach((c) => {
            if (hostname.includes(c)) score++;
          });

          return {
            name: a,
            score,
          };
        })
        .sort((a, b) => b.score - a.score);

      const mostEqual = avaiSorted[0] || { name: "" };
      let name = prompt(
        (!supportedSites?.length
          ? "Không thể tải danh sách websites\n\n"
          : "") + "Nhập tên website bạn muốn kiểm tra: ",
        mostEqual.name
      );

      if (name) {
        if (name === mostEqual.name) {
          window.open("https://downdetector.com/status/" + name);
        } else {
          window.open("https://downdetector.com/search/?q=" + name);
        }
      }
    },
  },
};
