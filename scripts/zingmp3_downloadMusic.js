export default {
  icon: "https://zjs.zmdcdn.me/zmp3-desktop/releases/v1.7.64/static/media/icon_zing_mp3_60.f6b51045.svg",
  name: {
    en: "Zingmp3 music dowloader (API)",
    vi: "Zingmp3 tải nhạc (API)",
  },
  description: {
    en: "Download music on mp3.zing.vn and zingmp3.vn using zingmp3 API",
    vi: "Tải nhạc trên mp3.zing.vn và zingmp3.vn thông qua zingmp3 API",
  },

  popupScript: {
    onClick: async function () {
      const { getCurrentTab } = await import("./helpers/utils.js");

      // Idea: https://viblo.asia/p/zing-mp3-toi-da-khai-thac-api-nhu-the-nao-L4x5xvdaZBM

      const URL_API = "https://zingmp3.vn";
      const API_KEY = "X5BM3w8N7MKozC0B85o4KMlzLZKhV00y";
      const SECRET_KEY = "acOrvUS15XRW2o9JksiK1KgQ6Vbds8ZW";

      let sharedCtime = 0;
      const Utils = {
        // https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
        getHash256: async function (string) {
          const utf8 = new TextEncoder().encode(string);
          const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray
            .map((bytes) => bytes.toString(16).padStart(2, "0"))
            .join("");
          return hashHex;
        },

        // https://stackoverflow.com/a/47332317
        getHmac512: async (str, key) => {
          const enc = new TextEncoder("utf-8");
          const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            enc.encode(key),
            { name: "HMAC", hash: { name: "SHA-512" } },
            false,
            ["sign", "verify"]
          );
          const signature = await window.crypto.subtle.sign(
            "HMAC",
            cryptoKey,
            enc.encode(str)
          );
          const b = new Uint8Array(signature);
          const result = Array.prototype.map
            .call(b, (x) => x.toString(16).padStart(2, "0"))
            .join("");
          return result;
        },

        hashParam: async (path, param = "", willHashParam = true) => {
          sharedCtime = Math.floor(Date.now() / 1000);
          let strToHash = `ctime=${sharedCtime}`;
          if (willHashParam) strToHash += param.split("&").join("");
          const hash = await Utils.getHash256(strToHash);
          const sig = await Utils.getHmac512(path + hash, SECRET_KEY);
          return sig;
        },

        requestZing: async ({ path, qs, willHashParam, host = URL_API }) => {
          let param = new URLSearchParams(qs).toString();
          let sig = await Utils.hashParam(path, param, willHashParam);

          let params = {
            ...qs,
            ctime: sharedCtime,
            apiKey: API_KEY,
            sig,
          };

          return host + path + "?" + new URLSearchParams(params).toString();
        },
      };

      const ZingMp3 = {
        //#region extract id
        getSongIdFromURL(url) {
          if (
            !url?.length ||
            (url.indexOf("zingmp3.vn/bai-hat/") < 0 &&
              url.indexOf("mp3.zing.vn/bai-hat/") < 0) ||
            url.indexOf(".html") < 0
          ) {
            alert(
              "URL không đúng định dạng https://zingmp3.vn/bai-hat/.../{id}.html"
            );
            return false;
          }
          return url.split("/").at(-1).split(".html")[0];
        },
        getPlaylistIdFromURL(url) {
          if (
            !url?.length ||
            (url.indexOf("zingmp3.vn/bai-hat/") < 0 &&
              url.indexOf("mp3.zing.vn/bai-hat/") < 0) ||
            url.indexOf(".html") < 0
          ) {
            alert(
              "URL không đúng định dạng https://zingmp3.vn/album/.../{id}.html"
            );
            return false;
          }
          return url.split("/").at(-1).split(".html")[0];
        },
        //#endregion

        //#region hot APIs
        async getStreaming(id) {
          return await Utils.requestZing({
            path: "/api/v2/song/get/streaming",
            qs: { id },
          });
        },
        async getInfoMusic(id) {
          return await Utils.requestZing({
            path: "/api/v2/song/get/info",
            qs: { id },
          });
        },
        async getTop100() {
          return await Utils.requestZing({
            path: "/api/v2/page/get/top-100",
          });
        },
        async search(keyword) {
          return await Utils.requestZing({
            path: "/api/v2/search/multi",
            qs: { q: keyword },
            willHashParam: false,
          });
        },
        async downloadSong(id) {
          return await Utils.requestZing({
            host: "https://download.zingmp3.vn",
            path: "/api/v2/download/post/song",
            qs: { id },
          });
        },
        async getLyric(id) {
          return await Utils.requestZing({
            path: "/api/v2/lyric/get/lyric",
            qs: { id },
          });
        },
        //#endregion

        //#region other APIs
        async getDetailPlaylist(playlistId) {
          return await Utils.requestZing({
            path: "/api/v2/page/get/playlist",
            qs: { id: playlistId },
          });
        },
        async getDetailArtist(alias) {
          return await Utils.requestZing({
            path: "/api/v2/page/get/artist",
            qs: { alias },
            willHashParam: false,
          });
        },
        async getChartHome() {
          return await Utils.requestZing({
            path: "/api/v2/page/get/chart-home",
          });
        },
        async getWeekChart(id) {
          return await Utils.requestZing({
            path: "/api/v2/page/get/week-chart",
            qs: { id },
          });
        },
        async getNewReleaseChart() {
          return await Utils.requestZing({
            path: "/api/v2/page/get/newrelease-chart",
          });
        },
        async getRecommendKeyword() {
          return await Utils.requestZing({
            path: "/api/v2/app/get/recommend-keyword",
          });
        },
        async getUserConfig() {
          return await Utils.requestZing({
            path: "/api/v2/app/get/config",
          });
        },
        async getProfileInfo() {
          return await Utils.requestZing({
            path: "/api/v2/user/profile/get/info",
          });
        },
        async getUserAssets() {
          return await Utils.requestZing({
            path: "/api/v2/user/assets/get/assets",
          });
        },
        async getUserSyncData() {
          return await Utils.requestZing({
            path: "/api/v2/user/sync/get/data",
          });
        },
        async getUserMusicOverview() {
          return await Utils.requestZing({
            path: "/api/v2/user/mymusic/get/overview",
          });
        },
        async getHome(page = 1) {
          return await Utils.requestZing({
            path: "/api/v2/page/get/home",
            qs: { page },
          });
        },
        async getLastPlaying() {
          return await Utils.requestZing({
            path: "/api/v2/user/lasplaying/get/lasplaying",
          });
        },
        //#endregion
      };

      (async function () {
        // window.open(await ZingMp3.getHome());
        // window.open(await ZingMp3.getLyric("ZZDEZ8UC"));
        // window.open(await ZingMp3.getInfoMusic("ZZDEZ8UC"));
        // window.open(await ZingMp3.getStreaming("ZZDEZ8UC"));
        // window.open(await ZingMp3.search("game thủ liên minh"));
        // window.open(await ZingMp3.getUserMusicOverview());
        // window.open(await ZingMp3.getDetailPlaylist("Z6CZOIWU"));
        // window.open(await ZingMp3.getDetailArtist("ICM"));

        // window.open(await ZingMp3.getChartHome()); // => die
        // window.open(await ZingMp3.getLastPlaying()); // => not working?
        // window.open(await ZingMp3.downloadSong("Z7ZCD9BD")); // => some songs be blocked on pc
        // return;

        const tab = await getCurrentTab();
        let url = prompt("Nhập link hoặc id bài hát: ", tab.url);
        if (url) {
          let songid = url.length > 10 ? ZingMp3.getSongIdFromURL(url) : url;
          if (songid) {
            try {
              const streamUrl = await ZingMp3.getStreaming(songid);
              const res = await fetch(streamUrl);
              const json = await res.json();
              console.log(json);
              if (json.err) throw new Error(json.msg);
              if (!json.data) throw new Error("No Data");

              let options = Object.keys(json.data);
              let choice = prompt(
                "Chọn chất lượng nhạc: \n" + options.join("\n"),
                options[options.length - 1]
              );

              if (choice !== null) {
                let url = json.data[choice];
                window.open(url);
              }
            } catch (error) {
              alert("ERROR: " + error);
            }
          }
        }
      })();
    },
  },
};

function backup() {
  // https://mp3.zing.vn/xhr/media/get-url-download?type=audio&panel=.fn-tab-panel-service&type=audio&sig=7a6af5a44e7d0209a6f852c03dbcc317&code=ZHJmtLLdNSsNdssyHyDHZmyLXCJsmNuNN&aliastitle=&title=&count=&id=Z6WZD78I&group=.fn-tab-panel
  const MP3 = {
    XHR_URL: "//mp3.zing.vn/xhr",
    IMG_URL: "https://photo-zmp3.zmdcdn.me",
    API_VIP_URL: "//vip-api.zingmp3.vn/",
    API_COMMENT_URL: "//comment.api.mp3.zing.vn",
    DOWNLOAD_API: "https://download.mp3.zing.vn/api",
  };

  if (location.hostname === "mp3.zing.vn") {
    let a = document.querySelector("#tabService");
    let params = {};

    Object.entries(a.attributes).forEach(([index, attribute]) => {
      if (attribute?.name?.startsWith("data-")) {
        let key = attribute.name.replace("data-", "");
        let value = attribute.value;
        params[key] = value;
      }
    });

    fetch(
      MP3.XHR_URL +
        "/media/get-url-download?" +
        new URLSearchParams(params).toString()
    )
      .then((res) => {
        console.log(res);
        return res.json();
      })
      .then((json) => {
        if (json && !json.err && json.data) {
          console.log(json.data);
          let { artist, thumb, title, sources } = json.data;
          const { 128: song128, 320: song320, lossless } = sources;

          window.open("https://mp3.zing.vn" + song128.link);
        }
      })
      .catch((e) => {
        alert("Error: " + e.message);
      });
    // window.open(MP3.XHR_URL + window.xmlLink);
    return;
  }
}
