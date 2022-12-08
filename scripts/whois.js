export default {
  icon: "https://who.is/favicon.ico",
  name: {
    en: "Who.is",
    vi: "Who.is",
  },
  description: {
    en: "Want to find out who owns a domain? Click on this!",
    vi: "Muốn biết ai đang giữ domain này? Click ngay!",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    window.open("http://who.is/whois/" + document.domain);
  },
};
