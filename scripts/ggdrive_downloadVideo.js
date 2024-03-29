import {
  getCurrentTab,
  openPopupWithHtml,
  runScriptInCurrentTab,
  showLoading,
} from "./helpers/utils.js";

export default {
  icon: "https://drive-thirdparty.googleusercontent.com/32/type/video/mp4",
  name: {
    en: "GG Drive - Download video",
    vi: "GG Drive - Tải video",
  },
  description: {
    en: "Download google drive video that dont have download button",
    vi: "Tải video không có nút download trên google drive",
  },
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/974953859503401/",

  onClickExtension: async function () {
    let { closeLoading } = showLoading("Đang tìm link video...");
    try {
      let docid = await shared.getDocIdFromWebsite();

      if (!docid) {
        let tab = await getCurrentTab();
        let url = prompt("Nhập link google drive video: ", tab.url);
        if (url == null) return;
        docid = shared.getDocIdFromUrl(url);
        if (!docid)
          throw Error("Link không hợp lệ. Không tìm thấy id trong link.");
      }

      let res = await shared.getLinkVideoGDriveFromDocId(docid);
      if (!res?.length) throw Error("Không tìm được link video.");
      console.log(res);

      openPopupWithHtml(
        `<h1>${res[0].name}</h1>
        ${res
          .map((_) => {
            let name = _.name.replace(/ /g, "_");
            return /*html*/ `<div>
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

export const shared = {
  // https://stackoverflow.com/a/16840612
  getDocIdFromUrl: function (url) {
    return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/);
  },

  getDocIdFromWebsite: async function () {
    return await runScriptInCurrentTab(() => {
      return window?.viewerData?.config?.id;
    });
  },

  // Post: https://www.facebook.com/groups/j2team.community/posts/974953859503401/
  getLinkVideoGDriveFromDocId: async function (docid) {
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

    async function getLink(docid) {
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

      return result;
    }

    return await getLink(docid);
  },
};
