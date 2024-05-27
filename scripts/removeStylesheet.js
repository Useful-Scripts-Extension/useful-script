import { BADGES } from "./helpers/badge.js";

export default {
  name: {
    en: "Remove stylesheet",
    vi: "Xoá stylesheet",
  },
  description: {
    en: "Remove all stylesheet from website.<br/>Click again to undo.",
    vi: "Xem trang web sẽ ra sao khi không có css.<br/>Bấm lại để hoàn tác.",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-05-01": "can undo",
  },

  contentScript: {
    onClick: function () {
      var i, x;
      for (i = 0; (x = document.styleSheets[i]); ++i) x.disabled = !x.disabled;
    },
  },
};
