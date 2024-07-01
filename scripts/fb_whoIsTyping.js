import { UfsGlobal } from "./content-scripts/ufs_global.js";
import { getUserInfoFromUid } from "./fb_GLOBAL.js";
import { BADGES } from "./helpers/badge.js";

export default {
  icon: '<i class="fa-regular fa-comment-dots fa-lg"></i>',
  name: {
    en: "Facebook - Who is typing to you?",
    vi: "Facebook - Ai đang nhắn cho bạn?",
  },
  description: {
    en:
      "Notify when someone is typing chat to you.<br/>" +
      "<h2>WARNING</h2>Not work with end-to-end encryption",
    vi:
      "Thông báo khi có người đang gõ tin nhắn cho bạn.<br/>" +
      "<h2>Chú ý</h2>Không xem được nếu mã hoá đầu cuối",
  },
  badges: [BADGES.beta],
  whiteList: ["https://*.facebook.com/*", "https://*.messenger.com/*"],

  pageScript: {
    onDocumentStart: async () => {
      const key = "ufs_fb_whoIsTyping";
      try {
        window.ufs_fb_whoIsTyping = JSON.parse(
          localStorage.getItem(key) || "[]"
        );
      } catch (e) {
        console.log("ERROR", e);
        window.ufs_fb_whoIsTyping = [];
      }

      window.onbeforeunload = () => {
        if (window.ufs_fb_whoIsTyping)
          localStorage.setItem(key, JSON.stringify(window.ufs_fb_whoIsTyping));
      };

      window.ufs_whoIsTyping_users_cache = {};

      let textDecoder = new TextDecoder("utf-8");
      const WebSocketOrig = window.WebSocket;
      window.WebSocket = function fakeConstructor(dt, config) {
        const websocket_instant = new WebSocketOrig(dt, config);
        websocket_instant.addEventListener("message", async function (achunk) {
          let utf8_str = textDecoder.decode(achunk.data);

          // console.log(utf8_str, achunk);

          if (
            utf8_str.startsWith("1") &&
            utf8_str.includes("updateTypingIndicator")
          ) {
            console.log(utf8_str);
            try {
              let isStartTyping = utf8_str.includes(",true");
              let isStopTyping = utf8_str.includes(",false");
              let uid = utf8_str.match(/(?!\")(\d{3,})/g)?.[1];

              if (!(uid in window.ufs_whoIsTyping_users_cache)) {
                let userData = await getUserInfoFromUid(uid);
                window.ufs_whoIsTyping_users_cache[uid] = userData;
              }

              let { name, avatar } = window.ufs_whoIsTyping_users_cache[uid];
              notifyTypingEvent(uid, name, avatar, isStartTyping);
              window.ufs_fb_whoIsTyping.push({
                uid,
                name,
                avatar,
                type: isStartTyping ? "start" : "stop",
                time: new Date().getTime(),
              });
              if (window.ufs_fb_whoIsTyping.length > 1000)
                window.ufs_fb_whoIsTyping.shift();
            } catch (e) {
              console.log("ERROR: ", e);
            }
          }
        });
        return websocket_instant;
      };
      window.WebSocket.prototype = WebSocketOrig.prototype;
      window.WebSocket.prototype.constructor = window.WebSocket;

      UfsGlobal.Extension.getURL("scripts/fb_whoIsTyping.css").then(
        UfsGlobal.DOM.injectCssFile
      );

      function notifyTypingEvent(uid, name, avatar, isTyping) {
        let divId = "ufs-who-is-typing";
        let exist = document.querySelector("#" + divId);
        if (!exist) {
          exist = document.createElement("div");
          exist.id = divId;
          exist.innerHTML = `<div class="ufs-header clearfix">
            <button class="ufs-clear-btn">X</button>
            <button class="ufs-minimize-btn">-</button>
          </div>`;

          exist.querySelector(".ufs-header .ufs-minimize-btn").onclick = (e) =>
            exist.classList.toggle("collapsed");
          exist.querySelector(".ufs-header .ufs-clear-btn").onclick = (e) =>
            confirm("Bạn có chắc muốn xoá hết thông báo?") && exist.remove();

          document.body.appendChild(exist);
        }

        let time = new Date().toLocaleTimeString();
        let text =
          `<b><a target="_blank" href="https://fb.com/${uid}">${name}</a></b>` +
          ` ${isTyping ? "đang gõ tin" : "ngưng gõ tin"} nhắn cho bạn.`;

        let newNoti = document.createElement("div");
        newNoti.className = "ufs-noti-item clearfix";
        newNoti.innerHTML = `
        <button class="ufs-close-btn">X</button>
        <img src="${avatar}" class="ufs-avatar" />
        <div class="ufs-content">
          <p class="ufs-time">${time}</p>
          <p class="ufs-text">${text}</p>
        </div>
      `;
        newNoti.querySelector(".ufs-close-btn").onclick = () => {
          newNoti.remove();
          if (!exist.querySelector(".ufs-noti-item")) exist.remove();
        };
        exist.appendChild(newNoti);
      }
    },
  },
};
