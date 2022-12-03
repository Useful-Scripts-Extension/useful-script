import {
  runScript,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: "",
  name: {
    en: "Alert something",
    vi: "Alert something",
  },
  description: {
    en: "...",
    vi: "....",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: true,

  func: async function () {
    const { closeLoading, setLoadingText } = showLoading(
      "Đang thu thập video link của user..."
    );

    let urls = await runScriptInCurrentTab(() => {
      // var videoDes = Array.from(
      //     document.querySelectorAll(
      //       "div.tiktok-1qb12g8-DivThreeColumnContainer.eegew6e2 > div > div > div > a"
      //     )
      //   ).map((items) => items.innerText);
      //   console.log(videoDes);
      return Array.from(
        document.querySelectorAll(
          "div.tiktok-1qb12g8-DivThreeColumnContainer > div > div > div > div > div > a"
        ),
        (element) => element.href
      );
    });

    async function getVideoURL(link) {
      const API_URL = `https://api19-core-useast5.us.tiktokv.com/aweme/v1/feed/?aweme_id=${link}&version_code=262&app_name=musical_ly&channel=App&device_id=null&os_version=14.4.2&device_platform=iphone&device_type=iPhone9`;
      const request = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "TikTok 26.2.0 rv:262018 (iPhone; iOS 14.4.2; en_US) Cronet",
        },
      });
      const res = await request.json();
      console.log(res);
      const getvideourl = res.aweme_list[0].video.play_addr.url_list[0];
      return getvideourl;
    }

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    let videoUrls = [];
    for (var i = 0; i < urls.length; i++) {
      let link = urls[i].slice(-19).toString();
      setLoadingText(`Đang get link [${i}] ${link} ...`);
      const videoURL = await getVideoURL(link);
      videoUrls.push(videoURL);

      let t = 500;
      setLoadingText(`Get link [${i}] xong. Đang chờ ${t}ms...`);
      await sleep(t);
    }
    console.log(videoUrls);
    closeLoading();
  },
};

async function backup() {
  const getRedirectUrl = async (url) => {
    if (url.includes("vm.tiktok.com") || url.includes("vt.tiktok.com")) {
      url = await fetch(url, {
        redirect: "follow",
        follow: 10,
      });
      url = url.url;
      console.log(chalk.green("[*] Redirecting to: " + url));
    }
    return url;
  };
}
