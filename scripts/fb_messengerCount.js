import { showLoading } from "./helpers/utils.js";

export default {
  icon: '<i class="fa-solid fa-comments fa-lg"></i>',
  name: {
    en: "Facebook - Messenger count",
    vi: "Facebook - Đếm tin nhắn",
  },
  description: {
    en: "Counts the number of messages sent from your Facebook Messenger account.",
    vi: "Đếm tin nhắn từ tài khoản Facebook Messenger của bạn.",
  },

  onClickExtension: async () => {
    let { closeLoading, setLoadingText } = showLoading("Đang chuẩn bị...");
    try {
      setLoadingText("Đang lấy token...");
      let dtsg = await UsefulScriptGlobalPageContext.Facebook.getFbdtsg();
      let uid = await UsefulScriptGlobalPageContext.Facebook.getYourUserId();

      setLoadingText("Đang lấy dữ liệu tin nhắn...");
      let msgData = await UsefulScriptGlobalPageContext.Facebook.messagesCount(
        dtsg
      );

      let { count: threadCount, nodes } = msgData.viewer.message_threads;
      let ranking = nodes
        .map((node, i) => ({ ...node, recent: i })) // inject recent rank
        .sort((a, b) => b.messages_count - a.messages_count) // calculate count rank
        .map((node) => {
          let participants = node.all_participants.nodes
            .filter((p) => p.messaging_actor.id !== uid)
            .map((p) => ({
              id: p.messaging_actor.id,
              name: p.messaging_actor.name,
              avatar: p.messaging_actor.profile_picture.uri,
            }));

          return {
            type: node.thread_type,
            id: atob(node.id)?.split(":")?.[1],
            count: node.messages_count,
            name: node.name || participants[0]?.name || "-no data-",
            participants: participants,
          };
        });

      localStorage.ufs_fb_msg_kount = JSON.stringify(ranking);

      window.open(
        await UsefulScriptGlobalPageContext.Extension.getURL(
          "scripts/fb_messengerCount.html"
        )
      );
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }
  },
};
