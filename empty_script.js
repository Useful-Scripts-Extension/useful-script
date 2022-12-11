import { runScriptInCurrentTab } from "./helpers/utils.js";

export default {
  icon: "",
  name: {
    en: "",
    vi: "",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],

  onDocumentStart: function () {},
  onDocumentEnd: function () {},
  onDocumentIdle: function () {},
  onClick: function () {},
};

// Những thuộc tính/hàm có thể chia sẻ cho các scripts khác sử dụng sẽ được viết vào đây
export const shared = {};
