import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { hookFetch } from "./libs/ajax-hook/index.js";
import {
  downloadTiktokVideoFromUrl,
  downloadTiktokVideoFromId,
} from "./tiktok_GLOBAL.js";

const CACHED = {
  list: [],
  videoById: new Map(),
};

const commId = "ufs_tiktok_batchDownload_startDownload";

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

  popupScript: {
    onClick: () => {
      alert(`Làm các bước sau:
      1: Tích chọn nút bên trái để mở chức năng.
      2: Tải lại trang web tiktok.
      3: Sẽ hiện giao diện giúp tải hàng loạt ngay trong trang web.`);
    },
  },

  contentScript: {
    onDocumentStart: () => {
      window.addEventListener("message", async (event) => {
        console.log(event.data);
        if (event.data?.type === commId) {
          const dir = await UfsGlobal.Utils.chooseFolderToDownload("tiktok");
          for (const { url, name } of event.data.data) {
            await UfsGlobal.Utils.downloadToFolder({
              url,
              fileName: name,
              dirHandler: dir,
            });
          }
        }
      });
    },
  },

  pageScript: {
    onDocumentStart: () => {
      // reference to Cached
      window.ufs_tiktok_batchDownload = CACHED;

      const id = "ufs_tiktok_batchDownload";
      const floatingBtnId = `${id}_floating_btn`;
      const containerId = `${id}_container`;

      const ui = document.createElement("div");
      ui.id = id;
      (document.body || document.documentElement).appendChild(ui);

      ui.innerHTML = /*html*/ `
        <style>
          #${id} {
            position: fixed;
            z-index: 16777269;
          }
          #${floatingBtnId} {
            border-radius: 25px;
            background: #444;
            color: white;
            padding: 15px;
            position: fixed;
            bottom: 25px;
            right: 25px;
            border: 1px solid #777;
            cursor: pointer;
          }
          #${floatingBtnId}:hover {
            background: #666;
          }
          #${containerId} {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.5);
            align-items: center;
            justify-content: center;
          }
          .ufs_popup {
            background: #444;
            color: #eee;
            padding: 20px;
            border-radius: 10px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
          }
          .ufs_popup .table_wrap {
            overflow: auto;
          }
          .ufs_popup table {
            width: 100%;
          }
          .ufs_popup table, .ufs_popup th, .ufs_popup td {
            border: 1px solid #aaa;
            border-collapse: collapse;
          }
          .ufs_popup table td {
            padding: 10px;
          }
          .ufs_popup table thead {
            position: sticky;
            top: -2px;
            background: #333;
          }
          .ufs_popup th[data-sort]:hover {
            cursor: pointer;
            background: #555;
          }
          .ufs_popup input {
            padding: 5px;
          }
          .ufs_popup button {
            padding: 5px;
            background: #333;
            color: #eee;
            border: 1px solid #777;
            cursor: pointer;
          }
          .ufs_popup button:hover {
            background: #666;
          }
        </style>

        <div id="${floatingBtnId}">📥</div>

        <div id="${containerId}">

        </div>
      `;
      const floatingBtn = ui.querySelector("#" + floatingBtnId);
      const container = ui.querySelector("#" + containerId);

      container.onclick = (e) => {
        if (e.target === container) {
          toggle(false);
        }
      };

      floatingBtn.onclick = () => {
        let isShow = toggle();
        if (isShow) renderData();
      };

      function toggle(willShow) {
        if (!(typeof willShow === "boolean")) {
          let isShowing = container.style.display == "flex";
          willShow = !isShowing;
        }
        container.style.display = willShow ? "flex" : "none";
        return willShow;
      }

      const formatter = UfsGlobal.Utils.getNumberFormatter("compactShort");

      function renderData() {
        container.innerHTML = /*html*/ `
<div class="ufs_popup">
  <h1 style="text-align:center">Tiktok - Useful Scripts</h1>
  <h2 style="text-align:center">Found ${CACHED.videoById.size} videos</h2>

  <div style="align-self: flex-end;padding: 10px;">
    <button id="video">🎬 Download video</button>
    <button id="audio">🎧 Download audio</button>
    <button id="json">📄 Download json</button>
    <button id="clear">🗑️ Clear all</button>
    <input type="text" id="search" placeholder="🔎 Search..." >
  </div>

  <div class="table_wrap">
    <table>
      <thead>
        <tr>
          <th data-sort="index">#</th>
          <th>🎬 Video</th>
          <th data-sort="title">Title</th>
          <th data-sort="user">👤 User</th>
          <th data-sort="view">👀 View</th>
          <th data-sort="length">🕒 Length</th>
          <th>Download</th>
        </tr>
      </thead>
      <tbody>
      </tbody>
    </table>
  </div>
</div>`;

        const tbody = container.querySelector("tbody");

        // render initial data
        let allVideoData = Array.from(CACHED.videoById.values()).map(
          (_, i) => ({
            ..._,
            index: i + 1,
          })
        );
        renderTable(tbody, allVideoData);

        // search
        const hiddenVideos = new Set();
        const searchInp = container.querySelector("#search");
        searchInp.addEventListener("input", (event) => {
          const value = event.target.value;
          let trs = tbody.querySelectorAll("tr");
          for (const tr of trs) {
            const tds = tr.querySelectorAll("td");
            let found = false;
            for (const td of tds) {
              if (td.textContent.toLowerCase().includes(value)) {
                found = true;
                break;
              }
            }
            tr.style.display = found ? "" : "none";

            let videoId = tr.getAttribute("data-video-id");
            if (found) hiddenVideos.delete(videoId);
            else hiddenVideos.add(videoId);
          }
        });

        function getShowingVideos() {
          return allVideoData.filter((_) => !hiddenVideos.has(_.video.id));
        }

        // btn
        const clearBtn = container.querySelector("button#clear");
        clearBtn.addEventListener("click", () => {
          if (confirm("Are you sure want to clear all data?")) {
            CACHED.videoById.clear();
            renderData();
            floatingBtn.innerText = "📥";
          }
        });
        const downVideoBtn = container.querySelector("button#video");
        downVideoBtn.addEventListener("click", () => {
          download(
            "video/mp4",
            getShowingVideos().map((_, i) => {
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
            (i, total) => {
              UfsGlobal.DOM.notify({
                msg: `Downloading... ${i}/${total} videos`,
                duration: 30000,
              });
            },
            (i, total) => {
              downVideoBtn.textContent = `🎬 Download video (${i}/${total})`;
              UfsGlobal.DOM.notify({ msg: `Downloaded ${i}/${total} videos` });
            }
          );
        });
        const downAudioBtn = container.querySelector("button#audio");
        downAudioBtn.addEventListener("click", () => {
          const uniqueMusic = new Map();
          for (const item of getShowingVideos()) {
            if (!uniqueMusic.has(item.music.id))
              uniqueMusic.set(item.music.id, item);
          }
          download(
            Array.from(uniqueMusic.values()).map((_, i) => ({
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
            (i, total) => {
              UfsGlobal.DOM.notify({
                msg: `Downloading... ${i}/${total} audios`,
                duration: 30000,
              });
            },
            (i, total) => {
              downAudioBtn.textContent = `🎧 Download audio (${i}/${total})`;
              UfsGlobal.DOM.notify({ msg: `Downloaded ${i}/${total} audios` });
            }
          );
        });
        const downJsonBtn = container.querySelector("button#json");
        downJsonBtn.addEventListener("click", () => {
          UfsGlobal.Utils.downloadData(
            JSON.stringify(getShowingVideos(), null, 4),
            "tiktok.json"
          );
        });

        // sorting
        const sorting = {};
        const ths = container.querySelectorAll("th");
        for (const th of ths) {
          const sort = th.getAttribute("data-sort");
          if (!sort) continue;
          th.title = "Sort";

          th.addEventListener("click", () => {
            sorting[sort] = sorting[sort] == 1 ? -1 : 1;
            switch (sort) {
              case "index":
                allVideoData = allVideoData.sort((a, b) =>
                  sorting[sort] == -1 ? a.index - b.index : b.index - a.index
                );
                break;
              case "title":
                allVideoData = allVideoData.sort((a, b) =>
                  sorting[sort] == -1
                    ? a.desc.localeCompare(b.desc)
                    : b.desc.localeCompare(a.desc)
                );
                break;
              case "user":
                allVideoData = allVideoData.sort((a, b) =>
                  sorting[sort] == -1
                    ? a.author.uniqueId.localeCompare(b.author.uniqueId)
                    : b.author.uniqueId.localeCompare(a.author.uniqueId)
                );
                break;
              case "view":
                allVideoData = allVideoData.sort((a, b) =>
                  sorting[sort] == -1
                    ? a.stats.playCount - b.stats.playCount
                    : b.stats.playCount - a.stats.playCount
                );
                break;
              case "length":
                allVideoData = allVideoData.sort((a, b) =>
                  sorting[sort] == -1
                    ? a.video.duration - b.video.duration
                    : b.video.duration - a.video.duration
                );
                break;
            }
            renderTable(tbody, getShowingVideos());
          });
        }
      }

      function renderTable(tbody, data) {
        tbody.innerHTML = data
          .map(
            (v, i) => /*html*/ `
<tr data-video-id="${v.id}">
<td>${v.index}</td>
<td>
  <a target="_blank" href="${v.video.playAddr}">
  <img src="${v.video.cover}" style="width:150px" />
  </a>
</td>
<td><p style="max-width:200px">${v.desc}</p></td>
<td>
  <a target="_blank" href="https://www.tiktok.com/@${v.author.uniqueId}">
    <img src="${v.author.avatarThumb}" style="width:50px;height:50px" />
  </a>
  ${v.author.nickname}<br/>
  ${v.author.uniqueId}<br/>
  ${v.author.id}
</td>
<td>${formatter.format(v.stats.playCount)}</td>
<td>${v.video.duration}s</td>
<td>
  <p style="max-width:200px">
    <a href="${v.video.playAddr}" download target="_blank">🎬 Video</a><br/>
    <a href="${v.video.cover}" download target="_blank">🖼️ Cover</a><br/>
    <a href="${v.author.avatarLarger}" download target="_blank">
    👤 Avatar
    </a><br/>
    <a href="${v.music.playUrl}" download target="_blank">
    🎧 Music: ${v.music.title}
    </a>
  </p>
</td>
</tr>`
          )
          .join("");
      }

      async function download(
        expectBlobType,
        data,
        onProgressItem,
        onFinishItem
      ) {
        const dir = await UfsGlobal.Utils.chooseFolderToDownload("tiktok");
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

          if (CACHED.videoById.size)
            floatingBtn.innerHTML = `📥 (${CACHED.videoById.size})`;
        },
      });
    },
    _onDocumentIdle: async () => {
      let checkboxes = [];

      // Setup DOM
      let id = "ufs-tiktok-batch-download";
      let container = document.createElement("div");
      container.id = id;

      const style = document.createElement("style");
      style.textContent = `
        #${id} {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #333e;
          color: white;
          min-height: 50px;
          padding: 15px;
          z-index: 6;
          border-radius: 5px;
          border: 1px solid #eee;
        }
        #${id} button {
          padding: 5px 10px;
          background: #444;
          color: white !important;
          border: none;
        }
        #${id} button:hover {
          background: #666;
        }
      `;
      container.appendChild(style);

      (document.body || document.documentElement).appendChild(container);

      let progressDiv = document.createElement("p");
      progressDiv.innerText = "Useful script: Tiktok tải hàng loạt";
      progressDiv.style = "margin-bottom: 5px; font-family: monospace;";
      container.appendChild(progressDiv);

      // scroll button
      let scrolling = false;
      const scrollBtn = document.createElement("button");
      scrollBtn.innerText = "Scroll xuống ⏬";
      scrollBtn.onclick = async () => {
        scrolling = !scrolling;

        scrollBtn.innerText = scrolling
          ? "Đang scroll... ⏳"
          : "Scroll xuống ⏬";

        let doubleCheck = 0;
        while (scrolling) {
          let previousHeight = document.body.scrollHeight;
          window.scrollTo(0, document.body.scrollHeight);
          await new Promise((resolve) => setTimeout(resolve, 1000));
          if (document.body.scrollHeight <= previousHeight) {
            doubleCheck++;
            console.log(doubleCheck);
            if (doubleCheck > 5) {
              scrolling = false;
              scrollBtn.innerText = "Scroll xuống ⏬";
            }
          }
        }
      };
      container.appendChild(scrollBtn);

      // Select all button
      const selectAllBtn = document.createElement("button");
      selectAllBtn.innerText = "Chọn/Huỷ chọn ✅";
      selectAllBtn.onclick = function () {
        let value = checkboxes[0].checked;
        for (let checkbox of checkboxes) {
          checkbox.checked = !value;
        }
      };
      container.appendChild(selectAllBtn);

      // Revert all Button
      const revertAllBtn = document.createElement("button");
      revertAllBtn.innerText = "Đảo ngược 🔁";
      revertAllBtn.onclick = function () {
        for (let checkbox of checkboxes) {
          checkbox.checked = !checkbox.checked;
        }
      };
      container.appendChild(revertAllBtn);

      // Download button
      const downloadBtn = document.createElement("button");
      downloadBtn.innerText = "GET LINK 🔗";
      downloadBtn.onclick = function () {
        let videoUrls = [];
        for (let checkbox of checkboxes) {
          if (checkbox.checked) {
            videoUrls.push(checkbox["data-url"]);
          }
        }
        console.log(videoUrls);
        getLinkVideos(videoUrls);
      };
      container.appendChild(downloadBtn);

      // result div
      let resultDiv = document.createElement("div");
      resultDiv.style = "margin-top: 10px";
      container.appendChild(resultDiv);

      let resultLabel = document.createElement("label");
      resultDiv.appendChild(resultLabel);

      let resultTxt = document.createElement("textarea");
      resultTxt.style = "width: 100%; height: 50px";
      resultTxt.hidden = true;
      resultDiv.appendChild(resultTxt);

      // click listener
      window.onclick = function (e) {
        if (
          e.target.type === "checkbox" ||
          e.target == selectAllBtn ||
          e.target == revertAllBtn
        ) {
          let selected = checkboxes.filter(
            (checkbox) => checkbox.checked
          ).length;
          progressDiv.innerText = `Đã chọn ${selected}/${checkboxes.length} video. Bấm nút Get link khi chọn xong nhé.`;
        }
      };

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

      const { sleep, sanitizeName } = UfsGlobal.Utils;

      async function getLinkVideos(videoUrls) {
        if (!videoUrls.length) return;
        const getId = (url) => url.split("/").at(-1);
        const queue = [...videoUrls];
        const links = [];
        downloadBtn.disabled = true;

        while (queue.length) {
          let progress = `[${videoUrls.length - queue.length + 1}/${
            videoUrls.length
          }]`;
          try {
            const url = queue[0];
            const id = getId(url);

            console.log(`${progress} Đang tìm link cho video ${url}`);
            progressDiv.innerText = `${progress} Đang tìm link video ${id}...`;
            downloadBtn.innerText = `Đang get link ${progress}...`;

            const cached = CACHED.videoById.get(id);
            const link =
              cached?.url ||
              (await downloadTiktokVideoFromUrl(url, true)) ||
              (await downloadTiktokVideoFromId(id));

            if (link) {
              resultTxt.hidden = false;
              resultTxt.value += link + "\n";
              let count = resultTxt.value.split("\n").filter((i) => i).length;
              resultLabel.innerText = `Link tại đây, ${count} video, copy bỏ vào IDM tải hàng loạt nhé:`;

              // await UfsGlobal.Utils.downloadToFolder(link, id + ".mp4", dir);
              // await UfsGlobal.Extension.download({
              //   url: link,
              //   conflictAction: "overwrite",
              //   filename:
              //     "tiktok/" +
              //     sanitizeName(
              //       CACHED.videoById.get(id)?.name || id
              //     ) +
              //     ".mp4",
              // });
              links.push({
                url: link,
                name: sanitizeName(cached?.name || id, false) + ".mp4",
              });
            } else {
              progressDiv.innerText = `[LỖI] Không thể tải video ${url}.`;
              await sleep(1000);
            }
            queue.shift();
          } catch (e) {
            console.log(`${progress} Lỗi tải, thử lại sau 1s...`);
            let failId = queue.shift();
            queue.push(failId);
            await sleep(1000);
          }
        }

        progressDiv.innerText = "Bạn vẫn có thể chọn thêm video để get link.";
        downloadBtn.disabled = false;
        downloadBtn.innerText = "GET LINK 🔗";

        if (links?.length) {
          UfsGlobal.Utils.copyToClipboard(links.map((_) => _.url).join("\n"));
          // window.postMessage({ type: commId, data: links }, "*"); // send to content script to download
        }
        console.log(links);
      }

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
    },
  },
};
