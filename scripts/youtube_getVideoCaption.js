import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-solid fa-closed-captioning fa-2x"></i>',
  name: {
    en: "Get Youtube video's captions",
    vi: "Lấy phụ đề video trên Youtube",
  },
  description: {
    en: "Get all captions of playing youtube video",
    vi: "Tải về tất cả phụ đề của video youtube đang xem",
  },
  badges: [BADGES.new],
  changeLogs: {
    "2024-07-04": "init",
  },

  whiteList: ["https://*.youtube.com/*"],

  pageScript: {
    onClick: () => {
      function renderCaptions(captions) {
        const id = "ufs_youtube_getVideoCaption";
        const exist = document.getElementById(id);
        if (exist) exist.remove();

        const div = document.createElement("div");
        div.id = id;
        div.innerHTML = `
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
              position: absolute;
              top: 10px;
              right: 10px;
              padding: 10px;
              background: #eee;
              border-radius: 5px;
              cursor: pointer;
            }
          </style>
          <div>
            <button>Close</button>
            <h3>Captions</h3><br/>
            <ul>
              ${captions
                .map(
                  (caption) => `<li>
                    <a href="${caption.baseUrl}" target="_blank">
                      ${caption.name.simpleText} (${caption.languageCode})
                    </a>
                  </li>`
                )
                .join("")}
            </ul>
          </div>
        `;
        const button = div.querySelector("button");
        button.onclick = () => {
          div.remove();
        };
        document.documentElement.appendChild(div);
      }

      const methods = [
        () =>
          document.getElementsByTagName("ytd-app")[0].data.playerResponse
            .captions.playerCaptionsTracklistRenderer.captionTracks,
        () =>
          ytplayer.config.args.raw_player_response.captions
            .playerCaptionsTracklistRenderer.captionTracks,
      ];

      for (let f of methods) {
        try {
          let captions = f();
          if (captions) {
            renderCaptions(captions);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
    },
  },
};
