export default {
  icon: "",
  name: {
    en: "View Google cache of website",
    vi: "Xem Google cache của trang web",
  },
  description: {
    en: "View the Google cache for the current web page",
    vi: "Xem Google cache của trang web",
  },
  blackList: [],
  whiteList: [],
  func: function () {
    var a = location.href.replace(/^http\:\/\/(.*)$/, "$1");
    window.open("http://www.google.com/search?q=cache:" + escape(a));
  },
};
