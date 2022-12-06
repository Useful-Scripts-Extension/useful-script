import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";
import { shared as ggdrive_downloadVideo } from "./ggdrive_downloadVideo.js";

export default {
  icon: "https://drive.google.com/favicon.ico",
  name: {
    en: "GGDrive - Download all videos in folder",
    vi: "GGDrive - Tải mọi video trong folder",
  },
  description: {
    en: "Download all videos in folder of google drive (bypass download permission)",
    vi: "Tải tất cả video trong thư mục google drive (tải được video không cho phép tải)",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: true,

  func: async function () {
    // Post: https://www.facebook.com/groups/j2team.community/posts/974953859503401/

    let { closeLoading, setLoadingText } = showLoading(
      "Đang tìm tất cả video trong folder..."
    );
    let allDocIds = await runScriptInCurrentTab(() =>
      Array.from(document.querySelectorAll(".iZmuQc .WYuW0e")).map(
        (_) => _.dataset.id
      )
    );
    if (!allDocIds?.length) {
      alert("Không tìm được video nào.");
      return;
    }

    let errors = [];
    let result = [];
    for (let i = 0; i < allDocIds.length; i++) {
      let docId = allDocIds[i];
      setLoadingText(
        `Tìm thấy ${allDocIds.length} videos.<br/>` +
          `Đang tìm link video ${i + 1}...<br/>${docId}<br/><br/>` +
          `Lỗi: ${errors.length} video<br/>` +
          errors.map(({ id, e }) => id).join("<br/>")
      );
      try {
        let videoInfo = await ggdrive_downloadVideo.getLinkVideoGDriveFromDocId(
          docId
        );
        result.push(videoInfo);
      } catch (e) {
        errors.push({ id: docId, e });
      }
    }
    closeLoading();

    let html = `
        <table>
            <tr>
                <th>#</th>
                <th>Title</th>
                <th>Videos</th>
            </tr>
        </table>
    `;
    console.log(result);
  },
};

export const shared = {};
