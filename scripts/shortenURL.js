export default {
  icon: "",
  name: {
    en: "Shorten URL",
    vi: "Rút gọn link",
  },
  description: {
    en: "Shorten URL",
    vi: "Rút gọn link nhanh chóng",
  },

  func: function () {
    // https://hyperhost.ua/tools/en/surli
    // https://www.shorturl.at/shortener.php
    // https://tinyurl.com/app
    // https://cutt.ly/
    window.open(
      `https://j2team.dev/home/?prefill_url=${encodeURIComponent(
        window.top.location.href
      )}&utm_source=useful-scripts-extension`
    );
  },
};
