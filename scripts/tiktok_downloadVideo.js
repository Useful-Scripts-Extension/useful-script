import {
  openPopupWithHtml,
  parseJwt,
  showLoading,
  showPopup,
} from "./helpers/utils.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
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

    //prettier-ignore
    function doSomething(e,i,n){for(var r="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),t=r.slice(0,i),f=r.slice(0,n),o=e.split("").reverse().reduce(function(e,n,r){if(-1!==t.indexOf(n))return e+t.indexOf(n)*Math.pow(i,r)},0),c="";o>0;)c=f[o%n]+c,o=(o-o%n)/n;return c||"0"}
    //prettier-ignore
    function doSomething2(r,o,e,n,a,f){f="";for(var t=0,g=r.length;t<g;t++){for(var h="";r[t]!==e[a];)h+=r[t],t++;for(var l=0;l<e.length;l++)h=h.replace(RegExp(e[l],"g"),l);f+=String.fromCharCode(doSomething(h,a,10)-n)}return decodeURIComponent(escape(f))}

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
  /**
     * {
        "id": 2,
        "priority": 1,
        "action": {
            "type": "modifyHeaders",
            "requestHeaders": [
                {
                    "header": "referer",
                    "operation": "set",
                    "value": "https://ssstik.io/vi"
                },
                {
                    "header": "origin",
                    "operation": "set",
                    "value": "https://ssstik.io"
                },
                {
                    "header": "hx-current-url",
                    "operation": "set",
                    "value": "https://ssstik.io/vi"
                },
                {
                    "header": "hx-request",
                    "operation": "set",
                    "value": "true"
                },
                {
                    "header": "hx-target",
                    "operation": "set",
                    "value": "target"
                },
                {
                    "header": "hx-trigger",
                    "operation": "set",
                    "value": "_gcaptcha_pt"
                },
                {
                    "header": "content-type",
                    "operation": "set",
                    "value": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            ]
        },
        "condition": {
            "domain": "extension://*",
            "urlFilter": "https://ssstik.io/abc?url=dl",
            "resourceTypes": [
                "xmlhttprequest"
            ]
        }
    }
     */
}
