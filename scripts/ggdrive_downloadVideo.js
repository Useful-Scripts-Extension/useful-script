import {
  getCurrentTab,
  openPopupWithHtml,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: "https://drive.google.com/favicon.ico",
  name: {
    en: "GG Drive - Download video",
    vi: "GG Drive - Tải video",
  },
  description: {
    en: "Download google drive video that dont have download button",
    vi: "Tải video không có nút download trên google drive",
  },
  blackList: [],
  whiteList: [],
  runInExtensionContext: true,

  func: async function () {
    // Post: https://www.facebook.com/groups/j2team.community/posts/974953859503401/

    async function getLinkVideoGDrive(docid) {
      function parse(e) {
        var result = {};
        return (
          e.split("&").forEach(function (e) {
            result[decodeURIComponent(e.substring(0, e.indexOf("=")))] =
              decodeURIComponent(e.substring(e.indexOf("=") + 1));
          }),
          result
        );
      }

      function parseStream(e) {
        var d = [];
        return (
          e.split(",").forEach(function (e) {
            d.push(parse(e));
          }),
          d
        );
      }

      async function getVideoLinkFromDocId(docid) {
        let res = await fetch(
          "https://drive.google.com/get_video_info?docid=" + docid
        );

        let text = await res.text();
        let json = parse(text);

        json.url_encoded_fmt_stream_map = parseStream(
          json.url_encoded_fmt_stream_map
        );

        let result = json.url_encoded_fmt_stream_map.map(function (stream) {
          let name = json.title.replace(/\+/g, " ");
          return {
            idfile: docid,
            name: name,
            quality: stream.quality,
            url: stream.url,
          };
        });

        console.log(result);
        return result;
      }

      // let { id, title } = window?.viewerData?.config;
      return await getVideoLinkFromDocId(docid);
    }

    // https://stackoverflow.com/a/16840612
    function getIdFromUrl(url) {
      return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/);
    }

    let { closeLoading } = showLoading("Đang tìm link video...");
    try {
      let docid = await runScriptInCurrentTab(() => {
        return window?.viewerData?.config?.id;
      });

      if (!docid) {
        let tab = await getCurrentTab();
        let url = prompt("Nhập link google drive video: ", tab.url);
        if (url == null) return;
        docid = getIdFromUrl(url);
        if (!docid)
          throw Error("Link không hợp lệ. Không tìm thấy id trong link.");
      }

      let res = await getLinkVideoGDrive(docid);
      if (!res?.length) throw Error("Không tìm được link video.");
      console.log(res);

      openPopupWithHtml(
        `<h1>${res[0].name}</h1>
        ${res
          .map((_) => {
            let name = _.name.replace(/ /g, "_");
            return `<div>
              <h1><a href="${_.url}" target="_blank">${_.quality}</a></h1>
              <video src="${_.url}" controls style="max-width:95%" />
            </div>`;
          })
          .join("<br/>")}`,
        700,
        700
      );
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};

export const shared = {};
