export default {
  icon: "https://a-v2.sndcdn.com/assets/images/sc-icons/favicon-2cadd14bdb.ico",
  name: {
    en: "Soundcloud - Add download button",
    vi: "Soundcloud - Thêm nút tải nhạc",
  },
  description: {
    en: "Add download button on soundcloud (before like button). Use soundcloud API, no external service",
    vi: "Thêm nút tải nhạc trên soundcloud (trước nút like). Sử dụng trực tiếp soundcloud API",
    img: "/scripts/soundcloud_downloadMusic.png",
  },

  whiteList: ["https://soundcloud.com/*"],

  infoLink:
    "https://greasyfork.org/en/scripts/394837-local-soundcloud-downloader",

  pageScript: {
    onDocumentStart: async () => {
      function hook(obj, name, callback) {
        const fn = obj[name];
        obj[name] = function (...args) {
          callback.apply(this, args);
          fn.apply(this, args);
        };
        return () => {
          // restore
          obj[name] = fn;
        };
      }

      const btnId = "ufs-soundcloud-downloadBtn";
      const downloadBtn = document.createElement("button");
      downloadBtn.id = btnId;
      downloadBtn.textContent = "Download";
      downloadBtn.classList.add("sc-button");
      downloadBtn.classList.add("sc-button-medium");
      downloadBtn.classList.add("sc-button-responsive");
      downloadBtn.classList.add("sc-button-download");
      downloadBtn.classList.add("sc-button-cta");

      setInterval(() => {
        if (!document.querySelector("#" + btnId)) {
          const par = document.querySelector(
            ".listenEngagement__footer .sc-button-toolbar .sc-button-group"
          );
          if (par) {
            par.prepend(downloadBtn);
          }
        }
      }, 1000);

      let clientId;
      window.ufs_soundcloud_allData = new Map();

      // listen for request => save track
      hook(XMLHttpRequest.prototype, "open", async (method, url) => {
        const u = new URL(url, document.baseURI);
        clientId = u.searchParams.get("client_id") || clientId;
        if (!clientId) return;

        const res = await fetch(
          `https://api-v2.soundcloud.com/resolve?url=${encodeURIComponent(
            location.href
          )}&client_id=${clientId}`
        );
        const json = await res.json();

        if (json?.id) {
          // save media
          if (json.media) {
            window.ufs_soundcloud_allData.set(json.id, json);
          }
          // save media from tracks
          json.tracks
            ?.filter((track) => track.media)
            ?.forEach((track) => {
              window.ufs_soundcloud_allData.set(track.id, track);
            });

          // add download button
          let songTitle = document
            .querySelector(".soundTitle__title")
            ?.textContent?.trim();

          let songInCache = Array.from(
            window.ufs_soundcloud_allData.values()
          ).find((_) => _.title === songTitle);

          const progressive = songInCache?.media?.transcodings?.find?.(
            (t) => t?.format?.protocol === "progressive"
          );
          if (progressive) {
            downloadBtn.textContent = "Download";
            downloadBtn.title = songTitle;
            downloadBtn.onclick = async (e) => {
              const res = await fetch(
                progressive.url + `?client_id=${clientId}`
              );
              const { url } = await res.json();
              window.open(url);
            };
          } else {
            downloadBtn.textContent = "Unsupported";
            downloadBtn.onclick = () => {
              alert("Sorry, downloading this music is currently unsupported.");
            };
          }
        }
      });

      // for (const f of ["pushState", "replaceState", "forward", "back", "go"]) {
      //   hook(history, f, () => {

      //   });
      // }
    },
  },
};
