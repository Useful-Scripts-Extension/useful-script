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
  infoLink:
    "https://www.facebook.com/groups/j2team.community/posts/1651683238497123/",

  whiteList: ["https://*.facebook.com/*", "https://*.messenger.com/*"],

  onDocumentStart: () => {
    const WebSocketOrig = window.WebSocket;
    window.WebSocket = function fakeConstructor(dt, config) {
      // hàm hỗ trợ
      const isMsgIdStr = (str) => str?.startsWith("mid.$");
      const isLink = (str) => str?.startsWith("https://");

      // Hàm decode data websocket về tiếng việt, loại bỏ những thằng \\
      const parse = (str) => {
        let ret = str;
        let limit = 10;
        while (--limit > 0) {
          try {
            if (ret[0] === '"') ret = JSON.parse(ret);
            else ret = JSON.parse(`"${ret}"`);
          } catch (e) {
            break;
          }
        }
        return ret;
      };

      const ChatType = {
        text: "text",
        image: "image",
        video: "video",
        GIF: "gif",
        audio: "audio",
        attachment: "attachment",
        sticker: "sticker",
        add_reaction: "add_reaction",
        remove_reaction: "remove_reaction",
        share_location: "share_location",
        pending: "pending",
        user_data: "user_data",
        delete_msg: "delete_msg",
      };

      function findAllChatData(all_strings) {
        let chats = [];
        for (let i = 0; i < all_strings.length; i++) {
          const str_i = all_strings[i];

          // Tin nhắn chữ
          if (str_i === "insertMessage" && isMsgIdStr(all_strings[i + 2])) {
            const content = all_strings[i + 1];
            if (content) {
              chats.push({
                type: ChatType.text,
                content: content,
                id: all_strings[i + 2],
              });
            }
          }

          // Tin nhắn đính kèm: image / gif / video / âm thanh / file
          if (str_i === "insertBlobAttachment" && isLink(all_strings[i + 2])) {
            const a1 = all_strings[i + 1];
            const isImg = a1?.startsWith("image-");
            const isGif = a1?.startsWith("gif-");
            const isVideo = a1?.startsWith("video-");
            const isAudio = a1?.startsWith("audioclip-");
            const type = isImg
              ? ChatType.image
              : isGif
              ? ChatType.GIF
              : isVideo
              ? ChatType.video
              : isAudio
              ? ChatType.audio
              : ChatType.attachment;

            for (let j = i; j < all_strings.length - 1; j++) {
              if (isMsgIdStr(all_strings[j])) {
                chats.push({
                  type: type,
                  content: all_strings[i + 2],
                  id: all_strings[j],
                });
                break;
              }
            }
          }

          // Tin nhắn nhãn dán
          if (
            str_i === "insertMessage" &&
            isMsgIdStr(all_strings[i + 1]) &&
            isLink(all_strings[i + 6])
          ) {
            chats.push({
              type: ChatType.sticker,
              content: all_strings[i + 6],
              id: all_strings[i + 1],
            });
          }

          // Thả react
          if (str_i === "upsertReaction" && isMsgIdStr(all_strings[i + 1])) {
            chats.push({
              type: ChatType.add_reaction,
              content: all_strings[i + 2],
              id: all_strings[i + 1],
            });
          }

          // Gỡ react
          if (str_i === "deleteReaction" && isMsgIdStr(all_strings[i + 1])) {
            const id = all_strings[i + 1];
            const content =
              rvdfm_all_msgs.find((c) => c.id === id)?.content || "";

            chats.push({
              type: ChatType.remove_reaction,
              content: content,
              id: id,
            });
          }

          // Tin nhắn chia sẻ vị trí / vị trí trực tiếp
          if (
            str_i === "xma_live_location_sharing" &&
            isMsgIdStr(all_strings[i - 2]) &&
            isLink(all_strings[i + 1])
          ) {
            const link = all_strings[i + 1];

            chats.push({
              type: ChatType.share_location,
              content: link,
              id: all_strings[i - 2],
            });
          }

          // Thông tin user
          // if (str_i === "533" && isLink(all_strings[i + 1])) {
          //   const avatar = all_strings[i + 1];
          //   const user_name = all_strings[i + 2];

          //   chats.push({
          //     type: ChatType.user_data,
          //     avatar: avatar,
          //     name: user_name,
          //   });
          // }

          // Tin nhắn đang chờ
          // if (str_i === "130" && all_strings[i + 3] === "pending") {
          //   chats.push({
          //     type: ChatType.pending,
          //     content: all_strings[i + 1],
          //     avatar: all_strings[i + 2],
          //   });
          // }

          // Thu hồi tin nhắn
          if (
            str_i === "deleteThenInsertMessage" &&
            isMsgIdStr(all_strings[i + 2])
          ) {
            const id = all_strings[i + 2];
            const msgs =
              rvdfm_all_msgs.filter(
                (c) => c.id === id && c.type !== "Thu hồi"
              ) || [];

            chats.push({
              type: ChatType.delete_msg,
              msgs: msgs,
              id: id,
            });
          }
        }

        // Chèn thời gian hiện tại vào
        chats = chats.map((_) => ({ ..._, time: Date.now() }));

        console.log("Thông tin lọc được:", chats);
      }

      // ====== Start hacking ======
      const websocket_instant = new WebSocketOrig(dt, config);
      websocket_instant.addEventListener("message", async function (achunk) {
        const utf8_str = new TextDecoder("utf-8").decode(achunk.data);

        if (utf8_str[0] === "1" || utf8_str[0] === "2" || utf8_str[0] === "3") {
          const have_msg_id = /(?=mid\.\$)(.*?)(?=\\")/.exec(utf8_str);
          if (have_msg_id) {
            // Lấy ra tất cả các thông tin dùng được trong dữ liệu (những chuỗi nằm giữa 2 dấu nháy kép "")
            const all_strings_regex = /(\\\")(.*?)(\\\")(?=[,)])/g;
            let all_strings = utf8_str.match(all_strings_regex) || [];
            all_strings = all_strings.map((str) => parse(str));

            if (all_strings.length) {
              findAllChatData(all_strings);
            }
          }
        }
      });

      return websocket_instant;
    };
    window.WebSocket.prototype = WebSocketOrig.prototype;
    window.WebSocket.prototype.constructor = window.WebSocket;
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
      ["MWV2ChatUnsentMessage.bs", "MWPBaseMessage.bs"],
      (MWV2ChatUnsentMessage, MWPBaseMessage) => {
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
                UsefulScriptGlobalPageContext.Facebook.decodeArrId(threadKey);
              senderId =
                UsefulScriptGlobalPageContext.Facebook.decodeArrId(senderId);

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
      }
    );
  },
};
