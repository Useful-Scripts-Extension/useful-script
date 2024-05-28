export default {
  icon: '<i class="fa-solid fa-pager fa-lg"></i>',
  name: {
    en: "Get fb Page ID",
    vi: "Lấy fb Page ID",
  },
  description: {
    en: "Get id of page in facebook website",
    vi: "Lấy id của page trong trang facebook hiện tại",
  },
  whiteList: ["https://www.facebook.com/*"],

  pageScript: {
    onClick: function () {
      // Lấy page id - khi đang trong trang của page fb. Ví dụ: https://www.facebook.com/ColourfulSpace

      let funcs = [
        () =>
          require("CometRouteStore").getRoute(location.pathname).rootView.props
            .userID,
        () => /(?<=\"pageID\"\:\")(.*?)(?=\")/.exec(document.body.innerHTML)[0],
        () =>
          /(?<=facebook\.com\/)(.*?)($|(?=\/)|(?=&))/.exec(location.href)[0],
        () => {
          const tags = Array.from(
            document.body.querySelectorAll("script:not([src])")
          );
          for (const tag of tags) {
            let matches = tag.textContent.match(/"pageID":"([0-9]+)"/);
            if (matches) {
              return matches[1];
            }
          }
          return null;
        },
      ];

      for (let fn of funcs) {
        try {
          let result = fn();
          if (result) {
            prompt("Page ID:", result);
            return;
          }
        } catch (e) {}
      }

      prompt(
        "Không tìm thấy PAGE ID nào trong url!\nBạn có đang ở đúng trang page fb chưa?\nTrang web Ví dụ:",
        "https://www.facebook.com/ColourfulSpace"
      );
    },
  },
};
