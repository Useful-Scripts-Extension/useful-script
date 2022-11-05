export default {
  name: {
    en: "Shorten URL (j2team)",
    vi: "Rút gọn link (j2team)",
  },
  description: {
    en: "Shorten URL using j2team.dev",
    vi: "Rút gọn link dùng công cụ của j2team",
  },

  func: function () {
    window.open(
      `https://j2team.dev/home/?prefill_url=${encodeURIComponent(
        window.top.location.href
      )}&utm_source=useful-scripts-extension`
    );
  },
};
