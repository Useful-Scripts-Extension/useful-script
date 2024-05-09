import { showLoading } from "./helpers/utils.js";
import { t } from "../popup/helpers/lang.js";

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

  changeLogs: {
    "2024-04-03": "optimize flow",
  },

  popupScript: {
    onClick: async function () {
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
        let uid = await UfsGlobal.Instagram.getUidFromUsername(username);
        if (!uid)
          throw new Error(
            t({
              vi: "Không tìm được uid của username này",
              en: "Cannot find uid for this username",
            })
          );

        let all_urls = await UfsGlobal.Instagram.getAllMedia({
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
          UfsGlobal.Utils.downloadData(all_urls.join("\n"), username, ".txt");
        }
      } catch (e) {
        alert("ERROR: " + e);
      } finally {
        closeLoading();
      }
    },
  },
};
