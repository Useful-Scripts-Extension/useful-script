export default {
  icon: "",
  name: {
    en: "Zing mp3 music dowloader",
    vi: "Tải nhạc zing mp3",
  },
  description: {
    en: "",
    vi: "",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    // Idea: https://viblo.asia/p/zing-mp3-toi-da-khai-thac-api-nhu-the-nao-L4x5xvdaZBM

    // #region helpers
    // https://remarkablemark.medium.com/how-to-generate-a-sha-256-hash-with-javascript-d3b2696382fd
    async function getHash256(string) {
      const utf8 = new TextEncoder().encode(string);
      const hashBuffer = await crypto.subtle.digest("SHA-256", utf8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, "0"))
        .join("");
      return hashHex;
    }

    // https://stackoverflow.com/a/47332317
    const getHmac512 = async (str, key) => {
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
    };

    const URL_API = "https://zingmp3.vn";
    const API_KEY = "X5BM3w8N7MKozC0B85o4KMlzLZKhV00y";
    const SECRET_KEY = "acOrvUS15XRW2o9JksiK1KgQ6Vbds8ZW";

    let sharedCtime = 0;

    const hashParam = async (path, param = "", willHashParam = true) => {
      sharedCtime = Math.floor(Date.now() / 1000);
      let strToHash = `ctime=${sharedCtime}`;
      if (willHashParam) strToHash += param.split("&").join("");
      const hash = await getHash256(strToHash);
      const sig = await getHmac512(path + hash, SECRET_KEY);
      return sig;
    };

    const requestZing = async ({ path, qs, willHashParam }) => {
      let param = new URLSearchParams(qs).toString();
      let sig = await hashParam(path, param, willHashParam);

      let params = {
        ...qs,
        ctime: sharedCtime,
        apiKey: API_KEY,
        sig,
      };

      return URL_API + path + "?" + new URLSearchParams(params).toString();
    };
    // #endregion

    const ZingMp3 = {
      //#region extract id
      getSongIdFromURL(url) {
        if (
          !url?.length ||
          url.indexOf("zingmp3.vn/bai-hat/") < 0 ||
          url.indexOf(".html") < 0
        ) {
          alert(
            "URL không đúng định dạng https://zingmp3.vn/bai-hat/.../{id}.html"
          );
          return false;
        }
        return url.split("/").at(-1).split(".html")[0];
      },
      getAlbumIdFromURL(url) {
        if (
          !url?.length ||
          url.indexOf("zingmp3.vn/album/") < 0 ||
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
        return await requestZing({
          path: "/api/v2/song/get/streaming",
          qs: { id },
        });
      },
      async getInfoMusic(id) {
        return await requestZing({
          path: "/api/v2/song/get/info",
          qs: { id },
        });
      },
      async getTop100() {
        return await requestZing({
          path: "/api/v2/page/get/top-100",
        });
      },
      async search(keyword) {
        return await requestZing({
          path: "/api/v2/search/multi",
          qs: { q: keyword },
          willHashParam: false,
        });
      },
      //#endregion

      //#region other APIs
      async getDetailPlaylist(playlistId) {
        return await requestZing({
          path: "/api/v2/page/get/playlist",
          qs: { id: playlistId },
        });
      },
      async getDetailArtist(alias) {
        return await requestZing({
          path: "/api/v2/page/get/artist",
          qs: { alias },
          willHashParam: false,
        });
      },
      async getChartHome() {
        return await requestZing({
          path: "/api/v2/page/get/chart-home",
        });
      },
      async getWeekChart(id) {
        return await requestZing({
          path: "/api/v2/page/get/week-chart",
          qs: { id },
        });
      },
      async getNewReleaseChart() {
        return await requestZing({
          path: "/api/v2/page/get/newrelease-chart",
        });
      },
      async getRecommendKeyword() {
        return await requestZing({
          path: "/api/v2/app/get/recommend-keyword",
        });
      },
      async getUserConfig() {
        return await requestZing({
          path: "/api/v2/app/get/config",
        });
      },
      async getProfileInfo() {
        return await requestZing({
          path: "/api/v2/user/profile/get/info",
        });
      },
      async getUserAssets() {
        return await requestZing({
          path: "/api/v2/user/assets/get/assets",
        });
      },
      async getUserSyncData() {
        return await requestZing({
          path: "/api/v2/user/sync/get/data",
        });
      },
      async getUserMusicOverview() {
        return await requestZing({
          path: "/api/v2/user/mymusic/get/overview",
        });
      },
      async getHome(page = 1) {
        return await requestZing({
          path: "/api/v2/page/get/home",
          qs: { page },
        });
      },
      //   async getUserListSong({
      //     type = "library",
      //     page = 1,
      //     count = 50,
      //     sectionId = "mFavSong",
      //   } = {}) {
      //     return await requestZing({
      //       path: "/api/v2/user/song/get/list",
      //       qs: { type, page, count, sectionId },
      //       //   willHashParam: false,
      //     });
      //   },
      //   async getSectionPlaylist(id) {
      //     return await requestZing({
      //       path: "/api/v2/playlist/getSectionBottom",
      //       qs: { id },
      //     });
      //   },
      //   async getLastPlaying() {
      //     return await requestZing({
      //       path: "/api/v2/user/lasplaying/get/lasplaying",
      //     });
      //   },
      //#endregion
    };

    (async function () {
      let url = window.prompt("Nhap link bai hat: ", location.href);
      let songid = ZingMp3.getSongIdFromURL(url);
      //   let url_playlist = window.prompt("Nhap link album: ", location.href);
      //   let playlistId = ZingMp3.getAlbumIdFromURL(url_playlist);
      //   window.open(await ZingMp3.getDetailPlaylist(songid));
      //   window.open(await ZingMp3.getStreaming(songid));
      //   window.open(await ZingMp3.search("Sơn tùng"));
      //   window.open(await ZingMp3.getDetailPlaylist(playlistId));
      window.open(await ZingMp3.getStreaming(songid));
    })();
  },
};
