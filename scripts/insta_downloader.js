import {
  doSomething2,
  openPopupWithHtml,
  parseJwt,
  showLoading,
  showPopup,
} from "./helpers/utils.js";

export default {
  icon: "https://snapinsta.app/assets/img/fav.ico",
  name: {
    en: "Instagram downloader (Snapinsta)",
    vi: "Trình tải instagram (Snapinsta)",
  },
  description: {
    en: "Support Photo, Video, Story, Reels, IGTV",
    vi: "Hỗ trợ Photo, Video, Story, Reels, IGTV",
  },
  runInExtensionContext: true,

  func: async function () {
    function getParamsFromResponse(reponseText) {
      let i = reponseText.lastIndexOf(")}(");
      let allParamsStr = reponseText.slice(i + 3, reponseText.length - 2);
      return allParamsStr.split(",").map((_) => {
        let number = Number(_);
        return !isNaN(number) ? number : JSON.parse(_);
      });
    }

    function getLinkFromSomethingResult(somethingResult) {
      let jwttoken = /token=(.*)&/.exec(somethingResult)?.[1];
      let data = parseJwt(jwttoken);
      console.log(data);
      return data?.url;
    }

    async function getLinkSnapInsta(instaURL, lang = "vi") {
      let formData = new FormData();
      formData.append("lang", lang);
      formData.append("action", "post");
      formData.append("url", instaURL);

      let res = await fetch("https://snapinsta.app/action.php", {
        method: "POST",
        body: formData,
      });

      let text = await res.text();
      console.log(text);
      //   let params = getParamsFromResponse(text);
      //   let somethingResult = doSomething2(...params);
      //   console.log(somethingResult);
      //   let link = getLinkFromSomethingResult(somethingResult);
      //   return link;
    }

    let instaURL = prompt(
      "Nhập link instagram video/ảnh/story/reels/IGTV:",
      ""
    );
    if (instaURL != null) {
      let { closeLoading, setLoadingText } = showLoading("Đang chuẩn bị...");
      try {
        setLoadingText("Đang get link tiktok bằng SnapInsta...");
        let link = await getLinkSnapInsta(instaURL);
        if (!link) throw Error("Không tìm thấy link");

        window.open(link);
      } catch (e) {
        prompt(
          "Lỗi: " + e + "\n\nBạn có thể mở trang web sau để thử lại:",
          "https://snapinsta.app"
        );
      } finally {
        closeLoading();
      }
    }
  },
};
