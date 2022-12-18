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
    //     const utf8_str = new TextDecoder("utf-8").decode(achunk.data);
    //     // Do something here
    //     console.log(utf8_str);
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
          apply: function (target, thisArg, arg) {
            console.log(thisArg);
            return target(...arg);
          },
        });
        emptyFunc = c;
      },
    });
  },

  onDocumentIdle: () => {
    // tất cả loại tin nhắn đều được bao bọc bởi:
    // MWPBaseMessage.bs
    // MWMessageListAttachment.bs
    // MWMessageListAttachmentContainer.bs

    let key = "ufs_reveal_deleted_fb_messages";
    let savedMessages = JSON.parse(localStorage.getItem(key) ?? "[]");

    console.log(
      "Load " + savedMessages.length + " messages from localStorage."
    );

    requireLazy(
      ["MWV2ChatUnsentMessage.bs", "MWPBaseMessage.bs", "MqttProtocolClient"],
      (MWV2ChatUnsentMessage, MWPBaseMessage, MqttProtocolClient) => {
        // Override unsent message component
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
                UsefulScriptGlobalWebpageContext.Facebook.decodeArrId(
                  threadKey
                );
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

        // Listen for chat event
        const MqttProtocolClientOrig = MqttProtocolClient.prototype.publish;
        MqttProtocolClient.prototype.publish = function () {
          let b = arguments[1];
          console.log(b);
          // if (b && b.includes('\\\\\\"text\\\\\\":')) {
          //   (function () {
          //     b = JSON.parse(b);
          //     if (!b || !b.payload) return;
          //     let payload = JSON.parse(b.payload);
          //     if (!payload || !payload.tasks) return;

          //     payload.tasks = payload.tasks.map((task) => {
          //       let payload = JSON.parse(task.payload);
          //       if (!payload || !payload.text) return task;
          //       if (payload.text.length > 1 && payload.text[0] === ">") {
          //         payload.text = encode(payload.text.substr(1));
          //       }
          //       task.payload = JSON.stringify(payload);
          //       return task;
          //     });

          //     b.payload = JSON.stringify(payload);
          //     b = JSON.stringify(b);
          //   })();
          //   arguments[1] = b;
          // }
          return MqttProtocolClientOrig.apply(this, arguments);
        };
      }
    );

    // Test who is typing
    // MWChatTypingIndicator.bs
    // MWPTypingIndicators.bs
    requireLazy(["LSUpdateTypingIndicator"], (LSUpdateTypingIndicator) => {
      alert("abc");
      // const LSUpdateTypingIndicatorOrig = LSUpdateTypingIndicator;

      // LSUpdateTypingIndicator = function () {
      //   console.log(arguments);
      //   return LSUpdateTypingIndicatorOrig.apply(this, arguments);
      // };
    });

    let emptyFunc = void 0;
    Object.defineProperty(window, "__d", {
      get: () => emptyFunc,
      set: (i) => {
        const c = new Proxy(i, {
          apply: function (target, thisArg, arg) {
            console.log(thisArg);
            return target(...arg);
          },
        });
        emptyFunc = c;
      },
    });
  },
};
