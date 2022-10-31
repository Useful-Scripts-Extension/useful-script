export default {
  name: {
    en: "Performance Analyzer",
    vi: "Phân tích hiệu suất",
  },
  description: {
    en: "Check performance metrics of website",
    vi: "Phân tích hiệu suất website không cần biết code",
  },
  func: function () {
    let src =
      "https://micmro.github.io/performance-bookmarklet/dist/performanceBookmarklet.min.js";

    let el = document.createElement("script");
    el.type = "text/javascript";
    el.src = src;
    el.onerror = function () {
      alert(
        'Looks like the Content Security Policy directive is blocking the use of bookmarklets\n\nYou can copy and paste the content of:\n\n"https://micmro.github.io/performance-bookmarklet/dist/performanceBookmarklet.min.js"\n\ninto your console instead\n\n(link is in console already)'
      );
      console.log(src);
    };
    document.getElementsByTagName("head")[0].appendChild(el);
  },
};
