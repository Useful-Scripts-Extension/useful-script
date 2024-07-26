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
                if (_.video.playAddr || _.imagePost?.images?.length)
                  CACHED.videoById.set(_.video.id, _);

                if (_.imagePost?.images?.length) console.log(_);
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
      <h1 style="text-align:center">Tiktok - <a target="_blank" href="https://github.com/HoangTran0410/useful-script">Useful Scripts</a></h1>
      <h2 style="text-align:center">Found {{totalCount}} videos</h2>

      <div class="ufs_popup_header">
      <button id="clear" @click="clear">🗑️ Clear</button>
      <button id="json" @click="downloadJson">📄 Download json</button>
      <button id="audio" @click="downloadAudio">🎧 {{audioTitle}}</button>
      <button id="video" @click="downloadVideo">🎬 {{videoTitle}}</button>
        <input type="text" id="search" placeholder="🔎 Search..." :value="search" @input="e => search = e.target.value" >
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
<td style="text-align:center">{{v.index}}<br/>
  <input type="checkbox" v-model="selected[v.id]" class="ufs-video-checkbox" />
</td>
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
    <a :href="v.video.playAddr" v-if="v.video.playAddr" target="_blank">🎬 Video</a><br/>
    <a :href="v.video.cover" target="_blank">🖼️ Cover</a><br/>
    <a :href="v.author.avatarLarger" target="_blank">
    👤 Avatar
    </a><br/>
    <a :href="v.music.playUrl" target="_blank">
    🎧 Music: {{v.music.title}}
    </a>
  </p>
</td>
            </tr>
          </tbody>
        </table>

        <button v-if="videosToShow.length > 2" @click="scrollToTop" class="ufs-scroll-to-top">⬆</button>
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
            selected: {},
          };
        },
        computed: {
          hasSelected() {
            return Object.values(this.selected).find((v) => v);
          },
          videoToDownload() {
            return this.hasSelected
              ? this.videosToShow.filter((v) => this.selected[v.id])
              : this.videosToShow;
          },
          audioToDownload() {
            const list = this.hasSelected
              ? this.videosToShow.filter((v) => this.selected[v.id])
              : this.videosToShow;

            // get unique
            const result = new Map();
            for (const item of list) {
              if (!result.has(item.music.id)) result.set(item.music.id, item);
            }
            return Array.from(result.values());
          },
          videoTitle() {
            if (this.downloading.video) {
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
            if (this.downloading.audio) {
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
            const total = this.videoToDownload.length;
            if (!total) return;
            let success = 0;
            await download({
              folderName: "tiktok_videos",
              expectBlobTypes: ["video/mp4", "image/jpeg"],
              data: this.videoToDownload
                .map((_, i) => {
                  // image
                  const imgs = _.imagePost?.images;
                  if (imgs?.length) {
                    return imgs.map((img, j) => ({
                      url:
                        img.imageURL?.urlList?.[1] ||
                        img.imageURL?.urlList?.[0],
                      filename:
                        i +
                        1 +
                        "_" +
                        (j + 1) +
                        "_" +
                        UfsGlobal.Utils.sanitizeName(_.id, false) +
                        ".jpg",
                    }));
                  }

                  // video
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
              folderName: "tiktok_musics",
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
              this.videosToShow.length + "_videos_tiktok.json"
            );
          },
          scrollToTop(e) {
            e.target.parentElement.scrollTo({ top: 0, behavior: "smooth" });
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
        expectBlobTypes,
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
              expectBlobTypes,
            });
            onFinishItem?.(i + 1, data.length);
          } catch (e) {
            console.error(e);
          }
        }
      }
      return;
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
            p.className = "ufs_is_private";
            node.parentElement.appendChild(p);
          } else {
            let url = node.getAttribute("href");
            let checkbox = createCheckBox(url);
            node.parentElement.appendChild(checkbox);
            checkboxes.push(checkbox);
          }
        }
      });

      function createCheckBox(url) {
        let checkbox = document.createElement("input");
        checkbox.className = "ufs_tiktok_checkbox";
        checkbox.type = "checkbox";
        checkbox.name = "video";
        checkbox.checked = false;
        checkbox["data-url"] = url;
        return checkbox;
      }
    },
  },
};
