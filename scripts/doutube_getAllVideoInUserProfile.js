import { runScriptInCurrentTab, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://s2.googleusercontent.com/s2/favicons?domain=doutu.be",
  name: {
    en: "Get all video from user doutu.be profile",
    vi: "Tải tất cả video từ doutu.be profile",
  },
  description: {
    en: "Get all video in doutu.be user profile",
    vi: "Tải tất cả video từ profile của user doutu.be bất kỳ",
  },
  whiteList: ["https://doutu.be/*"],

  onClickExtension: async function () {
    const { zipAndDownloadBlobs, getBlobFromUrl } =
      UsefulScriptGlobalPageContext.Utils;

    let user_id = await runScriptInCurrentTab(() => {
      let url = window.location.href;
      let id = url.split("/u/")?.[1];
      return id;
    });

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
        let url = `https://api.doutu.be/api/video/?author=${user_id}&skips=${skip}`;
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
    } else if (
      !confirm(
        `Tìm được ${videos.length} videos. Bấm OK để bắt đầu quá trình tải`
      )
    ) {
      closeLoading();
    } else {
      let blobs = [];
      for (let i = 0; i < videos.length; i++) {
        let v = videos[i];
        let id = v._id;
        let url = v.playUrl || v.videoMP4URL;
        setLoadingText(`Đang tải video ${id}...`);
        let blob = await getBlobFromUrl(url);
        blobs.push({
          blob,
          fileName: `${i}_${id}.mp4`,
        });
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
