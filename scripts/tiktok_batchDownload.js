import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { hookFetch } from "./libs/ajax-hook/index.js";

export default {
  icon: "https://www.tiktok.com/favicon.ico",
  name: {
    en: "Tiktok - Batch download",
    vi: "Tiktok - Tải hàng loạt",
  },
  description: {
    en: "Select and download all tiktok video (user profile, tiktok explore).",
    vi: "Tải hàng loạt video tiktok (trang người dùng, trang tìm kiếm), có giao diện chọn video muốn tải.",
    img: "/scripts/tiktok_batchDownload.jpg",
  },

  changeLogs: {
    "2024-04-27": "fix bug - use snaptik",
    "2024-05-16": "fix style",
  },

  whiteList: ["https://www.tiktok.com/*"],

  pageScript: {
    onDocumentStart: async () => {
      const CACHED = {
        videoById: new Map(),
      };

      // reference to Cached
      window.ufs_tiktok_batchDownload = CACHED;

      hookFetch({
        onAfter: async (url, options, response) => {
          if (url.includes("item_list/")) {
            const res = response.clone();
            const json = await res.json();
            console.log(json);

            if (json?.itemList) {
              json.itemList.forEach((_) => {
                if (_.video.playAddr) CACHED.videoById.set(_.video.id, _);
              });
            }
          }

          if (url.includes("api/search")) {
            const res = response.clone();
            const json = await res.json();
            console.log(json);

            if (json.data?.length) {
              json.data.forEach((_) => {
                if (_.type === 1) {
                  CACHED.videoById.set(_.item.video.id, _.item);
                }
              });
            }
          }
        },
      });

      UfsGlobal.Extension.getURL("/scripts/tiktok_batchDownload.css").then(
        UfsGlobal.DOM.injectCssFile
      );
      await UfsGlobal.DOM.injectScriptSrcAsync(
        await UfsGlobal.Extension.getURL("/scripts/libs/vue/index.js")
      );

      const div = document.createElement("div");
      document.documentElement.appendChild(div);

      const formatter = UfsGlobal.Utils.getNumberFormatter("compactShort");

      const app = new Vue({
        template: /*html*/ `
<div id="ufs_tiktok_batchDownload">
  <div class="ufs_floating_btn" @click="showModal = true">📥 {{totalCount}}</div>
  <div class="ufs_container" v-if="showModal" @click.self="showModal = false">
    <div class="ufs_popup">
      <h1 style="text-align:center">Tiktok - Useful Scripts</h1>
      <h2 style="text-align:center">Found {{totalCount}} videos</h2>

      <div class="ufs_popup_header">
        <button id="video" @click="downloadVideo">🎬 {{videoTitle}}</button>
        <button id="audio" @click="downloadAudio">🎧 {{audioTitle}}</button>
        <button id="json" @click="downloadJson">📄 Download json</button>
        <button id="clear" @click="clear">🗑️ Clear</button>
        <input type="text" id="search" placeholder="🔎 Search..." v-model="search" >
        {{search}}
      </div>

      <div class="table_wrap">
        <table>
          <thead>
            <tr>
              <th @click="setSortBy('index')" class="clickable">#</th>
              <th>🎬 Video</th>
              <th @click="setSortBy('title')" class="clickable">Title</th>
              <th @click="setSortBy('author')" class="clickable">👤 User</th>
              <th @click="setSortBy('view')" class="clickable">View</th>
              <th @click="setSortBy('duration')" class="clickable">Length</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="videosToShow.length === 0">
              <td colspan="7"><h2 style="text-align:center">No video</h2></td>
            </tr>
            <tr v-for="v in videosToShow" :key="v.id">
<td>{{v.index}}</td>
<td>
  <a target="_blank" :href="v.video.playAddr">
    <img :src="v.video.cover" style="width:150px" />
  </a>
</td>
<td><p style="max-width:200px">{{v.desc}}</p></td>
<td>
  <img :src="v.author.avatarThumb" class="ufs_avatar" @click="openUser(v.author.uniqueId)"/>
  {{v.author.nickname}}<br/>
  {{v.author.uniqueId}}<br/>
  {{v.author.id}}
</td>
<td>{{format(v.stats.playCount)}}</td>
<td>{{v.video.duration}}s</td>
<td>
  <p style="max-width:200px">
    <a :href="v.video.playAddr" download target="_blank">🎬 Video</a><br/>
    <a :href="v.video.cover" download target="_blank">🖼️ Cover</a><br/>
    <a :href="v.author.avatarLarger" download target="_blank">
    👤 Avatar
    </a><br/>
    <a :href="v.music.playUrl" download target="_blank">
    🎧 Music: {{v.music.title}}
    </a>
  </p>
</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>`,
        created() {
          setInterval(() => {
            this.videos = Array.from(CACHED.videoById.values())
              // inject index
              .map((v, i) => ({ ...v, index: i + 1 }));
          }, 1000);
        },
        data() {
          return {
            showModal: false,
            videos: [],
            search: "",
            sortBy: "index",
            sortDir: "asc",
            downloading: {},
          };
        },
        computed: {
          videoTitle() {
            if (this.downloading.video) {
              return (
                "Downloading " +
                this.downloading.video +
                "/" +
                this.videosToShow.length +
                " videos"
              );
            }
            return "Downloaded " + this.videosToShow.length + " videos";
          },
          audioTitle() {
            if (this.downloading.audio) {
              return (
                "Downloading " +
                this.downloading.audio +
                "/" +
                this.uniqueAudio.length +
                " audios"
              );
            }
            return "Downloaded " + this.uniqueAudio.length + " audios";
          },
          uniqueAudio() {
            const result = new Map();
            for (const item of this.videosToShow) {
              if (!result.has(item.music.id)) result.set(item.music.id, item);
            }
            return Array.from(result.values());
          },
          totalCount() {
            return this.videos.length;
          },
          videosToShow() {
            return (
              this.videos
                // filter by search
                .filter((v) => {
                  return [
                    v.desc,
                    v.author.id,
                    v.author.nickname,
                    v.author.uniqueId,
                  ].some((s) =>
                    s.toLowerCase().includes(this.search.toLowerCase())
                  );
                })
                // sorting
                .sort((a, b) => {
                  switch (this.sortBy) {
                    case "index":
                      return this.sortDir === "asc"
                        ? a.index - b.index
                        : b.index - a.index;
                    case "title":
                      return this.sortDir === "asc"
                        ? a.desc.localeCompare(b.desc)
                        : b.desc.localeCompare(a.desc);
                    case "author":
                      return this.sortDir === "asc"
                        ? a.author.nickname.localeCompare(b.author.nickname)
                        : b.author.nickname.localeCompare(a.author.nickname);
                    case "view":
                      return this.sortDir === "asc"
                        ? a.stats.playCount - b.stats.playCount
                        : b.stats.playCount - a.stats.playCount;
                    case "duration":
                      return this.sortDir === "asc"
                        ? a.video.duration - b.video.duration
                        : b.video.duration - a.video.duration;
                  }
                })
            );
          },
        },
        methods: {
          async downloadVideo() {
            const total = this.videosToShow.length;
            if (!total) return;
            const success = 0;
            this.downloading.video = true;
            await download({
              folderName: "tiktok_videos",
              expectBlobType: "video/mp4",
              data: this.videosToShow.map((_, i) => {
                const urlList =
                  _.video?.bitrateInfo?.find?.(
                    (b) => b.Bitrate === _.video.bitrate
                  )?.PlayAddr?.UrlList || [];
                const bestUrl = urlList[urlList.length - 1];
                return {
                  url: bestUrl || _.video.playAddr,
                  filename:
                    i +
                    1 +
                    "_" +
                    UfsGlobal.Utils.sanitizeName(_.id, false) +
                    ".mp4",
                };
              }),
              onProgressItem: (i, total) => {
                this.downloading.video = i;
              },
              onFinishItem: (i, total) => {
                success++;
              },
            });
            alert("Downloaded " + success + "/" + total + " videos!");
            this.downloading.video = false;
          },
          async downloadAudio() {
            const total = this.uniqueAudio.length;
            if (!total) return;
            this.downloading.audio = true;
            const success = 0;
            await download({
              folderName: "tiktok_musics",
              data: this.uniqueAudio.map((_, i) => ({
                url: _.music.playUrl,
                filename:
                  i +
                  1 +
                  "_" +
                  UfsGlobal.Utils.sanitizeName(
                    _.music.title.substr(0, 50) || "audio",
                    false
                  ) +
                  ".mp3",
              })),
              onProgressItem: (i, total) => {
                this.downloading.audio = i;
              },
              onFinishItem: (i, total) => {
                success++;
              },
            });
            alert("Downloaded " + success + "/" + total + " videos!");
            this.downloading.audio = false;
          },
          downloadJson() {
            UfsGlobal.Utils.downloadData(
              JSON.stringify(this.videosToShow, null, 4),
              this.videosToShow.length + "_videos_tiktok.json"
            );
          },
          clear() {
            if (confirm("Are you sure want to clear all?")) {
              CACHED.videoById.clear();
              this.videos = [];
            }
          },
          setSortBy(key) {
            this.sortBy = key;
            if (key === this.sortBy)
              this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
          },
          openUser(id) {
            window.open("https://www.tiktok.com/@" + id, "_blank");
          },
          format(v) {
            return formatter.format(v);
          },
          onClickContainer(e) {
            if (e.target === this.$el) this.showModal = false;
          },
        },
      }).$mount(div);

      async function download({
        folderName = "tiktok",
        expectBlobType,
        data,
        onProgressItem,
        onFinishItem,
      }) {
        const dir = await UfsGlobal.Utils.chooseFolderToDownload(folderName);
        onProgressItem?.(0, data.length);

        for (let i = 0; i < data.length; ++i) {
          try {
            onProgressItem?.(i + 1, data.length);
            const { url, filename } = data[i];
            const realUrl = await UfsGlobal.Utils.getRedirectedUrl(url);
            await UfsGlobal.Utils.downloadToFolder({
              url: realUrl,
              fileName: filename,
              dirHandler: dir,
              expectBlobType,
            });
            onFinishItem?.(i + 1, data.length);
          } catch (e) {
            console.error(e);
          }
        }
      }

      // checkbox on videos
      let checkboxes = [];

      // Listen for videos
      UfsGlobal.DOM.onElementsAdded('a[href*="/video/"]', (nodes) => {
        // remove if not in DOM
        for (let i = checkboxes.length - 1; i >= 0; i--) {
          let checkbox = checkboxes[i];
          if (!document.contains(checkbox)) {
            checkboxes.splice(i, 1);
          }
        }

        for (let node of nodes) {
          if (!node.querySelector("canvas")) continue;
          let isPrivate = node.querySelector("svg.private") !== null;

          if (isPrivate) {
            let p = document.createElement("p");
            p.innerText = "Riêng tư";
            p.style = [
              "position: absolute;",
              "top: 0;",
              "right: 0;",
              "color: red",
              "background: black",
              "padding: 8px",
              "font-weight: bold",
            ].join(";");
            node.parentElement.appendChild(p);
          } else {
            let url = node.getAttribute("href");
            let checkbox = createCheckBox(url);
            node.parentElement.appendChild(checkbox);
            checkboxes.push(checkbox);
          }
        }

        let selected = checkboxes.filter((checkbox) => checkbox.checked).length;
        progressDiv.innerText = `Đã chọn ${selected}/${checkboxes.length} video. Bấm nút Get link khi chọn xong nhé.`;
      });

      function createCheckBox(url) {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "video";
        checkbox.checked = false;
        checkbox["data-url"] = url;
        checkbox.style =
          "z-index: 0; position: absolute; top: 0; right: 0; width: 60px; height: 60px;";
        return checkbox;
      }
    },
  },
};

const videoMock = {
  AIGCDescription: "",
  author: {
    avatarLarger:
      "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/ba2aad87bd8bafe7f4a4850d15bc4d47~c5_1080x1080.jpeg?lk3s=a5d48078&nonce=95769&refresh_token=c0ece14ea3a9bbefb2e5c536a37a220e&x-expires=1722135600&x-signature=GTDzdehNU9FLUTENcoB%2Fuu%2FboLk%3D&shp=a5d48078&shcp=81f88b70",
    avatarMedium:
      "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/ba2aad87bd8bafe7f4a4850d15bc4d47~c5_720x720.jpeg?lk3s=a5d48078&nonce=59152&refresh_token=23b71fadc0a9b7128b9ad3964dfbeace&x-expires=1722135600&x-signature=i%2FeSkXqM1e93v9iXJUwZeg7Xpdw%3D&shp=a5d48078&shcp=81f88b70",
    avatarThumb:
      "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-giso/ba2aad87bd8bafe7f4a4850d15bc4d47~c5_100x100.jpeg?lk3s=a5d48078&nonce=59913&refresh_token=a7090d32da45fc22f704e4ca7517ce4d&x-expires=1722135600&x-signature=z5lxF2ivUkUmnwOP7H9gJvH4Cyg%3D&shp=a5d48078&shcp=81f88b70",
    commentSetting: 0,
    downloadSetting: 0,
    duetSetting: 3,
    ftc: false,
    id: "64700392767",
    isADVirtual: false,
    isEmbedBanned: false,
    nickname: "Kiệt Hà Tịnh",
    openFavorite: false,
    privateAccount: false,
    relation: 0,
    secUid: "MS4wLjABAAAAsnkRvwHb4FpMu0RLRx70Sc5TI-jwqRa5Xw_w9zVRP0A",
    secret: false,
    signature:
      "Fb:Ngô Lê Tuấn Kiệt ☘️\nNgười Hà Tịnh ở Biên Hoà ❤️\nĐồ K dùng ở dưới nha👇🏻",
    stitchSetting: 3,
    uniqueId: "tuankiet.2000",
    verified: true,
  },
  authorStats: {
    diggCount: 10600,
    followerCount: 8600000,
    followingCount: 161,
    friendCount: 0,
    heart: 375400000,
    heartCount: 375400000,
    videoCount: 1656,
  },
  collected: false,
  contents: [
    {
      desc: "Clip này My xin đính chính lần cuối nha mn😌 ",
    },
  ],
  createTime: 1718103129,
  desc: "Clip này My xin đính chính lần cuối nha mn😌 ",
  digged: false,
  diversificationId: 10004,
  duetDisplay: 0,
  forFriend: false,
  id: "7379196725698841863",
  itemCommentStatus: 0,
  item_control: {
    can_repost: true,
  },
  music: {
    authorName: "Trần thánh trúc",
    coverLarge:
      "https://p16-sign-sg.tiktokcdn.com/aweme/1080x1080/tos-alisg-avt-0068/f0e3a91d906cf4b62f3d9033ed4dc227.jpeg?lk3s=a5d48078&nonce=16594&refresh_token=6967b6cb4f75c7f354f810e073fee6a0&x-expires=1722135600&x-signature=5TAkwWXiqjuAVha1QwgkIdQ33Oo%3D&shp=a5d48078&shcp=81f88b70",
    coverMedium:
      "https://p16-sign-sg.tiktokcdn.com/aweme/720x720/tos-alisg-avt-0068/f0e3a91d906cf4b62f3d9033ed4dc227.jpeg?lk3s=a5d48078&nonce=1126&refresh_token=85d0f238bdd5540f40cd5b4d4176272a&x-expires=1722135600&x-signature=w3E1Oi4ZSsIyQJrxoKlPv%2BaeSDw%3D&shp=a5d48078&shcp=81f88b70",
    coverThumb:
      "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/f0e3a91d906cf4b62f3d9033ed4dc227.jpeg?lk3s=a5d48078&nonce=12910&refresh_token=5074541334dc629cc5ecd123a5313b3f&x-expires=1722135600&x-signature=C3uvpe9PTjEH%2FHT8WIn8%2B9RIAVI%3D&shp=a5d48078&shcp=81f88b70",
    duration: 44,
    id: "7374296585604451073",
    original: false,
    playUrl:
      "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-v-27dcd7/oUOVDf7tUEdQM7wxqKmgFBKWIWJsCcfO5BH8ad/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=0&dr=0&er=0&lr=default&cd=0%7C0%7C0%7C0&br=250&bt=125&ft=GNDpcInz7ThZTIrrXq8Zmo&mime_type=audio_mpeg&qs=6&rc=ZzhlN2ZlNjlmOzVkMzQ4aEBpM2tva3c5cmVmczMzODU8NEBhLzQ2Yl41NmAxMl9hNjBjYSM0czZuMmRjNF9gLS1kMS1zcw%3D%3D&btag=e00088000&expire=1721968037&l=20240726032632702565EB3E432D2B5481&ply_type=3&policy=3&signature=18b1024aebfed96fab659235f53caa1e&tk=7294694872060675074",
    title: "nhạc nền - Ngọc Ngân",
  },
  officalItem: false,
  originalItem: false,
  privateItem: false,
  secret: false,
  shareEnabled: true,
  stats: {
    collectCount: 12600,
    commentCount: 2212,
    diggCount: 376100,
    playCount: 7900000,
    shareCount: 4063,
  },
  statsV2: {
    collectCount: "12577",
    commentCount: "2212",
    diggCount: "376100",
    playCount: "7900000",
    repostCount: "0",
    shareCount: "4063",
  },
  stitchDisplay: 0,
  video: {
    VQScore: "70.92",
    bitrate: 1430004,
    bitrateInfo: [
      {
        Bitrate: 1430004,
        CodecType: "h264",
        GearName: "normal_540_0",
        MVMAF: '""',
        PlayAddr: {
          DataSize: 7939920,
          FileCs: "c:0-38026-2fae",
          FileHash: "517d6e7d1deb58fb809cd976094e6888",
          Height: 1024,
          Uri: "v14044g50000cpk2o1fog65k4egbdktg",
          UrlKey: "v14044g50000cpk2o1fog65k4egbdktg_h264_540p_1430004",
          UrlList: [
            "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/oQiYGHrzNAH2A0CQi06BlILAqrofEUCkCI7wIB/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=2792&bt=1396&cs=0&ds=6&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=0&rc=NTw6Z2VmNDhkPDg3NWY4O0Bpam5laG45cjQ1czMzODczNEBfNl9gYl4xX18xLi8vMzE0YSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=68a902a51943c5d88af812ab9ae59688&tk=tt_chain_token",
            "https://v19-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/oQiYGHrzNAH2A0CQi06BlILAqrofEUCkCI7wIB/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=2792&bt=1396&cs=0&ds=6&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=0&rc=NTw6Z2VmNDhkPDg3NWY4O0Bpam5laG45cjQ1czMzODczNEBfNl9gYl4xX18xLi8vMzE0YSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=68a902a51943c5d88af812ab9ae59688&tk=tt_chain_token",
            "https://api.tiktokv.com/aweme/v1/play/?video_id=v14044g50000cpk2o1fog65k4egbdktg&line=0&is_play_url=1&file_id=78456c22241549bab541acebcdb799b2&item_id=7379196725698841863&signaturev3=dmlkZW9faWQ7ZmlsZV9pZDtpdGVtX2lkLjVlOWU2MWVjODNlZDU3OTgwMzkwMWY5Y2Q2NjQzMjhl&shp=9e36835a&shcp=-",
          ],
          Width: 576,
        },
        QualityType: 20,
      },
      {
        Bitrate: 1261254,
        CodecType: "h265_hvc1",
        GearName: "adapt_lowest_1080_1",
        MVMAF:
          '"{\\"v2.0\\": {\\"ori\\": {\\"v1080\\": 89.373, \\"v960\\": 90.574, \\"v864\\": 91.529, \\"v720\\": 93.76}, \\"srv1\\": {\\"v1080\\": -1, \\"v960\\": -1, \\"v864\\": -1, \\"v720\\": -1}}}"',
        PlayAddr: {
          DataSize: 7002959,
          FileCs: "c:0-38272-8f7c",
          FileHash: "36cfe328f42240c9201093a1c96df84f",
          Height: 1920,
          Uri: "v14044g50000cpk2o1fog65k4egbdktg",
          UrlKey: "v14044g50000cpk2o1fog65k4egbdktg_bytevc1_1080p_1261254",
          UrlList: [
            "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/o0ZFwog2QEpFeFNBCWmEQDtBaId0UtWfgARFzR/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=2462&bt=1231&cs=2&ds=4&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=15&rc=ZTk4ZDVkZDY3Zjo3OzU4NkBpam5laG45cjQ1czMzODczNEBjMV9eL19gNjIxYC0tMGExYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=6703b959137d6977910b969eaf838224&tk=tt_chain_token",
            "https://v19-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/o0ZFwog2QEpFeFNBCWmEQDtBaId0UtWfgARFzR/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=2462&bt=1231&cs=2&ds=4&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=15&rc=ZTk4ZDVkZDY3Zjo3OzU4NkBpam5laG45cjQ1czMzODczNEBjMV9eL19gNjIxYC0tMGExYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=6703b959137d6977910b969eaf838224&tk=tt_chain_token",
            "https://api.tiktokv.com/aweme/v1/play/?video_id=v14044g50000cpk2o1fog65k4egbdktg&line=0&is_play_url=1&file_id=43d5320804c74c5493caba22aab546fb&item_id=7379196725698841863&signaturev3=dmlkZW9faWQ7ZmlsZV9pZDtpdGVtX2lkLjYzMWJjOTNmN2E0ZTgxNWJlNTY5NDAzZDJiYTEyMThl&shp=9e36835a&shcp=-",
          ],
          Width: 1080,
        },
        QualityType: 2,
      },
      {
        Bitrate: 827773,
        CodecType: "h265_hvc1",
        GearName: "adapt_lower_720_1",
        MVMAF:
          '"{\\"v2.0\\": {\\"ori\\": {\\"v1080\\": 81.444, \\"v960\\": 84.686, \\"v864\\": 86.95, \\"v720\\": 90.786}, \\"srv1\\": {\\"v1080\\": 89.324, \\"v960\\": 92.945, \\"v864\\": 94.345, \\"v720\\": 96.716}}}"',
        PlayAddr: {
          DataSize: 4596110,
          FileCs: "c:0-38273-b3cb",
          FileHash: "9a8275de7c719b846208535a4bda1209",
          Height: 1280,
          Uri: "v14044g50000cpk2o1fog65k4egbdktg",
          UrlKey: "v14044g50000cpk2o1fog65k4egbdktg_bytevc1_720p_827773",
          UrlList: [
            "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/oUEY06iEIAwzCaNf6Liqoph27UYCaCAIBABIQ0/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=1616&bt=808&cs=2&ds=3&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=14&rc=aTs1O2c8ODQ1ZWg1aTNkOUBpam5laG45cjQ1czMzODczNEAuXjAuXi4zXmExYF5gMmEzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=aa0c545142bafe4efd480827937e9a44&tk=tt_chain_token",
            "https://v19-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/oUEY06iEIAwzCaNf6Liqoph27UYCaCAIBABIQ0/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=1616&bt=808&cs=2&ds=3&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=14&rc=aTs1O2c8ODQ1ZWg1aTNkOUBpam5laG45cjQ1czMzODczNEAuXjAuXi4zXmExYF5gMmEzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=aa0c545142bafe4efd480827937e9a44&tk=tt_chain_token",
            "https://api.tiktokv.com/aweme/v1/play/?video_id=v14044g50000cpk2o1fog65k4egbdktg&line=0&is_play_url=1&file_id=66da50cfa2ce4bd2a16519ad1832a81f&item_id=7379196725698841863&signaturev3=dmlkZW9faWQ7ZmlsZV9pZDtpdGVtX2lkLjYzZWJhYzdmMmMzZWQ1ZDk5MzU4OTIxNGZkODcyOTQ2&shp=9e36835a&shcp=-",
          ],
          Width: 720,
        },
        QualityType: 14,
      },
      {
        Bitrate: 694640,
        CodecType: "h265_hvc1",
        GearName: "adapt_540_1",
        MVMAF:
          '"{\\"v2.0\\": {\\"ori\\": {\\"v1080\\": 74.423, \\"v960\\": 78.739, \\"v864\\": 81.884, \\"v720\\": 86.639}, \\"srv1\\": {\\"v1080\\": 87.574, \\"v960\\": 91.778, \\"v864\\": 93.224, \\"v720\\": 96.069}}}"',
        PlayAddr: {
          DataSize: 3856907,
          FileCs: "c:0-38273-9698",
          FileHash: "dd46f2309aa588691b3e2ae5fd3c640b",
          Height: 1024,
          Uri: "v14044g50000cpk2o1fog65k4egbdktg",
          UrlKey: "v14044g50000cpk2o1fog65k4egbdktg_bytevc1_540p_694640",
          UrlList: [
            "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/owCLiImNwY0IAICRzDEZ6YiHC2AoqBfLA0Q7Br/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=1356&bt=678&cs=2&ds=6&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=11&rc=ZDQ7NWc2ODw7ZDk8Ojk2O0Bpam5laG45cjQ1czMzODczNEAuXy40XmFeNjExYDMuLmFeYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=70dcd514149eead3286eebae6af4d4eb&tk=tt_chain_token",
            "https://v19-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/owCLiImNwY0IAICRzDEZ6YiHC2AoqBfLA0Q7Br/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=1356&bt=678&cs=2&ds=6&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=11&rc=ZDQ7NWc2ODw7ZDk8Ojk2O0Bpam5laG45cjQ1czMzODczNEAuXy40XmFeNjExYDMuLmFeYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=70dcd514149eead3286eebae6af4d4eb&tk=tt_chain_token",
            "https://api.tiktokv.com/aweme/v1/play/?video_id=v14044g50000cpk2o1fog65k4egbdktg&line=0&is_play_url=1&file_id=a8d3161769c64a4899a5d3ad7218b11a&item_id=7379196725698841863&signaturev3=dmlkZW9faWQ7ZmlsZV9pZDtpdGVtX2lkLmI5ZDRmZDI1ZWYwNzNlNDE3ZTllNmQ4MDhmYjUyZTU4&shp=9e36835a&shcp=-",
          ],
          Width: 576,
        },
        QualityType: 28,
      },
    ],
    codecType: "h264",
    cover:
      "https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/f9e2ad3ce5ed4d17a20781bdac3c903c_1718103135?lk3s=81f88b70&nonce=53184&refresh_token=308e36058f33a46042f793fab36125ec&x-expires=1722135600&x-signature=82UdfuOqMxxwSdQEel0KWbGw9Kc%3D&shp=81f88b70&shcp=280c9438",
    definition: "540p",
    downloadAddr:
      "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/ogfIICYI70C6NI6o0HAiE7CMwQibAzABN2BqXi/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=3084&bt=1542&cs=0&ds=3&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=0&rc=NjY6NWllZGZmOjU2ZTY1ZkBpam5laG45cjQ1czMzODczNEAuYTUvYl5jXjQxMmMvXi02YSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=0f49a63b5e17e036e2f70ca3b3345c62&tk=tt_chain_token",
    duration: 44,
    dynamicCover:
      "https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/63d392accbe548f5ae433b6d0c32de94_1718103135?lk3s=81f88b70&nonce=14449&refresh_token=56eabe5d508e4ac55d6f6a2810ce5d19&x-expires=1722135600&x-signature=PZct%2BEpR8IIll4GKxoCXR9z0Y5k%3D&shp=81f88b70&shcp=280c9438",
    encodeUserTag: "",
    encodedType: "normal",
    format: "mp4",
    height: 1024,
    id: "7379196725698841863",
    originCover:
      "https://p16-sign-sg.tiktokcdn.com/obj/tos-alisg-p-0037/83e3606da0ec47dc87d0af4b05878a8f_1718103131?lk3s=81f88b70&x-expires=1722135600&x-signature=VLNP0WvEQn83f78RIvlwzeq7sAM%3D&shp=81f88b70&shcp=280c9438",
    playAddr:
      "https://v16-webapp-prime.tiktok.com/video/tos/alisg/tos-alisg-pve-0037c001/oQiYGHrzNAH2A0CQi06BlILAqrofEUCkCI7wIB/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=2792&bt=1396&cs=0&ds=6&ft=4fUEKM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=0&rc=NTw6Z2VmNDhkPDg3NWY4O0Bpam5laG45cjQ1czMzODczNEBfNl9gYl4xX18xLi8vMzE0YSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&btag=e00088000&expire=1721986037&l=20240726032632702565EB3E432D2B5481&ply_type=2&policy=2&signature=68a902a51943c5d88af812ab9ae59688&tk=tt_chain_token",
    ratio: "540p",
    subtitleInfos: [
      {
        Format: "webvtt",
        LanguageCodeName: "vie-VN",
        LanguageID: "10",
        Size: 1220,
        Source: "ASR",
        Url: "https://v16-webapp.tiktok.com/a5424d768a075e69a055e72402152862/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/03be2f31798f45059ea666ca47350470/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "1:llm",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "vie-VN",
        LanguageID: "10",
        Size: 1217,
        Source: "ASR",
        Url: "https://v16-webapp.tiktok.com/24a3a7730e8328eb2861c5510b57477a/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/120af213ab354198941ef848b2c9a420/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "1:whisper_lid",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "eng-US",
        LanguageID: "2",
        Size: 1428,
        Source: "MT",
        Url: "https://v16-webapp.tiktok.com/63e9170fe4dd78f2271e9ee930796ce7/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/56f87d05daff41a19a83c9fe3fccda6c/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "4:llm",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "cmn-Hans-CN",
        LanguageID: "1",
        Size: 635,
        Source: "MT",
        Url: "https://v16-webapp.tiktok.com/e34d44d91686f79e82f69a9cb4800a51/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/33521bbb474a41abbd1a1deb02888ce6/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "4:llm",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "spa-ES",
        LanguageID: "9",
        Size: 1282,
        Source: "MT",
        Url: "https://v16-webapp.tiktok.com/89921b1bde0d325c8e92a1dffffa7501/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/948dd14987094778a515dd944d2e0864/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "4:llm",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "kor-KR",
        LanguageID: "4",
        Size: 1668,
        Source: "MT",
        Url: "https://v16-webapp.tiktok.com/329afbeb7fdadb3d9fefa49ae9ab2f0e/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/6c504e2df8544a798cd0687220cd4321/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "4:llm",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "jpn-JP",
        LanguageID: "3",
        Size: 1443,
        Source: "MT",
        Url: "https://v16-webapp.tiktok.com/bad1df16e007e8f7a5886c161afff1d3/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/689890ff6706484797cfbf97cdd52db2/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "4:llm",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "tha-TH",
        LanguageID: "30",
        Size: 1965,
        Source: "MT",
        Url: "https://v16-webapp.tiktok.com/cad6f09f6fd1ad914cbb5407c9e32a1d/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/8a4fbdd10065400789e10d58a1f02754/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "4:llm",
      },
      {
        Format: "webvtt",
        LanguageCodeName: "cmn-Hant-CN",
        LanguageID: "36",
        Size: 1304,
        Source: "MT",
        Url: "https://v16-webapp.tiktok.com/b5b5d3fd25742b16940451e0449d790a/66a36bf5/video/tos/alisg/tos-alisg-pv-0037/1edde7a062c44ff79b8e251ecfe3113b/?a=1988&bti=ODszNWYuMDE6&ch=0&cr=3&dr=0&lr=all&cd=0%7C0%7C0%7C&cv=1&br=24816&bt=12408&ds=4&ft=4b~OyM3a8Zmo0Qoq--4jVHwB4pWrKsd.&mime_type=video_mp4&qs=13&rc=am5laG45cjQ1czMzODczNEBpam5laG45cjQ1czMzODczNEBxYWQxMmRjbGhgLS1kMTFzYSNxYWQxMmRjbGhgLS1kMTFzcw%3D%3D&l=20240726032632702565EB3E432D2B5481&btag=e00048000",
        UrlExpire: 1721986037,
        Version: "4:llm",
      },
    ],
    videoQuality: "normal",
    volumeInfo: {
      Loudness: -23,
      Peak: 0.27861,
    },
    width: 576,
    zoomCover: {
      240: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/f9e2ad3ce5ed4d17a20781bdac3c903c_1718103135~tplv-photomode-zoomcover:240:240.jpeg?lk3s=81f88b70&nonce=25423&refresh_token=dfbf3ed52ed288890e22ad069e9522ef&x-expires=1722135600&x-signature=owBSNcPot4e88zZYv9WRFzz%2Foys%3D&shp=81f88b70&shcp=280c9438",
      480: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/f9e2ad3ce5ed4d17a20781bdac3c903c_1718103135~tplv-photomode-zoomcover:480:480.jpeg?lk3s=81f88b70&nonce=49991&refresh_token=ba2c395d994885b46d524c1a2de93951&x-expires=1722135600&x-signature=DfsRX2zo3q9XCS0LngxC7HQFcCA%3D&shp=81f88b70&shcp=280c9438",
      720: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/f9e2ad3ce5ed4d17a20781bdac3c903c_1718103135~tplv-photomode-zoomcover:720:720.jpeg?lk3s=81f88b70&nonce=48719&refresh_token=43b5862a367f0c3afeea5c716aab76ae&x-expires=1722135600&x-signature=NAhG0hDjXsslM8AeZh0qLnxmm5U%3D&shp=81f88b70&shcp=280c9438",
      960: "https://p16-sign-sg.tiktokcdn.com/tos-alisg-p-0037/f9e2ad3ce5ed4d17a20781bdac3c903c_1718103135~tplv-photomode-zoomcover:960:960.jpeg?lk3s=81f88b70&nonce=54572&refresh_token=0f6665448538aa1b998121665c818b61&x-expires=1722135600&x-signature=fo8K%2BDq7u8l%2BN4VB13zvMR3PZFE%3D&shp=81f88b70&shcp=280c9438",
    },
  },
  videoSuggestWordsList: {
    video_suggest_words_struct: [
      {
        hint_text: "Search:",
        scene: "comment_top",
        words: [
          {
            word: "bé mây chụp hình trước chùa",
            word_id: "3850415388395388576",
          },
        ],
      },
    ],
  },
};
