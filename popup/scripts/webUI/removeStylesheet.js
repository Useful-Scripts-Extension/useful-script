export default {
  name: {
    en: "Remove stylesheet",
    vi: "Xoá stylesheet",
  },
  description: {
    en: "Remove all stylesheet from website",
    vi: "Xem trang web sẽ ra sao khi không có css",
  },
  func: function () {
    var i, x;
    for (i = 0; (x = document.styleSheets[i]); ++i) x.disabled = true;
  },
};
