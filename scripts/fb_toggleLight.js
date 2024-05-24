import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: `<i class="fa-solid fa-lightbulb fa-lg"></i>`,
  name: {
    en: "Turn off light fb newfeed",
    vi: "Tắt đèn fb newfeed",
  },
  description: {
    en:
      "Hide Navigator bar and complementary bar in facebook.<br/><br/>" +
      "<ul>" +
      "<li>Click to temporarily hide/show on this page.</li>" +
      "<li>Enable autorun to auto hide whenever open facebook.</li>" +
      "</ul>",
    vi:
      "Ẩn giao diện 2 bên newfeed, giúp tập trung vào newfeed facebook.<br/><br/>" +
      "<ul>" +
      "<li>Click để ẩn/hiện tạm thời trong trang hiện tại.</li>" +
      "<li>Bật tự chạy để tự động ẩn mỗi khi mở facebook.</li>" +
      "</ul>",
  },

  changeLogs: {
    "2024-05-19": "fix auto hide",
  },

  whiteList: ["https://*.facebook.com/*"],

  contentScript: {
    onDocumentIdle: () => {
      UfsGlobal.DOM.onElementsVisible(
        '[role="navigation"], [role="complementary"]',
        () => {
          [
            document.querySelectorAll('[role="navigation"]')?.[2],
            document.querySelectorAll('[role="complementary"]')?.[0],
          ].forEach((el) => {
            if (el) {
              el.style.display = "none";
            } else console.log("ERROR: Cannot find element");
          });
        }
      );
    },

    onClick: function () {
      [
        document.querySelectorAll('[role="navigation"]')?.[2],
        document.querySelectorAll('[role="complementary"]')?.[0],
      ].forEach((el) => {
        if (el) {
          el.style.display = el.style.display != "none" ? "none" : "";
        } else console.log("ERROR: Cannot find element");
      });
    },
  },
};
