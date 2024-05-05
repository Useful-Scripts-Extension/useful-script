import { getCurrentTab } from "./helpers/utils.js";
import { shared as ggdrive_downloadVideo } from "./ggdrive_downloadVideo.js";

export default {
  icon: "https://drive.google.com/favicon.ico",
  name: {
    en: "Google drive - generate direct link",
    vi: "Google drive - tạo link tải ngay",
  },
  description: {
    en: "Generate a direct download link to files stored in Google Drive. A direct link will immediately start downloading the file.",
    vi: "Tạo đường link direct cho file trên google drive. Bấm vào đường link sẽ tải file trực tiếp thay vì mở trang xem trước file.",
  },

  popupScript: {
    onClick: async function () {
      try {
        let tab = await getCurrentTab();
        let url = prompt("Nhập link google drive: ", tab.url);
        if (url == null) return;

        let directLink = shared.generateDirectLinkFromUrl(url);
        if (directLink) window.open(directLink);
      } catch (e) {
        alert("ERROR: " + e);
      }
    },
  },
};

export const shared = {
  generateDirectLinkFromUrl: function (url) {
    let docId = ggdrive_downloadVideo.getDocIdFromUrl(url);
    if (!docId)
      throw Error("Link không hợp lệ. Không tìm được docId trong link.");
    return shared.generateDirectLink(docId);
  },
  generateDirectLink: function (docId) {
    return "https://drive.google.com/uc?export=download&id=" + docId;
  },
};
