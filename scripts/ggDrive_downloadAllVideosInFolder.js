import {
  openPopupWithHtml,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";
import { getTableStyle } from "./helpers/predefined_css.js";
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
    
  onClickExtension: async function () {
    // Post: https://www.facebook.com/groups/j2team.community/posts/974953859503401/

    let { closeLoading, setLoadingText } = showLoading(
      "Đang tìm tất cả video trong folder..."
    );
    try {
      // =========== Prepare data: Query all docid from website ===========
      let allDocs = await runScriptInCurrentTab(() =>
        Array.from(document.querySelectorAll(".iZmuQc .WYuW0e")).map((_) => ({
          id: _.dataset.id,
          name: _.innerText,
        }))
      );
      if (!allDocs?.length) throw Error("Không tìm được video nào.");

      // =========== Fetch Data ===========
      let errors = [];
      let result = [];
      for (let i = 0; i < allDocs.length; i++) {
        let { id, name } = allDocs[i];
        setLoadingText(
          `Tìm thấy ${allDocs.length} videos.<br/>
          Đang tìm link video ${i + 1}...<br/><br/>
          <p style="max-width:200px">${name}</p><br/><br/>
          Lỗi: ${errors.length} video<br/>
          <div style="max-height:150px;overflow:auto">
            ${errors.map(({ id, name, e }) => name).join("<br/>")}
          </div>`
        );
        try {
          // prettier-ignore
          let videoInfo = await ggdrive_downloadVideo.getLinkVideoGDriveFromDocId(id);
          result.push({ id, name, videoInfo });
        } catch (e) {
          errors.push({ id, name, e });
        }
      }

      // =========== Render Data ===========
      let allUrls = {};
      let tableHtml = result
        .map((data, i) => {
          const { id, name, videoInfo } = data;
          let link = shared.generateLinkFromDocId(id);

          let videosColumn = videoInfo
            .map(({ quality, url }) => {
              if (!(quality in allUrls)) allUrls[quality] = [];
              allUrls[quality].push(url);
              return `<a target="_blank" href="${url}">${quality}</a>`;
            })
            .join("<br/>");

          return `<tr>
          <td>${i + 1}</td>
          <td><a target="_blank" href="${link}">${name}</a></td>
          <td>${videosColumn}</td>
        </tr>`;
        })
        .join("");

      let allUrlsHtml = Object.entries(allUrls)
        .map(([quality, urls], index) => {
          urls = urls.join("\n");
          return `<p>${quality}</p><textarea style="width:100%;height:80px">${urls}</textarea>`;
        })
        .join("<br/>");

      let html = `
      <h1>Tải tất cả</h1>
      <h3>(Copy paste vào IDM hoặc FDM để tải toàn bộ)</h3>
      ${allUrlsHtml}

      <br/>
      <h1>Tải từng video</h1>
      <table>
        <tr>
            <th>#</th>
            <th>Link</th>
            <th>Videos</th>
        </tr>
        ${tableHtml}
      </table>
      <style>${getTableStyle()}</style>
      `;
      openPopupWithHtml(html, 700, 500);
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {
  generateLinkFromDocId: function (docId, mode = "view") {
    return `https://drive.google.com/file/d/${docId}/${mode}`;
  },
};
