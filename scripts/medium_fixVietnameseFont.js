import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: "https://cdn-icons-png.flaticon.com/512/5968/5968906.png",
  name: {
    en: "Medium - Fix vietnamese font",
    vi: "Medium - Fix font Tiếng Việt",
  },
  description: {
    en: `Fix vietnamese font in Medium<br/>
    <ul>
      <li>Click 1 time to fix font in current Medium page (dont need to reload)</li>
      <li>Enable autorun for next times you enter Medium</li>
    </ul>`,
    vi: `Sửa lỗi font Tiếng Việt khó nhìn trong Medium<br/>
    <ul>
      <li>Click 1 lần để sửa trang hiện tại (không cần tải lại trang)</li>
      <li>Bật tự chạy cho các lần sau vào Medium</li>
    </ul>`,
  },

  changeLogs: {
    "2024-31-05": "init",
  },

  whiteList: ["https://medium.com/*", "https://*.medium.com/*"],

  contentScript: {
    onDocumentStart: injectCss,
    onClick: injectCss,
  },
};
function injectCss() {
  UfsGlobal.DOM.injectCssFile(
    chrome.runtime.getURL("/scripts/medium_fixVietnameseFont.css")
  );
}
