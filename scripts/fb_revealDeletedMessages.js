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
    window.ufs_rvdfm_all_msgs = JSON.parse(
      localStorage.ufs_rvdfm_all_msgs || "[]"
    );
    window.addEventListener("beforeunload", () => {
      localStorage.ufs_rvdfm_all_msgs = JSON.stringify(
        window.ufs_rvdfm_all_msgs
      );
    });
    window.UfsChatType = {
      text: "chữ",
      image: "ảnh",
      video: "video",
      GIF: "gif",
      audio: "âm thanh",
      attachment: "đính kèm",
      sticker: "sticker",
      sound: "sound",
      add_reaction: "react",
      remove_reaction: "gỡ react",
      share_location: "vị trí",
      realtime_location: "vị trí thực",
      pending: "pending",
      user_data: "user_data",
      delete_msg: "delete_msg",
    };

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

      const findAllChatData = (all_strings) => {
        let chats = [];
        for (let i = 0; i < all_strings.length; i++) {
          const str_i = all_strings[i];

          // Tin nhắn chữ
          if (str_i === "insertMessage" && isMsgIdStr(all_strings[i + 2])) {
            const content = all_strings[i + 1];
            if (content) {
              chats.push({
                type: window.UfsChatType.text,
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
              ? window.UfsChatType.image
              : isGif
              ? window.UfsChatType.GIF
              : isVideo
              ? window.UfsChatType.video
              : isAudio
              ? window.UfsChatType.audio
              : window.UfsChatType.attachment;

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
            (all_strings[i - 1].includes("nhãn dán") ||
              all_strings[i - 1].includes("sticker"))
          ) {
            chats.push({
              type: window.UfsChatType.sticker,
              content: parse(
                all_strings.join("").match(/"playableUrl":"(.*?)"/)?.[1] ||
                  "-no data-"
              ),
              id: all_strings[i + 1],
            });
          }

          // Tin nhắn sound
          if (
            str_i === "insertMessage" &&
            isMsgIdStr(all_strings[i + 5]) &&
            all_strings[i - 1].includes("sound")
          ) {
            chats.push({
              type: window.UfsChatType.sound,
              content: parse(
                all_strings[i + 1] || ""
                // all_strings[i + 7].match(/"playableUrl":"(.*?)"/)?.[1] || ""
              ),
              id: all_strings[i + 5],
            });
          }

          // Thả react
          // if (str_i === "upsertReaction" && isMsgIdStr(all_strings[i + 1])) {
          //   chats.push({
          //     type: ChatType.add_reaction,
          //     content: all_strings[i + 2],
          //     id: all_strings[i + 1],
          //   });
          // }

          // Gỡ react
          // if (str_i === "deleteReaction" && isMsgIdStr(all_strings[i + 1])) {
          //   const id = all_strings[i + 1];
          //   const content =
          //     rvdfm_all_msgs.find((c) => c.id === id)?.content || "";

          //   chats.push({
          //     type: ChatType.remove_reaction,
          //     content: content,
          //     id: id,
          //   });
          // }

          // Tin nhắn chia sẻ vị trí / vị trí trực tiếp
          if (str_i.includes("xma_live_location_sharing")) {
            if (isMsgIdStr(all_strings[i + 8])) {
              chats.push({
                type: window.UfsChatType.share_location,
                content: parse(
                  all_strings[i + 1].match(/"actionUrl":"(.*?)"/)?.[1] || ""
                ),
                id: all_strings[i + 8],
              });
            }
            if (isMsgIdStr(all_strings[i - 10])) {
              chats.push({
                type: window.UfsChatType.realtime_location,
                content: parse(
                  all_strings[i + 1].match(/"actionUrl":"(.*?)"/)?.[1] || ""
                ),
                id: all_strings[i - 10],
              });
            }
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
          // if (
          //   str_i === "deleteThenInsertMessage" &&
          //   isMsgIdStr(all_strings[i + 2])
          // ) {
          //   const id = all_strings[i + 2];
          //   const msgs =
          //     rvdfm_all_msgs.filter(
          //       (c) => c.id === id && c.type !== "Thu hồi"
          //     ) || [];

          //   chats.push({
          //     type: ChatType.delete_msg,
          //     msgs: msgs,
          //     id: id,
          //   });
          // }
        }

        // Chèn thời gian hiện tại vào
        chats = chats.map((_) => ({ ..._, saved_time: Date.now() }));
        return chats;
      };

      const saveChatData = (chats) => {
        let oldData = window.ufs_rvdfm_all_msgs || [];
        let newData = [];
        for (let c of chats) {
          let isDuplicated =
            oldData.find((m) => JSON.stringify(c) === JSON.stringify(m)) !=
            null;

          if (!isDuplicated) newData.push(c);
        }
        window.ufs_rvdfm_all_msgs = oldData.concat(newData);
      };

      // ====== Start hacking ======
      let textDecoder = new TextDecoder("utf-8");
      const websocket_instant = new WebSocketOrig(dt, config);
      websocket_instant.addEventListener("message", async function (achunk) {
        try {
          const utf8_str = textDecoder.decode(achunk.data);

          if (
            utf8_str[0] === "1" ||
            utf8_str[0] === "2" ||
            utf8_str[0] === "3"
          ) {
            const have_msg_id = /(?=mid\.\$)(.*?)(?=\\")/.exec(utf8_str);
            if (have_msg_id) {
              let all_strings = (
                utf8_str.match(/(\\\")(.*?)(\\\")(?=[,)])/g) || []
              ).map((str) => parse(str));

              if (all_strings.length) {
                let chats = findAllChatData(all_strings);
                chats.length && saveChatData(chats);
              }
            }
          }
        } catch (e) {
          console.log("ERROR: ", e);
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
    // LSDeleteThenInsertThread

    // TODO hiển thị đúng component react cho từng loại tin nhắn
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
              UsefulScriptGlobalPageContext.Facebook.decodeArrId(threadKey);
            senderId =
              UsefulScriptGlobalPageContext.Facebook.decodeArrId(senderId);

            let savedMsg = window.ufs_rvdfm_all_msgs.find(
              (_) => _.id === messageId
            );

            a.message.isUnsent = false;
            if (savedMsg) {
              let title = `[Tin thu hồi - ${savedMsg.type}]:\n`;
              let text = `${savedMsg?.content}`;
              a.message.text = title + text;
            } else {
              a.message.text = "[Tin thu hồi]: -Không có dữ liệu-";
            }
          }
        }
        return MWV2ChatUnsentMessageOrig.apply(this, arguments);
      };
    });
  },

  onClick: () => {
    let len = window.ufs_rvdfm_all_msgs.length;
    if (!len) alert("Chức năng chưa lưu được tin nhắn nào.");
    else if (
      confirm(
        `Bạn có chắc muốn xóa tất cả ${len} tin nhắn` +
          ` đã được lưu bởi chức năng này?\n\n` +
          `+ Chỉ nên xóa khi thấy đã lưu quá nhiều tin nhắn.\n` +
          `+ Sau khi xóa, nếu có người thu hồi tin nhắn, mà tin đó chưa được lưu\n` +
          `   thì bạn sẽ ko biết được nội dung tin nhắn.`
      )
    ) {
      window.ufs_rvdfm_all_msgs = [];
      alert("Đã xóa " + len + " tin nhắn khỏi bộ nhớ.");
    }
  },
};
