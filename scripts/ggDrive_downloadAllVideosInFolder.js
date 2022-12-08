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
    let allDocs = await runScriptInCurrentTab(() =>
      Array.from(document.querySelectorAll(".iZmuQc .WYuW0e")).map((_) => ({
        id: _.dataset.id,
        name: _.innerText,
      }))
    );
    if (!allDocs?.length) {
      alert("Không tìm được video nào.");
      return;
    }

    let errors = [];
    let result = [];
    for (let i = 0; i < allDocs.length; i++) {
      let { id, name } = allDocs[i];
      setLoadingText(
        `Tìm thấy ${allDocs.length} videos.<br/>
          Đang tìm link video ${i + 1}...<br/><br/>
          <p style="max-width:200px">${name}</p><br/><br/>
          Lỗi: ${errors.length} video<br/>
          ${errors.map(({ id, name, e }) => name).join("<br/>")}`
      );
      try {
        // prettier-ignore
        let videoInfo = await ggdrive_downloadVideo.getLinkVideoGDriveFromDocId(id);
        result.push(videoInfo);
      } catch (e) {
        errors.push({ id, name, e });
      }
    }
    // closeLoading();

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
