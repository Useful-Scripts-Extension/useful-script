import { UfsGlobal } from "./content-scripts/ufs_global.js";

export default {
  icon: '<i class="fa-solid fa-up-right-and-down-left-from-center"></i>',
  name: {
    en: "Auto - view largest image",
    vi: "Tự động - xem ảnh lớn nhất",
  },
  description: {
    en: `<ul>
      <li>When viewing an image in new tab.</li>
      <li>This script will auto find and redirect to largest image.</li>
      <li>Support hundred of websites.</li>
    </ul>`,
    vi: `<ul>
      <li>Khi bạn mở xem ảnh trong tab mới.</li>
      <li>Chức năng này sẽ tự động tìm và chuyển trang sang ảnh chất lượng cao nhất.</li>
      <li>Hỗ trợ hàng trăm trang web.</li>
    </ul>`,
    img: "/scripts/auto_redirectLargestImageSrc.jpg",
  },

  changeLogs: {
    "2024-04-16": "init",
  },

  contentScript: {
    onDocumentStart: async () => {
      let oldHref = location.href;
      check(oldHref);

      window.onload = () =>
        UfsGlobal.DOM.onHrefChanged((oldHref, newHref) => check(newHref));

      async function check(href) {
        let url = await UfsGlobal.Utils.getLargestImageSrc(href, href);
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
  },
};
