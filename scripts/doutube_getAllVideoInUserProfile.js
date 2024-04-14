import { getCurrentTabUrl, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://s2.googleusercontent.com/s2/favicons?domain=doutu.be",
  name: {
    en: "Get all video from user profile",
    vi: "Tải tất cả video người dùng",
  },
  description: {
    en: "Get all video in doutu.be user profile",
    vi: "Tải tất cả video từ profile của user doutu.be bất kỳ",
  },
  whiteList: ["https://doutu.be/*"],

  onClickExtension: async function () {
    const { zipAndDownloadBlobs, getBlobFromUrl } = UfsGlobal.Utils;

    let url = await getCurrentTabUrl();
    let user_id = url?.split("/u/")?.[1];

    if (!user_id) {
      alert(
        "Không tìm thấy user id từ url.\nVui lòng vào trang profile của user doutu.be\n\nVD: https://doutu.be/u/123456789"
      );
      return;
    }

    let hasNextPage = true;
    let page = 1;
    let skip = 0;
    let videos = [];

    const { closeLoading, setLoadingText } = showLoading("Đang tìm video...");
    while (hasNextPage) {
      try {
        let url = `https://api.doutu.be/api/video/?author=${user_id}&skips=${skip}&limit=20`;
        let response = await fetch(url);
        let data = await response.json();

        if (data?.length) {
          data.forEach((d) => {
            videos.push(d);
          });

          skip += data.length;
          page++;
          setLoadingText(
            `Đang tìm trang ${page}.<br/>Đã tìm được ${videos.length} videos...`
          );
        } else {
          hasNextPage = false;
        }
      } catch (e) {
        alert("Lỗi: " + e);
        break;
      }
    }

    console.log(videos);
    if (!videos.length) {
      alert("Không tìm thấy video nào");
      closeLoading();
    } else {
      alert(`Tiện ích sẽ tiến hành bắt link từng video.
Vui lòng không tắt popup tiện ích trong quá trình này.

(Do idm không thể bắt link hàng loạt, nên các bạn ráng chờ tiện ích tải xong tất cả video nhé)`);
      let blobs = [];
      for (let i = 0; i < videos.length; i++) {
        try {
          let v = videos[i];
          let id = v._id;
          let url = v.playUrl || v.videoMP4URL;
          setLoadingText(`Đang tải video [${i}/${videos.length}] ${id}...`);
          let blob = await getBlobFromUrl(url);
          blobs.push({
            blob,
            fileName: `${i}_${id}.mp4`,
          });
        } catch (e) {
          alert("Không thể tải video " + id + ". Ok để bỏ qua.");
        }
      }

      setLoadingText(`Đang nén...`);
      zipAndDownloadBlobs(
        blobs,
        `doutube_${user_id}.zip`,
        (progress) => {
          setLoadingText(
            `Đang nén... ${progress}%<br/>Vui lòng không tắt popup này`
          );
        },
        () => {
          closeLoading();
        }
      );
    }
  },
};
