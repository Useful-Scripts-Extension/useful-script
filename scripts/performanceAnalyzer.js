export default {
  icon: `<i class="fa-solid fa-gauge"></i>`,
  name: {
    en: "Performance Analyzer",
    vi: "Phân tích hiệu suất",
  },
  description: {
    en: "Check performance metrics of website",
    vi: "Phân tích hiệu suất website không cần biết code",
  },

  func: function () {
    let options = [
      {
        name: "Sử dụng PageSpeed Insights",
        func: () => {
          window.open(
            "https://developers.google.com/speed/pagespeed/insights/?url=" +
              encodeURIComponent(location.href)
          );
        },
      },
      {
        name: "Sử dụng gtmetrix",
        func: () => {
          window.open("https://gtmetrix.com/?url=" + document.domain);
        },
      },
      {
        name: "Sử dụng performanceBookmarklet.min.js (beta)",
        func: () => {
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
      },
    ];

    let choice = prompt(
      options.map((_, i) => `${i}: ${_.name}`).join("\n") +
        "\n\n - Your choice:",
      0
    );

    alert(choice);

    if (choice != null && choice >= 0 && choice < options.length) {
      options[choice]?.func?.();
    }
  },
};
