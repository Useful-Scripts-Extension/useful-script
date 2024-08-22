import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { BADGES } from "./helpers/badge.js";
import { hookXHR } from "./libs/ajax-hook/index.js";
import { scrollToVeryEnd } from "./scrollToVeryEnd.js";

export default {
  icon: "https://www.douyin.com/favicon.ico",
  name: {
    en: "Douyin - Batch download",
    vi: "Douyin - Tải hàng loạt",
  },
  description: {
    en: "Select and download all douyin video (user profile, tiktok explore).<br/><br/> Same as tiktok batch download.",
    vi: "Tải hàng loạt video douyin (trang người dùng, trang tìm kiếm), có giao diện chọn video muốn tải.<br/><br/> Giống chức năng tải hàng loạt tiktok.",
    img: "/scripts/douyin_batchDownload.png",
  },

  badges: [BADGES.new, BADGES.hot],

  changeLogs: {
    "2024-07-30": "init",
  },

  whiteList: ["https://www.douyin.com/*"],

  pageScript: {
    onDocumentStart: async (details) => {
      const CACHED = {
        list: [],
        hasNew: true,
        videoById: new Map(),
      };

      window.ufs_douyin_batchDownload = CACHED;

      hookXHR({
        onAfterSend: async (
          { method, url, async, user, password },
          dataSend,
          response
        ) => {
          try {
            const json =
              typeof response == "string" ? JSON.parse(response) : response;

            if (json?.aweme_list?.length) {
              console.log(json);

              CACHED.list.push(...json.aweme_list);
              json.aweme_list.forEach((item) => {
                if (!CACHED.videoById.has(item.aweme_id)) {
                  CACHED.videoById.set(item.aweme_id, item);
                  CACHED.hasNew = true;
                }
              });
            }

            if (json?.cards?.length) {
              const list = json.cards.map((c) => JSON.parse(c.aweme));
              list.forEach((item) => {
                if (!CACHED.videoById.has(item.aweme_id)) {
                  CACHED.videoById.set(item.aweme_id, item);
                  CACHED.hasNew = true;
                }
              });
            }
          } catch (e) {
            console.log("ERROR:", e);
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
      function getNow() {
        // return year + month + day + hour + minute + second
        const day = new Date();
        return (
          [day.getFullYear(), day.getMonth() + 1, day.getDate()].join("-") +
          "_" +
          [day.getHours(), day.getMinutes(), day.getSeconds()].join("-")
        );
      }

      const app = new Vue({
        template: /*html*/ `
<div id="ufs_tiktok_batchDownload">
  <div class="ufs_floating_btn" @click="showModal = true">📥 {{totalCount}}</div>
  <div class="ufs_container" v-if="showModal" @click.self="showModal = false">
    <div class="ufs_popup">
      <h1 style="text-align:center">Douyin - <a target="_blank" href="https://github.com/Useful-Scripts-Extension/useful-script">Useful Scripts</a></h1>
      <h2 style="text-align:center">Found {{totalCount}} videos</h2>

      <div class="ufs_popup_header">
        <button @click="scrollToVeryEnd">⏬ Auto scroll</button>
        <div class="ufs_dropdown">
          <button @click="clear" class="ufs_dropdown_trigger">🗑️ Clear</button>
          <div class="ufs_dropdown_content" v-if="selectedCount > 0">
            <button @click="clearSelected">🗑️ Remove {{selectedCount}} selected</button>
          </div>
        </div>
        <div class="ufs_dropdown">
          <button @click="downloadVideo" class="ufs_dropdown_trigger">🎬  {{videoTitle}}</button>
          <div class="ufs_dropdown_content">
            <button @click="downloadAudio">🎧 {{audioTitle}}</button>
            <button @click="downloadJson">📄 Download json</button>
          </div>
        </div>
        <input type="text" placeholder="🔎 Search..." :value="search" @input="e => search = e.target.value" >
      </div>

      <div class="table_wrap">
        <table>
          <thead>
            <tr>
              <th @click="setSortBy('index')" class="clickable">#</th>
              <th>🎬 Video</th>
              <th @click="setSortBy('title')" class="clickable">Title</th>
              <th @click="setSortBy('author')" class="clickable">👤 User</th>
              <th @click="setSortBy('like')" class="clickable">Like</th>
              <th @click="setSortBy('duration')" class="clickable">Length</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
<tr v-if="videosToShow.length === 0">
  <td colspan="7"><h2 style="text-align:center">No video</h2></td>
</tr>
<tr v-for="v in videosToShow" :key="v.aweme_id">
  <td style="text-align:center">{{v.index}}<br/>
    <input type="checkbox" v-model="selected[v.aweme_id]" class="ufs_video_checkbox" />
  </td>
  <td>
    <a target="_blank" :href="v.video.play_addr.url_list.at(-1)">
      <img :src="v.video.cover.url_list[0]" style="width:200px" />
    </a>
  </td>
  <td><p style="max-width:200px">{{v.desc}}</p></td>
  <td>
    <img :src="v.author.avatar_thumb.url_list.at(-1)" class="ufs_avatar" @click="openUser(v.author.sec_uid)"/>
    {{v.author.nickname}}<br/>
    <input type="text" :value="v.author.sec_uid" style="width: 150px" /><br/>
    {{v.author.uid}}
  </td>
  <td>{{format(v.statistics.digg_count)}}</td>
  <td>{{formatTime(v.video.duration)}}s</td>
  <td>
    <p style="max-width:200px">
      <a :href="v.video.play_addr.url_list.at(-1)" target="_blank">🎬 Video</a><br/>
      <a :href="v.video.cover.url_list[0]" target="_blank">🖼️ Cover</a><br/>
      <a :href="v.author.avatar_thumb.url_list.at(-1)" target="_blank">
      👤 Avatar
      </a><br/>
      <a v-if="v.music?.play_url?.url_list?.length" :href="v.music.play_url.url_list.at(-1)" target="_blank">
      🎧 Music: {{v.music.title}}
      </a>
    </p>
  </td>
</tr>
          </tbody>
        </table>

        <button v-if="videosToShow.length > 2" @click="scrollToTop" class="ufs_scroll_top">⬆</button>
      </div>
    </div>
  </div>
</div>`,
        created() {
          setInterval(() => {
            if (CACHED.hasNew) {
              this.videos = Array.from(CACHED.videoById.values())
                // inject index
                .map((v, i) => ({ ...v, index: i + 1 }));

              CACHED.hasNew = false;
            }
          }, 1000);
        },
        data() {
          return {
            showModal: false,
            videos: [],
            search: "",
            sortBy: "index",
            sortDir: "asc",
            downloading: {
              video: null,
              audio: null,
            },
            selected: {},
          };
        },
        computed: {
          selectedIds() {
            return Object.entries(this.selected)
              .filter((v) => v[1])
              .map((v) => v[0]);
          },
          selectedCount() {
            return Object.values(this.selected).filter((v) => v).length;
          },
          hasSelected() {
            return this.selectedCount > 0;
          },
          videoToDownload() {
            return this.hasSelected
              ? this.videosToShow.filter((v) => this.selected[v.aweme_id])
              : this.videosToShow;
          },
          audioToDownload() {
            const list = this.hasSelected
              ? this.videosToShow.filter((v) => this.selected[v.aweme_id])
              : this.videosToShow;

            // get unique
            const result = new Map();
            for (const item of list) {
              if (item.music?.id && !result.has(item.music?.id))
                result.set(item.music.id, item);
            }
            return Array.from(result.values());
          },
          videoTitle() {
            if (Number.isInteger(this.downloading.video)) {
              return (
                "Downloading " +
                this.downloading.video +
                "/" +
                this.videoToDownload.length +
                " video"
              );
            }
            return (
              "Download " +
              this.videoToDownload.length +
              (this.hasSelected ? " selected" : "") +
              " video"
            );
          },
          audioTitle() {
            if (Number.isInteger(this.downloading.audio)) {
              return (
                "Downloading " +
                this.downloading.audio +
                "/" +
                this.audioToDownload.length +
                " audio"
              );
            }
            return (
              "Download " +
              this.audioToDownload.length +
              (this.hasSelected ? " selected" : "") +
              " audio"
            );
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
                    v.author?.uid,
                    v.author?.nickname,
                    v.author?.sec_uid,
                  ].some((s) =>
                    s?.toLowerCase()?.includes(this.search.toLowerCase())
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
                    case "like":
                      return this.sortDir === "asc"
                        ? a.statistics.digg_count - b.statistics.digg_count
                        : b.statistics.digg_count - a.statistics.digg_count;
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
            const total = this.videoToDownload.length;
            if (!total) return;
            let success = 0;
            await download({
              folderName: "douyin_videos_" + getNow(),
              expectBlobTypes: ["video/mp4"],
              data: this.videoToDownload
                .map((_, i) => {
                  return {
                    url: _.video.play_addr.url_list.at(-1),
                    filename:
                      i +
                      1 +
                      "_" +
                      UfsGlobal.Utils.sanitizeName(_.aweme_id, false) +
                      ".mp4",
                  };
                })
                .flat()
                .filter((_) => _.url),
              onProgressItem: (i, total) => {
                this.downloading.video = i;
              },
              onFinishItem: (i, total) => {
                success++;
              },
            });
            this.downloading.video = false;
            alert("Downloaded " + success + "/" + total + " videos!");
          },
          async downloadAudio() {
            const total = this.audioToDownload.length;
            if (!total) return;
            let success = 0;
            await download({
              folderName: "douyin_musics_" + getNow(),
              data: this.audioToDownload.map((_, i) => ({
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
            this.downloading.audio = false;
            alert("Downloaded " + success + "/" + total + " videos!");
          },
          downloadJson() {
            UfsGlobal.Utils.downloadData(
              JSON.stringify(this.videosToShow, null, 4),
              this.videosToShow.length + "_videos_douyin.json"
            );
          },
          scrollToVeryEnd() {
            setTimeout(() => scrollToVeryEnd(false), 100);
          },
          scrollToTop(e) {
            e.target.parentElement.scrollTo({ top: 0, behavior: "smooth" });
          },
          clearSelected() {
            this.selectedIds.forEach((vidId) => {
              CACHED.videoById.delete(vidId);
            });
            this.selected = {};
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
            window.open("https://www.douyin.com/user/" + id, "_blank");
          },
          format(v) {
            return formatter.format(v);
          },
          formatTime(seconds) {
            // return hh:mm:ss
            return new Date(seconds)
              .toISOString()
              .substr(11, 8)
              .split(":")
              .filter((v) => v !== "00")
              .join(":");
          },
        },
      }).$mount(div);

      async function download({
        folderName = "douyin",
        expectBlobTypes,
        data,
        onProgressItem,
        onFinishItem,
      }) {
        const dir = await UfsGlobal.Utils.chooseFolderToDownload(folderName);
        onProgressItem?.(0, data.length);

        UfsGlobal.Extension.trackEvent("douyin_batchDownload-download");
        for (let i = 0; i < data.length; ++i) {
          try {
            onProgressItem?.(i + 1, data.length);
            const { url, filename } = data[i];
            const realUrl = await UfsGlobal.Utils.getRedirectedUrl(url);
            await UfsGlobal.Utils.downloadToFolder({
              url: realUrl,
              fileName: filename,
              dirHandler: dir,
              expectBlobTypes,
            });
            onFinishItem?.(i + 1, data.length);
          } catch (e) {
            console.error(e);
          }
        }
      }
    },
  },
};
