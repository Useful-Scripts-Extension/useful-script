import {
  doSomething2,
  parseJwt,
  showLoading,
  showPopup,
} from "./helpers/utils.js";

export default {
  icon: "https://snaptik.app/pwa/img/icon_x192.png",
  name: {
    en: "Tiktok - Download video (Snaptik)",
    vi: "Tiktok - Tải video (Snaptik)",
  },
  description: {
    en: "Download tiktok video using Snaptik API",
    vi: "Tải tiktok video sử dụng Snaptik API",
  },
  runInExtensionContext: true,

  func: async function () {
    async function getTokenSnapTik() {
      let res = await fetch("https://snaptik.app/vn");
      let text = await res.text();
      return {
        lang: "vn",
        token: /name="token" value="(.*)" type="hidden"/.exec(text)?.[1],
      };
    }

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
      return data?.url;
    }

    async function getLinkSnapTik(tiktokURL, token, lang) {
      let formData = new FormData();
      formData.append("lang", lang);
      formData.append("token", token);
      formData.append("url", tiktokURL);

      let res = await fetch("https://snaptik.app/abc2.php", {
        method: "POST",
        body: formData,
      });

      let text = await res.text();
      let params = getParamsFromResponse(text);
      let somethingResult = doSomething2(...params);
      let link = getLinkFromSomethingResult(somethingResult);
      return link;
    }

    let tiktokUrl = prompt("Nhập link tiktok video:", "");
    if (tiktokUrl != null) {
      let { closeLoading, setLoadingText } = showLoading(
        "Đang lấy token SnapTik..."
      );
      try {
        let { lang, token } = await getTokenSnapTik();
        if (!token) throw Error("Không lấy đƯợc token SnapTik");

        setLoadingText("Đang get link tiktok bằng SnapTik...");
        let link = await getLinkSnapTik(tiktokUrl, token, lang);
        if (!link) throw Error("Không tìm thấy link");

        window.open(link);
      } catch (e) {
        prompt(
          "Lỗi: " + e + "\n\nBạn có thể mở trang web sau để thử lại:",
          "https://snaptik.app"
        );
      } finally {
        closeLoading();
      }
    }
  },
};

function backup() {
  // https://www.tiktok.com/oembed?url=https://www.tiktok.com/@tiktok/video/7166186013432253722

  let a = {
    web: "https://ssstik.io/",
    func: async function (url) {
      async function getTokenSsstik() {
        let res = await fetch("https://ssstik.io/vi");
        let text = await res.text();
        return {
          lang: "vi",
          token: /"tt:'(.*)'/.exec(text)?.[1],
        };
      }

      async function getLinkSsstik(tiktokURL, token, lang) {
        let formData = new FormData();
        formData.append("locale", lang);
        formData.append("tt", token);
        formData.append("id", tiktokURL);

        let res = await fetch("https://ssstik.io/abc?url=dl", {
          method: "POST",
          body: formData,
        });

        return await res.text();
      }

      let { closeLoading, setLoadingText } = showLoading(
        "Đang lấy token ssstik..."
      );
      try {
        let { lang, token } = await getTokenSsstik();
        if (!token) throw Error("Không lấy được token ssstik");
        alert(token);

        setLoadingText("Đang get link tiktok bằng ssstik...");
        let text = await getLinkSsstik(url, token, lang);
        showPopup("Ssstik", text);

        return true;
      } catch (e) {
        prompt(
          "Lỗi: " + e + "\n\nBạn có thể mở link sau để get video tiktok:",
          "https://snaptik.app"
        );
        return false;
      } finally {
        closeLoading();
      }
    },
  };
}
