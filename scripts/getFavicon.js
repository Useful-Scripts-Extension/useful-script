export default {
  icon: `https://favicon.io/assets/static/favicon.b9532cc.ed88c65f76fa003989a0c683d668c765.png`,
  name: {
    en: "Download favicon from website",
    vi: "Tải favicon của trang web",
  },
  description: {
    en: "Get favicon link of current website",
    vi: "Lấy link favicon của trang web",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: false,

  func: function () {
    // https://stackoverflow.com/a/15750809
    const getFaviconFromGoogle = (willGetUrlFavicon = true) => {
      return willGetUrlFavicon
        ? "https://s2.googleusercontent.com/s2/favicons?domain_url=" +
            location.href
        : "https://s2.googleusercontent.com/s2/favicons?domain=" +
            location.hostname;
    };

    // https://stackoverflow.com/a/10283308
    const getFavicon = function () {
      var favicon = undefined;
      var nodeList = document.getElementsByTagName("link");
      for (var i = 0; i < nodeList.length; i++) {
        if (
          nodeList[i].getAttribute("rel") == "icon" ||
          nodeList[i].getAttribute("rel") == "shortcut icon"
        ) {
          favicon = nodeList[i].getAttribute("href");
        }
      }
      return favicon ? new URL(favicon, location.href).href : null;
    };

    let choice = window.prompt(
      "Chọn favicon muốn lấy:\n\n" +
        " 1: URL favicon từ trang web (size gốc)\n\n" +
        " 2: Domain favicon từ googleusercontent (size nhỏ)\n\n" +
        " 3: URL favicon từ googleusercontent (size nhỏ)\n\n",
      1
    );

    switch (choice) {
      case "1":
        let favicon = getFavicon();
        favicon
          ? window.prompt("Favicon: ", favicon)
          : alert("Không tìm thấy favicon trong web");
        break;
      case "2":
        window.prompt("Favicon: ", getFaviconFromGoogle(false));
        break;
      case "3":
        window.prompt("Favicon: ", getFaviconFromGoogle(true));
        break;
    }
  },
};
