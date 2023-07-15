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
      localStorage.ufs_rvdfm_all_msgs || "{}"
    );

    if (Array.isArray(window.ufs_rvdfm_all_msgs))
      window.ufs_rvdfm_all_msgs = {};

    window.addEventListener("beforeunload", () => {
      localStorage.ufs_rvdfm_all_msgs = JSON.stringify(
        window.ufs_rvdfm_all_msgs
      );
    });
    const UfsChatType = {
      text: "chữ",
      image: "ảnh",
      video: "video",
      gif: "gif",
      audioclip: "âm thanh",
      sticker: "sticker",
      share_location: "vị trí",
      realtime_location: "vị trí thực",
      link: "link",
      reply: "trả lời",
      add_reaction: "react",
      remove_reaction: "gỡ react",

      attachment: "đính kèm",
      sound: "sound",
      pending: "pending",
      user_data: "user_data",
      delete_msg: "delete_msg",
    };
    window.UfsChatType = UfsChatType;

    const WebSocketOrig = window.WebSocket;
    window.WebSocket = function fakeConstructor(dt, config) {
      const isMsgIdStr = (str) => str?.startsWith?.("mid.$");

      // recursive find all array in payload
      const findArray = (obj) => {
        let arr = [];
        for (let key in obj) {
          if (Array.isArray(obj[key]) && obj[key][0] === 5) {
            arr.push(obj[key].filter((i) => !Array.isArray(i)));
          } else if (typeof obj[key] === "object") {
            arr.push(...findArray(obj[key]));
          }
        }
        return arr;
      };

      const findMessageData = (payload) => {
        let all_arrays = findArray(payload);
        // console.log(all_arrays);

        let result = [];
        for (let arr of all_arrays) {
          let all_msg_id = arr.filter(
            (i) => typeof i === "string" && isMsgIdStr(i)
          );
          let msg_id = all_msg_id[0];

          // if (arr[1] === "upsertReaction") {
          //   result.push({
          //     msg_id,
          //     type: UfsChatType.add_reaction,
          //     data: arr[3],
          //   });
          // }

          // if (arr[1] === "deleteReaction") {
          //   result.push({
          //     msg_id,
          //     type: UfsChatType.remove_reaction,
          //   });
          // }

          if (arr[1] === "insertAttachmentCta") {
            if (arr[5] === "xma_live_location_sharing") {
              if (arr[7]) {
                result.push({
                  msg_id,
                  type: UfsChatType.share_location,
                  data: "https://www.google.com/maps/search/" + arr[7],
                });
              } else {
                result.push({
                  msg_id,
                  type: UfsChatType.realtime_location,
                  data: arr[6],
                });
              }
            }
            if (arr[5] === "xma_web_url") {
              result.push({
                msg_id,
                type: UfsChatType.link,
                data: arr[6],
              });
            }
          }

          if (arr[1] === "insertStickerAttachment") {
            result.push({
              msg_id,
              type: UfsChatType.sticker,
              data: arr[2],
            });
          }

          if (arr[1] === "insertBlobAttachment") {
            result.push({
              msg_id,
              type: UfsChatType[arr[2].split("-")[0]],
              data: arr[4],
            });
          }

          if (arr[1] === "insertMessage" && !isMsgIdStr(arr[2])) {
            if (isMsgIdStr(arr[7])) {
              // result.push({
              //   msg_id,
              //   type: UfsChatType.reply,
              //   data: {
              //     content: arr[2],
              //     reply_to: arr[7],
              //   },
              // });
            } else {
              result.push({
                msg_id,
                type: UfsChatType.text,
                data: arr[2],
              });
            }
          }

          if (arr[1] === "upsertMessage" && arr[2]) {
            result.push({
              msg_id,
              type: UfsChatType.text,
              data: arr[2],
            });
          }

          // if (arr[1] === "deleteThenInsertMessage") {
          //   result.push({
          //     msg_id,
          //     type: UfsChatType.delete_msg,
          //   });
          // }
        }

        result = result.map((_) => ({ ..._, saved_time: Date.now() }));
        return result;
      };

      const saveChatData = (chats) => {
        for (let c of chats) {
          window.ufs_rvdfm_all_msgs[c.msg_id] = {
            data: c.data,
            type: c.type,
            // saved_time: c.saved_time,
          };
        }
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
              let dataStr = utf8_str.slice(utf8_str.indexOf("{"));
              let data = JSON.parse(dataStr);
              let payload = JSON.parse(data?.["payload"]);

              let chats = findMessageData(payload);
              saveChatData(chats);

              console.log(window.ufs_rvdfm_all_msgs);
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
    requireLazy(["MWV2ChatUnsentMessage.react"], (MWV2ChatUnsentMessage) => {
      const origin = MWV2ChatUnsentMessage.MWV2ChatUnsentMessage;
      MWV2ChatUnsentMessage.MWV2ChatUnsentMessage = function (a) {
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
            let savedMsg = window.ufs_rvdfm_all_msgs[messageId];

            a.message.isUnsent = false;
            a.message.displayedContentTypes = [0, 1]; // text
            if (savedMsg) {
              let title = `[Tin thu hồi - ${savedMsg.type}]:\n`;
              let text = `${savedMsg?.data}`;
              a.message.text = title + text;
            } else {
              a.message.text = "[Tin thu hồi]: -Không có dữ liệu-";
            }
          }
        }
        return origin.apply(this, arguments);
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
