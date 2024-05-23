export default {
  icon: "https://www.douyin.com/favicon.ico",
  name: {
    en: "Douyin - Batch download",
    vi: "Douyin - Tải hàng loạt",
  },
  description: {
    en: "Batch download videos from Douyin",
    vi: "Tải hàng loạt video từ Douyin",
  },

  whiteList: ["https://www.douyin.com/*"],

  contentScript: {
    onClick: () => {
      var download = async function (url, aweme_id, desc) {
        var file_name = aweme_id + "-" + desc + ".mp4";
        var data = await fetch(url, {
          headers: {
            accept: "*/*",
            "accept-language": "vi,en-US;q=0.9,en;q=0.8",
            range: "bytes=0-",
            "sec-ch-ua":
              '"Not?A_Brand";v="8", "Chromium";v="108", "Microsoft Edge";v="108"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "video",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
          },
          referrer: "https://www.douyin.com/",
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "omit",
        });
        data = await data.blob();
        var a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = file_name;
        a.click();
      };
    },
  },
};
