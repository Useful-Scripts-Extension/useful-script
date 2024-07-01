import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-download fa-lg"></i>',
  name: {
    en: "Get all media of insta user (API)",
    vi: "Tải về tất cả media của insta user (API)",
  },
  description: {
    en: "Get all media of instagram user (use instagram API)",
    vi: "Tải về tất cả ảnh/video của người dùng instagram (sử dụng API instagram)",
  },
  badges: [BADGES.hot],
  changeLogs: {
    "2024-04-03": "optimize flow",
  },

  popupScript: {
    onClick: async function () {
      const { getUidFromUsername, getAllMedia } = await import(
        "./insta_GLOBAL.js"
      );
      const { showLoading } = await import("./helpers/utils.js");
      const { t } = await import("../popup/helpers/lang.js");
      let username = prompt(
        t({
          en: "Enter insta username (eg. woohye0n):",
          vi: "Nhập tên user muốn tải (ví dụ: woohye0n):",
        }),
        ""
      );
      if (!username) return;

      let { closeLoading, setLoadingText } = showLoading(
        t({
          vi: "Đang tìm uid...",
          en: "Finding uid...",
        })
      );

      try {
        let uid = await getUidFromUsername(username);
        if (!uid)
          throw new Error(
            t({
              vi: "Không tìm được uid của username này",
              en: "Cannot find uid for this username",
            })
          );

        let all_urls = await getAllMedia({
          uid,
          progressCallback: (p) => {
            setLoadingText(
              t({
                vi: `Đang tìm ảnh/video ... (${p.current})`,
                en: `Fetching image/video... (${p.current})`,
              })
            );
          },
        });
        console.log(all_urls);
        if (!all_urls?.length) {
          alert(
            t({
              vi: "Không tìm được link ảnh/video nào.",
              en: "No image/video found",
            })
          );
        } else {
          setLoadingText(
            t({
              vi: `Đang tải xuống ... (${all_urls.length} link)`,
              en: `Downloading... (${all_urls.length} link)`,
            })
          );
          UfsGlobal.Utils.downloadData(all_urls.join("\n"), username + ".txt");
        }
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
