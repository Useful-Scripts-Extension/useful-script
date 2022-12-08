import { openPopupWithHtml, showLoading } from "./helpers/utils.js";

export default {
  icon: "https://www.snaptikvideo.com/favicon.ico",
  name: {
    en: "Tiktok - Download video (snaptikvideo)",
    vi: "Tiktok - Tải video (snaptikvideo)",
  },
  description: {
    en: "Download tiktok video (mp4/mp3/no watermark) using snaptikvideo API",
    vi: "Tải video tiktok (mp4/mp3/không watermark) dùng API snaptikvideo",
  },
  runInExtensionContext: true,

  onClick: async function () {
    async function fetchSnaptikVideo(url) {
      let res = await fetch(
        "https://api.snaptikvideo.com/st-tik/tiktok/dl?url=" + url,
        {
          // Kèm thêm config rules ở net-request-rules thì fetch này mới chạy được
        }
      );
      return await res.json();
    }

    const { closeLoading, setLoadingText } = showLoading(
      "Đang chờ bạn nhập url..."
    );
    try {
      let url = prompt("Nhập link tiktok video: ", "");
      if (url == null) return;

      setLoadingText("Đang tải thông tin từ snaptikvideo...");
      let data = await fetchSnaptikVideo(url);
      if (data?.code != 200) throw Error(data?.msg || "Lỗi không xác định");
      if (!data?.result) throw Error("Kết quả trả về không có thông tin.");
      console.log(data);
      const {
        author,
        cover,
        desc,
        duration,
        mp3,
        music,
        thumb,
        waterMarkMp4,
        waterMarkVideo,
        withoutWaterMarkMp4,
        withoutWaterMarkVideo,
      } = data.result;

      let listLink = [
        {
          name: "Video (no watermark)",
          value: withoutWaterMarkMp4 || withoutWaterMarkVideo,
        },
        { name: "MP4", value: waterMarkMp4 },
        { name: "MP3 🎵", value: mp3 },
        { name: "Music 🎵", value: music },
        { name: "HD Video", value: waterMarkVideo },
        { name: "Profile Picture", value: thumb },
      ]
        .map(({ name, value }) => {
          if (value) {
            return `<a class="option" href="${value}">${name}</a>`;
          }
        })
        .join("");

      openPopupWithHtml(
        `<div class="dl-wrapper">
            <video controls="" poster="${cover}" class="videoContainer">
                <source src="${waterMarkVideo}" type="video/mp4">
            </video>
            <div class="video-info">
                <div class="author">
                    <img class="avatar" src="${thumb}" alt="" loading="lazy">
                    <div class="username">${author}</div>
                </div>
                <div class="desc">${desc}</div>
                <div class="select-box">
                    <div class="options">
                    ${listLink}
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            body {
                background-color: rgb(23, 23, 50);
                color: rgb(232, 230, 227);
            }
            .dl-wrapper {
                display: flex;
                justify-content: space-between;
                margin: 60px auto;
                width: 800px;
            }
            .videoContainer {
                display: block;
                max-width: 320px;
                width: 100%;
                border-radius: 15px;
                margin-right: 15px;
            }
            .dl-wrapper .video-info {

            }
            .dl-wrapper .video-info .author {
                display: flex;
                align-items: center;
                margin-bottom: 16px;
            }
            .dl-wrapper .video-info .author .avatar {
                width: 48px;
                height: 48px;
                margin-right: 24px;
                border-radius: 50%;
            }
            .dl-wrapper .video-info .author .username {
                color: rgb(200, 195, 188);
                font-weight: 500;
                font-size: 20px;
                margin: 0 8px;
            }
            .dl-wrapper .video-info .desc {
                color: rgb(200, 195, 188);
                font-size: 18px;
                line-height: 30px;
                margin-bottom: 32px;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }
            .dl-wrapper .video-info .select-box .option {
                display: flex;
                box-sizing: border-box;
                border-radius: 10px;
                background: #7ed214;
                height: 50px;
                max-width: 320px;
                box-shadow: 0 2px 6px -1px rgb(0 0 0 / 16%), 0 1px 4px -1px rgb(0 0 0 / 4%);
                color: #fff;
                align-items: center;
                justify-content: center;
                font-size: 18px;
                font-weight: 500;
                line-height: 50px;
                cursor: pointer;
                text-align: center;
                margin: 0 auto 20px;
                text-decoration: none;
            }
        </style>
        `,
        900,
        600
      );
    } catch (e) {
      prompt(
        "Lỗi: " + e + "\n\nBạn có thể mở trang web sau để thử lại:",
        "https://www.snaptikvideo.com/"
      );
    } finally {
      closeLoading();
    }
  },
};
