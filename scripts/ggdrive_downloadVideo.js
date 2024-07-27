import { BADGES } from "./helpers/badge.js";

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
  badges: [BADGES.hot],
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/974953859503401/",

  changeLogs: {
    "2024-07-25": "add backup plan",
  },

  popupScript: {
    onClick: async function () {
      const { getCurrentTab, openPopupWithHtml, showLoading } = await import(
        "./helpers/utils.js"
      );
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
  },
  contentScript: {
    onClick_: async () => {
      let url = new URL(location.href);
      const player_response = url.searchParams.get("player_response");
      if (player_response) {
        const json = JSON.parse(player_response);
        console.log(document.title, json);

        const { openPopupWithHtml } = await import("./helpers/utils.js");
        openPopupWithHtml(
          `<h1>${document.title}</h1>
        ${json.streamingData.formats
          .map((_) => {
            return /*html*/ `<div>
              <h1><a href="${_.url}" target="_blank">${_.quality}</a></h1>
              <video src="${_.url}" controls style="max-width:95%" />
            </div>`;
          })
          .join("<br/>")}`,
          700,
          700
        );
      }
    },
  },
};

export const shared = {
  // https://stackoverflow.com/a/16840612
  getDocIdFromUrl: function (url) {
    return url.match(/[-\w]{25,}(?!.*[-\w]{25,})/);
  },

  getDocIdFromWebsite: async function () {
    const { runScriptInCurrentTab } = await import("./helpers/utils.js");
    return await runScriptInCurrentTab(() => {
      return window?.viewerData?.config?.id;
    });
  },

  // Post: https://www.facebook.com/groups/j2team.community/posts/974953859503401/
  getLinkVideoGDriveFromDocId: async function (docid) {
    function parse(e) {
      let result = {};
      let a = new URLSearchParams(e);
      a.entries().forEach((e) => {
        result[e[0]] = e[1];
      });
      return result;

      // Array.from(new URLSearchParams("").entries())
      // .reduce((total, cur) => ({ ...total, [cur[0]]: cur[1] }), {});
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

      if (json?.status === "fail") {
        throw Error("FAILED: " + json.reason);
      }

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
