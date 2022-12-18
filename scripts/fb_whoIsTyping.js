export default {
  icon: '<i class="fa-regular fa-comment-dots"></i>',
  name: {
    en: "Facebook - Who is typing to you?",
    vi: "Facebook - Ai đang nhắn cho bạn?",
  },
  description: {
    en: "Notify when someone is typing chat to you.",
    vi: "Thông báo khi có người đang gõ tin nhắn cho bạn.",
  },
  whiteList: ["https://*.facebook.com/*", "https://*.messenger.com/*"],

  onDocumentStart: () => {
    function notifyTypingEvent() {
        
    }
    function saveTyingEvent(uid, typing) {
      let key = "ufs-fb_whoIsTyping";
      let old = JSON.parse(localStorage.getItem(key) ?? "[]");
      old.push({
        time: new Date().getTime(),
        uid: uid,
        typing: typing,
      });
      localStorage.setItem(key, JSON.stringify(old));
    }

    const WebSocketOrig = window.WebSocket;
    window.WebSocket = function fakeConstructor(dt, config) {
      const websocket_instant = new WebSocketOrig(dt, config);
      websocket_instant.addEventListener("message", async function (achunk) {
        let utf8_str = new TextDecoder("utf-8").decode(achunk.data);

        if (utf8_str.includes("updateTypingIndicator")) {
          let isStartTyping = utf8_str.includes(",true)");
          let isStopTyping = utf8_str.includes(",false)");

          let arr = utf8_str.match(/(\[)(.*?)(\])/g);
          let uid = UsefulScriptGlobalWebpageContext.Facebook.decodeArrId(
            JSON.parse(arr[arr.length - 2])
          );

          console.log(uid);
          saveTyingEvent(uid, isStartTyping);
        }
      });
      return websocket_instant;
    };
    window.WebSocket.prototype = WebSocketOrig.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;
  },
};
