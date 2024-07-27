import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { runScriptInCurrentTab } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-closed-captioning fa-lg"></i>',
  name: {
    en: "Get Youtube video's captions",
    vi: "Lấy phụ đề video trên Youtube",
  },
  description: {
    en: "- Click to get all captions of playing youtube video<br/>- Enable autorun to show realtime captions (transcript)",
    vi: "- Bấm để tải về tất cả phụ đề của video youtube đang xem<br/>- Bật tự chạy để hiển thị phụ đề thời gian thực",
    img: "/scripts/youtube_getVideoCaption.png",
  },
  changeLogs: {
    "2024-07-04": "init",
  },

  whiteList: ["https://*.youtube.com/*"],

  popupScript: {
    onEnable: () => {
      runScriptInCurrentTab(showTranscript, [true]);
    },
    onDisable: () => {
      runScriptInCurrentTab(showTranscript, [false]);
    },
  },

  pageScript: {
    onDocumentEnd: () => {
      setInterval(() => {
        showTranscript(true);
      }, 1000);
    },
    onClick: async () => {
      const { parseXml } = await import("./libs/utils/xmlParser.js");

      function renderCaptions(captions, title) {
        const id = "ufs_youtube_getVideoCaption";
        const exist = document.getElementById(id);
        if (exist) exist.remove();

        const div = document.createElement("div");
        div.id = id;
        div.innerHTML = /*html*/ `
          <style>
            #${id} {
              position: fixed;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: rgba(0, 0, 0, 0.8);
              z-index: 9999999999999999;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 18px;
            }
            #${id} a {
              display: inline-block;
              transition: all 0.3s ease;
              text-decoration: none;
            }
            #${id} a:hover {
              text-decoration: underline;
            }
            #${id} > div {
              position: relative;
              background: #eee;
              padding: 20px;
              border-radius: 5px;
              max-width: 500px;
              max-height: 500px;
              overflow-y: scroll;
              overflow-x: hidden;
            }
            #${id} button {
              display: inline-block;
              cursor: pointer;
            }
          </style>
          <div>
            <h3 style="text-align:center">Useful-scripts: Youtube captions</h3><br/>
            <h4>${title}</h4><br/>
            <ul>
              ${captions
                .map(
                  (caption) => `<li>
                    ${caption.name.simpleText} (${caption.languageCode})
                    <a href="${caption.baseUrl}" data-type="srt">srt</a>
                    <a href="${caption.baseUrl}" data-type="txt">txt</a>
                    <a href="${caption.baseUrl}" target="_blank">xml</a>
                  </li>`
                )
                .join("")}
            </ul>
            <br/>
            <a href="https://downsub.com/?url=${encodeURIComponent(
              location.href
            )}" target="_blank">Auto translate</a>
          </div>
        `;
        div.onclick = async (e) => {
          if (e.target == div) div.remove();
          if (e.target.tagName == "A") {
            const type = e.target.getAttribute("data-type");
            if (type) {
              e.preventDefault();
              downloadCaption(e.target.getAttribute("href"), type, title);
            }
          }
        };
        document.documentElement.appendChild(div);
      }

      async function downloadCaption(url, type, title) {
        try {
          const res = await fetch(url, {
            headers: {
              contentType: "text/xml",
            },
          });
          const text = await res.text();
          const xml = parseXml(text);

          const transcript = xml.getElementsByTagName("transcript")[0];
          const texts = Array.from(transcript.getElementsByTagName("text"));

          if (type === "txt") {
            const data = texts
              .map((t) => decodeHtmlEntities(t.textContent))
              .join("\n");
            UfsGlobal.Utils.downloadData(data, title + ".txt");
          } else if (type === "srt") {
            const data = texts
              .map((t, i) => {
                // 1
                // 00:00:00,120 --> 00:00:01,880
                // mùa tuyển sinh sắp đến rồi nên là hôm
                let index = i + 1;
                let start = Number(t.getAttribute("start"));
                let dur = Number(t.getAttribute("dur"));
                let end = start + dur;
                return (
                  index +
                  "\n" +
                  formatTimeToSRT(start) +
                  " --> " +
                  formatTimeToSRT(end) +
                  "\n" +
                  decodeHtmlEntities(t.textContent)
                );
              })
              .join("\n\n");
            UfsGlobal.Utils.downloadData(data, title + ".srt");
          }
        } catch (e) {
          alert(e);
          console.error(e);
        }
      }

      const pad = (num, len = 2) => num.toString().padStart(len, "0");

      // 6.120 -> 00:00:06,120
      function formatTimeToSRT(seconds) {
        // Get hours, minutes, and seconds
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        const milliseconds = Math.floor((seconds % 1) * 1000);
        // Format the time string
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${pad(
          milliseconds,
          3
        )}`;
      }

      var textArea = document.createElement("textarea");
      function decodeHtmlEntities(text) {
        textArea.innerHTML = text;
        return textArea.innerHTML;
      }

      const methods = [
        () => document.getElementsByTagName("ytd-app")[0].data.playerResponse,
        () => ytplayer.config.args.raw_player_response,
      ];

      for (let f of methods) {
        try {
          let p = f();
          let captions =
            p.captions.playerCaptionsTracklistRenderer.captionTracks;
          let title = p.videoDetails?.title || document.title;

          if (captions) {
            renderCaptions(captions, title);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      alert("No captions found");
    },
  },
};

function showTranscript(show) {
  if (show) {
    document
      .querySelector("*[target-id*=transcript]")
      ?.removeAttribute("visibility");
  } else {
    document
      .querySelector("*[target-id*=transcript] #visibility-button button")
      ?.click();
  }
}
