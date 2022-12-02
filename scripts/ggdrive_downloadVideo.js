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
  runInExtensionContext: false,

  func: async function () {
    // Post: https://www.facebook.com/groups/j2team.community/posts/974953859503401/

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

    function downloadVideo(videoInfo) {
      window.open(videoInfo.url + "&filename=" + videoInfo.name);
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

    try {
      let { id, title } = window.viewerData.config;
      console.log("get link...");
      await getVideoLinkFromDocId(id);
    } catch (e) {
      alert("ERROR: " + e);
    }
  },
};
