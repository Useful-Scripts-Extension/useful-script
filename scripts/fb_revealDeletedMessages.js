export default {
  icon: "https://github.com/HoangTran0410/RevealDeletedFBMessages/raw/master/icons/icon48.png",
  name: {
    en: "Facebook - Reveal deleted messages",
    vi: "Facebook - Xem tin nhắn bị gỡ",
  },
  description: {
    en: "View deleted messages (since function was turned on) on facebook messenger.",
    vi: "Xem lại những tin nhắn đã bị đối phương xóa (kể từ khi bật chức năng) trong facebook messenger.",
  },
  whiteList: ["https://*.facebook.com/*", "https://*.messenger.com/*"],

  onDocumentStart: () => {
    // const WebSocketOrig = window.WebSocket;

    // window.WebSocket = function fakeConstructor(dt, config) {
    //   const websocket_instant = new WebSocketOrig(dt, config);
    //   websocket_instant.addEventListener("message", async function (achunk) {
    //     // const utf8_str = new TextDecoder("utf-8").decode(achunk.data);
    //     // Do something here
    //     // console.log(utf8_str);
    //   });
    //   return websocket_instant;
    // };

    // window.WebSocket.prototype = WebSocketOrig.prototype;
    // window.WebSocket.prototype.constructor = window.WebSocket;

    // window.addEventListener(
    //   "message",
    //   function (t) {
    //     t.source == window && console.log(t);
    //   },
    //   !1
    // );

    let emptyFunc = void 0;
    Object.defineProperty(window, "__d", {
      get: () => emptyFunc,
      set: (i) => {
        const c = new Proxy(i, {
          apply: async function (moduleName, dependencies, args) {
            console.log(arguments);
            return moduleName(...args);
          },
        });
        emptyFunc = c;
      },
    });
  },

  onDocumentIdle: () => {
    // MWV2ChatImage.bs
    requireLazy(["MWV2ChatUnsentMessage.bs"], (MWV2ChatUnsentMessage) => {
      const MWV2ChatUnsentMessageOrig = MWV2ChatUnsentMessage.make;

      MWV2ChatUnsentMessage.make = function (a) {
        if (a) {
          let outgoing = a.outgoing;
          let {
            isUnsent,
            messageId,
            threadKey,
            offlineThreadingId,
            displayedContentTypes,
            senderId,
          } = a.message;

          if (isUnsent) {
            threadKey =
              UsefulScriptGlobalWebpageContext.Facebook.decodeArrId(threadKey);
            senderId =
              UsefulScriptGlobalWebpageContext.Facebook.decodeArrId(senderId);

            a.message.isUnsent = false;
            a.message.text = "[Hacked]: thu hồi nè";

            console.log(
              "Tin nhắn thu hồi từ " + senderId + " trong " + threadKey,
              a
            );
          }
        }
        return MWV2ChatUnsentMessageOrig.apply(this, arguments);
      };
    });

    // Test who is typing
    requireLazy(["LSUpdateTypingIndicator"], (LSUpdateTypingIndicator) => {
      const LSUpdateTypingIndicatorOrig = LSUpdateTypingIndicator;
      console.log("abc");

      LSUpdateTypingIndicator = function (...args) {
        console.log(args);
        return LSUpdateTypingIndicatorOrig.apply(this, arguments);
      };
    });
  },
};
