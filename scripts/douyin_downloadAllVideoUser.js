export default {
  icon: "https://www.douyin.com/favicon.ico",
  name: {
    en: "Douyin - Download all user videos",
    vi: "Douyin - Tải tất cả video người dùng",
  },
  description: {
    en: "Download all videos in douyin user profile.",
    vi: "Tải tất cả video trong trang cá nhân của người dùng douyin.",
  },

  whiteList: ["https://www.douyin.com/user/*"],

  // https://github.com/diepvantien/douyin-dowload-all-video
  onClick: () => {
    alert("Mở console (F12) để xem tiến trình tải video.");
    var getid = async function (sec_user_id, max_cursor) {
      var res = await fetch(
        "https://www.douyin.com/aweme/v1/web/aweme/post/?device_platform=webapp&aid=6383&channel=channel_pc_web&sec_user_id=" +
          sec_user_id +
          "&max_cursor=" +
          max_cursor,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "vi",
            "sec-ch-ua":
              '"Not?A_Brand";v="8", "Chromium";v="108", "Microsoft Edge";v="108"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
          referrer: location.href,
          // "https://www.douyin.com/user/MS4wLjABAAAA5A-hCBCTdv102baOvaoZqg7nCIW_Bn_YBA0Aiz9uYPY",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      try {
        res = await res.json();
      } catch (e) {
        res = await getid(sec_user_id, max_cursor);
      }
      return res;
    };

    var saveToFile = function (text) {
      var blob = new Blob([text], { type: "text/plain" });
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = "douyin-video-links.txt";
      a.click();
    };

    var run = async function () {
      var result = [];
      var hasMore = 1;
      var sec_user_id = location.pathname.replace("/user/", "");
      var max_cursor = 0;

      console.log('Đang chuẩn bị tải video của "' + sec_user_id + '" ...');
      while (hasMore == 1) {
        var moredata = await getid(sec_user_id, max_cursor);
        console.log(moredata);
        hasMore = moredata["has_more"];
        max_cursor = moredata["max_cursor"];
        for (var item of moredata["aweme_list"] || []) {
          try {
            let url = item.video.play_addr.url_list[0];

            if (url.startsWith("https")) {
              result.push(url);
            } else {
              result.push(url.replace("http", "https"));
            }
            // console.clear();
            console.log("Number of videos: " + result.length);
          } catch (e) {
            console.log("ERROR: ", e);
          }
        }
        console.log(hasMore);
      }
      saveToFile(result.join("\n"));
      alert(
        "Link videos sẽ được lưu vào file .txt, thêm file này vào idm để tải hàng loạt."
      );
    };
    run();
  },
};
