export default {
  icon: '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>',
  name: {
    en: "Auto - view largest image",
    vi: "Tự động - xem ảnh lớn nhất",
  },
  description: {
    en: "Auto redirect to largest image, support on some websites",
    vi: "Tự động chuyển trang sang ảnh lớn nhất, hỗ trợ nhiều trang web",
    img: "/scripts/auto_redirectLargestImageSrc.jpg",
  },

  changeLogs: {
    1.66: {
      "2024-04-16": "init",
    },
  },

  onDocumentStart: async () => {
    let oldHref = location.href;
    check(oldHref);

    window.onload = () => {
      // listen location href change
      var bodyList = document.querySelector("body");
      var observer = new MutationObserver(function (mutations) {
        if (oldHref != document.location.href) {
          oldHref = document.location.href;
          check(oldHref);
        }
      });
      var config = {
        childList: true,
        subtree: true,
      };
      observer.observe(bodyList, config);
    };

    async function check(href) {
      let url = await UfsGlobal.Utils.getLargestImageSrc(href, href);
      console.log(url === href, url);

      if (url && url != href) {
        if (
          confirm(
            "Found bigger image. Redirect to that now?\n\nTìm thấy ảnh lớn hơn. Chuyển trang ngay?\n\n" +
              url
          )
        ) {
          location.href = url;
        }
      }
    }
  },
};
